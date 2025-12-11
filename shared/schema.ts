import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
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

export type Grant = typeof grants.$inferSelect;
export type InsertGrant = typeof grants.$inferInsert;
export type PostImage = typeof postImages.$inferSelect;
export type InsertPostImage = typeof postImages.$inferInsert;
export type ProjectImage = typeof projectImages.$inferSelect;
export type InsertProjectImage = typeof projectImages.$inferInsert;
