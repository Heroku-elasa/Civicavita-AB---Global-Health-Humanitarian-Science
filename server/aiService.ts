import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { db } from "./db";
import { aiProviders, aiUsage, aiLogs } from "../shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface AIProviderConfig {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  endpoint: string;
  model: string;
  apiKeyEnvVar: string;
  limits: {
    requestsPerMinute: number;
    requestsPerDay: number;
    tokensPerMinute: number;
  };
}

interface FallbackResult {
  text: string;
  providerId: string;
  tokensUsed: number;
  duration: number;
}

const DEFAULT_PROVIDERS: AIProviderConfig[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    enabled: true,
    priority: 1,
    endpoint: "https://generativelanguage.googleapis.com",
    model: "gemini-2.5-flash-preview-05-20",
    apiKeyEnvVar: "GEMINI_API_KEY",
    limits: { requestsPerMinute: 15, requestsPerDay: 1500, tokensPerMinute: 1000000 },
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    enabled: true,
    priority: 2,
    endpoint: "https://openrouter.ai/api/v1",
    model: "google/gemini-2.0-flash-001",
    apiKeyEnvVar: "OPENROUTER_API_KEY",
    limits: { requestsPerMinute: 50, requestsPerDay: 500, tokensPerMinute: 500000 },
  },
  {
    id: "cloudflare",
    name: "Cloudflare Workers AI",
    enabled: true,
    priority: 3,
    endpoint: "https://api.cloudflare.com/client/v4/accounts",
    model: "@cf/meta/llama-3.2-3b-instruct",
    apiKeyEnvVar: "CLOUDFLARE_API_TOKEN",
    limits: { requestsPerMinute: 30, requestsPerDay: 300, tokensPerMinute: 200000 },
  },
  {
    id: "openai",
    name: "OpenAI",
    enabled: true,
    priority: 4,
    endpoint: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
    apiKeyEnvVar: "OPENAI_API_KEY",
    limits: { requestsPerMinute: 60, requestsPerDay: 10000, tokensPerMinute: 150000 },
  },
];

async function logAICall(
  providerId: string,
  functionName: string,
  status: "success" | "error" | "fallback",
  durationMs: number,
  tokensUsed: number,
  errorMessage?: string,
  requestPreview?: string,
  responsePreview?: string
) {
  try {
    await db.insert(aiLogs).values({
      providerId,
      functionName,
      status,
      durationMs,
      tokensUsed,
      errorMessage,
      requestPreview: requestPreview?.substring(0, 500),
      responsePreview: responsePreview?.substring(0, 500),
    });

    const today = new Date().toISOString().split("T")[0];
    await db
      .insert(aiUsage)
      .values({
        providerId,
        date: today,
        requestsCount: 1,
        tokensCount: tokensUsed,
        errorsCount: status === "error" ? 1 : 0,
      })
      .onConflictDoUpdate({
        target: [aiUsage.providerId, aiUsage.date],
        set: {
          requestsCount: sql`${aiUsage.requestsCount} + 1`,
          tokensCount: sql`${aiUsage.tokensCount} + ${tokensUsed}`,
          errorsCount:
            status === "error"
              ? sql`${aiUsage.errorsCount} + 1`
              : aiUsage.errorsCount,
        },
      });
  } catch (e) {
    console.error("Failed to log AI call:", e);
  }
}

async function callGemini(prompt: string, maxTokens: number, temperature: number): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-05-20",
    contents: prompt,
    config: {
      maxOutputTokens: maxTokens,
      temperature,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return text;
}

async function callOpenRouter(prompt: string, maxTokens: number, temperature: number): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.REPLIT_DEPLOYMENT_URL || "https://replit.com",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

async function callCloudflare(prompt: string, maxTokens: number, temperature: number): Promise<string> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) throw new Error("Cloudflare credentials not set");

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.2-3b-instruct`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        max_tokens: maxTokens,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cloudflare error: ${error}`);
  }

  const data = await response.json();
  return data.result?.response || "";
}

async function callOpenAI(prompt: string, maxTokens: number, temperature: number): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
    temperature,
  });

  return completion.choices[0]?.message?.content || "";
}

export async function getProviders(): Promise<AIProviderConfig[]> {
  try {
    const dbProviders = await db.select().from(aiProviders).orderBy(aiProviders.priority);
    if (dbProviders.length === 0) {
      await initializeDefaultProviders();
      return DEFAULT_PROVIDERS;
    }
    return dbProviders.map((p) => ({
      id: p.id,
      name: p.name,
      enabled: p.enabled,
      priority: p.priority,
      endpoint: p.endpoint || "",
      model: p.model || "",
      apiKeyEnvVar: p.apiKeyEnvVar || "",
      limits: {
        requestsPerMinute: p.requestsPerMinute || 15,
        requestsPerDay: p.requestsPerDay || 1500,
        tokensPerMinute: p.tokensPerMinute || 1000000,
      },
    }));
  } catch (e) {
    console.error("Error fetching providers:", e);
    return DEFAULT_PROVIDERS;
  }
}

export async function initializeDefaultProviders() {
  for (const provider of DEFAULT_PROVIDERS) {
    await db
      .insert(aiProviders)
      .values({
        id: provider.id,
        name: provider.name,
        enabled: provider.enabled,
        priority: provider.priority,
        endpoint: provider.endpoint,
        model: provider.model,
        apiKeyEnvVar: provider.apiKeyEnvVar,
        requestsPerMinute: provider.limits.requestsPerMinute,
        requestsPerDay: provider.limits.requestsPerDay,
        tokensPerMinute: provider.limits.tokensPerMinute,
      })
      .onConflictDoNothing();
  }
}

export async function callWithFallback(
  prompt: string,
  functionName: string,
  maxTokens: number = 4096,
  temperature: number = 0.7
): Promise<FallbackResult> {
  const providers = await getProviders();
  const enabledProviders = providers.filter((p) => p.enabled).sort((a, b) => a.priority - b.priority);

  let lastError: Error | null = null;

  for (const provider of enabledProviders) {
    const startTime = Date.now();
    try {
      let text: string;

      switch (provider.id) {
        case "gemini":
          text = await callGemini(prompt, maxTokens, temperature);
          break;
        case "openrouter":
          text = await callOpenRouter(prompt, maxTokens, temperature);
          break;
        case "cloudflare":
          text = await callCloudflare(prompt, maxTokens, temperature);
          break;
        case "openai":
          text = await callOpenAI(prompt, maxTokens, temperature);
          break;
        default:
          continue;
      }

      const duration = Date.now() - startTime;
      const tokensUsed = Math.ceil(text.length / 4);

      await logAICall(
        provider.id,
        functionName,
        lastError ? "fallback" : "success",
        duration,
        tokensUsed,
        undefined,
        prompt.substring(0, 100),
        text.substring(0, 100)
      );

      return { text, providerId: provider.id, tokensUsed, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      lastError = error as Error;

      await logAICall(
        provider.id,
        functionName,
        "error",
        duration,
        0,
        lastError.message,
        prompt.substring(0, 100)
      );

      console.error(`Provider ${provider.id} failed:`, lastError.message);
    }
  }

  throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
}

export async function testProvider(providerId: string): Promise<{ success: boolean; message: string; duration?: number }> {
  const startTime = Date.now();
  const testPrompt = "Say 'Hello' in exactly one word.";

  try {
    let response: string;
    switch (providerId) {
      case "gemini":
        response = await callGemini(testPrompt, 50, 0.1);
        break;
      case "openrouter":
        response = await callOpenRouter(testPrompt, 50, 0.1);
        break;
      case "cloudflare":
        response = await callCloudflare(testPrompt, 50, 0.1);
        break;
      case "openai":
        response = await callOpenAI(testPrompt, 50, 0.1);
        break;
      default:
        return { success: false, message: "Unknown provider" };
    }

    const duration = Date.now() - startTime;
    return { success: true, message: `Response: ${response.substring(0, 50)}`, duration };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
