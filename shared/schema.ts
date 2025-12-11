import { pgTable, serial, text, timestamp, integer, boolean, date, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const grants = pgTable("grants", {
  id: serial("id").primaryKey(),
  link: text("link").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  amount: text("amount"),
  deadline: text("deadline"),
  organization: text("organization"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const postImages = pgTable("post_images", {
  id: text("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectImages = pgTable("project_images", {
  id: text("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiProviders = pgTable("ai_providers", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  priority: integer("priority").default(0).notNull(),
  endpoint: text("endpoint"),
  model: varchar("model", { length: 100 }),
  apiKeyEnvVar: varchar("api_key_env_var", { length: 100 }),
  requestsPerMinute: integer("requests_per_minute").default(15),
  requestsPerDay: integer("requests_per_day").default(1500),
  tokensPerMinute: integer("tokens_per_minute").default(1000000),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiUsage = pgTable("ai_usage", {
  id: serial("id").primaryKey(),
  providerId: varchar("provider_id", { length: 50 }).references(() => aiProviders.id),
  date: date("date").defaultNow().notNull(),
  requestsCount: integer("requests_count").default(0).notNull(),
  tokensCount: integer("tokens_count").default(0).notNull(),
  errorsCount: integer("errors_count").default(0).notNull(),
});

export const aiLogs = pgTable("ai_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  providerId: varchar("provider_id", { length: 50 }),
  functionName: varchar("function_name", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull(),
  durationMs: integer("duration_ms"),
  tokensUsed: integer("tokens_used"),
  errorMessage: text("error_message"),
  requestPreview: text("request_preview"),
  responsePreview: text("response_preview"),
});

export const aiProvidersRelations = relations(aiProviders, ({ many }) => ({
  usage: many(aiUsage),
  logs: many(aiLogs),
}));

export const aiUsageRelations = relations(aiUsage, ({ one }) => ({
  provider: one(aiProviders, {
    fields: [aiUsage.providerId],
    references: [aiProviders.id],
  }),
}));

export const aiLogsRelations = relations(aiLogs, ({ one }) => ({
  provider: one(aiProviders, {
    fields: [aiLogs.providerId],
    references: [aiProviders.id],
  }),
}));

export type Grant = typeof grants.$inferSelect;
export type InsertGrant = typeof grants.$inferInsert;
export type PostImage = typeof postImages.$inferSelect;
export type InsertPostImage = typeof postImages.$inferInsert;
export type ProjectImage = typeof projectImages.$inferSelect;
export type InsertProjectImage = typeof projectImages.$inferInsert;
export type AIProvider = typeof aiProviders.$inferSelect;
export type InsertAIProvider = typeof aiProviders.$inferInsert;
export type AIUsage = typeof aiUsage.$inferSelect;
export type InsertAIUsage = typeof aiUsage.$inferInsert;
export type AILog = typeof aiLogs.$inferSelect;
export type InsertAILog = typeof aiLogs.$inferInsert;
