import { Router, Request, Response } from "express";
import { db } from "./db";
import { aiProviders, aiUsage, aiLogs } from "../shared/schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import { getProviders, initializeDefaultProviders, testProvider, callWithFallback } from "./aiService";

const router = Router();

router.get("/api/admin/ai/providers", async (req: Request, res: Response) => {
  try {
    const providers = await getProviders();
    
    const today = new Date().toISOString().split("T")[0];
    const usageData = await db
      .select()
      .from(aiUsage)
      .where(eq(aiUsage.date, today));

    const usageMap = new Map(usageData.map((u) => [u.providerId, u]));

    const providersWithUsage = providers.map((p) => {
      const usage = usageMap.get(p.id);
      const hasApiKey = !!process.env[p.apiKeyEnvVar];
      return {
        ...p,
        hasApiKey,
        usage: {
          requestsToday: usage?.requestsCount || 0,
          tokensToday: usage?.tokensCount || 0,
          errorsToday: usage?.errorsCount || 0,
        },
      };
    });

    res.json(providersWithUsage);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ error: "Failed to fetch providers" });
  }
});

router.post("/api/admin/ai/providers", async (req: Request, res: Response) => {
  try {
    const { id, name, enabled, priority, endpoint, model, apiKeyEnvVar, limits } = req.body;

    await db.insert(aiProviders).values({
      id,
      name,
      enabled: enabled ?? true,
      priority: priority ?? 99,
      endpoint,
      model,
      apiKeyEnvVar,
      requestsPerMinute: limits?.requestsPerMinute ?? 15,
      requestsPerDay: limits?.requestsPerDay ?? 1500,
      tokensPerMinute: limits?.tokensPerMinute ?? 1000000,
    });

    res.json({ success: true, message: "Provider added" });
  } catch (error) {
    console.error("Error adding provider:", error);
    res.status(500).json({ error: "Failed to add provider" });
  }
});

router.put("/api/admin/ai/providers/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, enabled, priority, endpoint, model, apiKeyEnvVar, limits } = req.body;

    const updates: any = { updatedAt: new Date() };
    if (name !== undefined) updates.name = name;
    if (enabled !== undefined) updates.enabled = enabled;
    if (priority !== undefined) updates.priority = priority;
    if (endpoint !== undefined) updates.endpoint = endpoint;
    if (model !== undefined) updates.model = model;
    if (apiKeyEnvVar !== undefined) updates.apiKeyEnvVar = apiKeyEnvVar;
    if (limits?.requestsPerMinute !== undefined) updates.requestsPerMinute = limits.requestsPerMinute;
    if (limits?.requestsPerDay !== undefined) updates.requestsPerDay = limits.requestsPerDay;
    if (limits?.tokensPerMinute !== undefined) updates.tokensPerMinute = limits.tokensPerMinute;

    await db.update(aiProviders).set(updates).where(eq(aiProviders.id, id));

    res.json({ success: true, message: "Provider updated" });
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).json({ error: "Failed to update provider" });
  }
});

router.delete("/api/admin/ai/providers/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.delete(aiProviders).where(eq(aiProviders.id, id));
    res.json({ success: true, message: "Provider deleted" });
  } catch (error) {
    console.error("Error deleting provider:", error);
    res.status(500).json({ error: "Failed to delete provider" });
  }
});

router.post("/api/admin/ai/providers/:id/test", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await testProvider(id);
    res.json(result);
  } catch (error) {
    console.error("Error testing provider:", error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

router.put("/api/admin/ai/providers/reorder", async (req: Request, res: Response) => {
  try {
    const { order } = req.body;
    
    for (let i = 0; i < order.length; i++) {
      await db
        .update(aiProviders)
        .set({ priority: i + 1, updatedAt: new Date() })
        .where(eq(aiProviders.id, order[i]));
    }

    res.json({ success: true, message: "Order updated" });
  } catch (error) {
    console.error("Error reordering providers:", error);
    res.status(500).json({ error: "Failed to reorder providers" });
  }
});

router.get("/api/admin/ai/usage", async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const usage = await db
      .select()
      .from(aiUsage)
      .where(gte(aiUsage.date, startDate.toISOString().split("T")[0]))
      .orderBy(desc(aiUsage.date));

    res.json(usage);
  } catch (error) {
    console.error("Error fetching usage:", error);
    res.status(500).json({ error: "Failed to fetch usage" });
  }
});

router.get("/api/admin/ai/logs", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const status = req.query.status as string;
    const providerId = req.query.providerId as string;
    const functionName = req.query.functionName as string;

    let query = db.select().from(aiLogs).orderBy(desc(aiLogs.timestamp)).limit(limit).offset(offset);

    const logs = await query;

    let filteredLogs = logs;
    if (status) filteredLogs = filteredLogs.filter((l) => l.status === status);
    if (providerId) filteredLogs = filteredLogs.filter((l) => l.providerId === providerId);
    if (functionName) filteredLogs = filteredLogs.filter((l) => l.functionName === functionName);

    res.json(filteredLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

router.delete("/api/admin/ai/logs", async (req: Request, res: Response) => {
  try {
    await db.delete(aiLogs);
    res.json({ success: true, message: "Logs cleared" });
  } catch (error) {
    console.error("Error clearing logs:", error);
    res.status(500).json({ error: "Failed to clear logs" });
  }
});

router.get("/api/admin/ai/logs/export", async (req: Request, res: Response) => {
  try {
    const format = req.query.format as string || "json";
    const logs = await db.select().from(aiLogs).orderBy(desc(aiLogs.timestamp));

    if (format === "csv") {
      const headers = "id,timestamp,providerId,functionName,status,durationMs,tokensUsed,errorMessage\n";
      const rows = logs
        .map((l) =>
          `${l.id},"${l.timestamp}","${l.providerId}","${l.functionName}","${l.status}",${l.durationMs},${l.tokensUsed},"${l.errorMessage || ""}"`
        )
        .join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=ai-logs.csv");
      res.send(headers + rows);
    } else {
      res.json(logs);
    }
  } catch (error) {
    console.error("Error exporting logs:", error);
    res.status(500).json({ error: "Failed to export logs" });
  }
});

router.post("/api/admin/ai/test-function", async (req: Request, res: Response) => {
  try {
    const { prompt, maxTokens, temperature } = req.body;
    const result = await callWithFallback(prompt, "test-function", maxTokens || 500, temperature || 0.7);
    res.json({
      success: true,
      response: result.text,
      provider: result.providerId,
      duration: result.duration,
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post("/api/admin/ai/health-check", async (req: Request, res: Response) => {
  try {
    const providers = await getProviders();
    const results: Record<string, { success: boolean; message: string; duration?: number }> = {};

    for (const provider of providers.filter((p) => p.enabled)) {
      results[provider.id] = await testProvider(provider.id);
    }

    res.json(results);
  } catch (error) {
    console.error("Error running health check:", error);
    res.status(500).json({ error: "Health check failed" });
  }
});

router.post("/api/admin/ai/init", async (req: Request, res: Response) => {
  try {
    await initializeDefaultProviders();
    res.json({ success: true, message: "Default providers initialized" });
  } catch (error) {
    console.error("Error initializing providers:", error);
    res.status(500).json({ error: "Failed to initialize providers" });
  }
});

router.post("/api/ai/generate", async (req: Request, res: Response) => {
  try {
    const { prompt, functionName, maxTokens, temperature } = req.body;
    const result = await callWithFallback(
      prompt,
      functionName || "api-generate",
      maxTokens || 4096,
      temperature || 0.7
    );
    res.json({
      text: result.text,
      provider: result.providerId,
      duration: result.duration,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
