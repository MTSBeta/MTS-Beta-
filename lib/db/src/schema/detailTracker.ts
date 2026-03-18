import { pgTable, serial, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const detailTrackerTable = pgTable("detail_tracker", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  itemKey: varchar("item_key", { length: 100 }).notNull(),
  itemLabel: varchar("item_label", { length: 200 }).notNull(),
  itemValue: text("item_value"),
  usageStatus: varchar("usage_status", { length: 30 }).notNull().default("unused"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDetailTrackerSchema = createInsertSchema(detailTrackerTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertDetailTracker = z.infer<typeof insertDetailTrackerSchema>;
export type DetailTracker = typeof detailTrackerTable.$inferSelect;

export const TRACKER_USAGE_STATUSES = ["unused", "partially_used", "clearly_used"] as const;

export const DEFAULT_TRACKER_ITEMS = [
  { key: "meaningful_object", label: "Meaningful Object at Home" },
  { key: "support_figure", label: "Support Figure" },
  { key: "overlooked_moment", label: "Overlooked / Disappointment Moment" },
  { key: "hidden_quality", label: "Hidden Quality" },
  { key: "club_value", label: "Club Value" },
  { key: "future_dream", label: "Future Dream / Goal" },
  { key: "appearance_notes", label: "Image-Based Appearance Notes" },
  { key: "emotional_challenge", label: "Emotional Challenge" },
  { key: "turning_point", label: "Turning Point Moment" },
  { key: "signature_ritual", label: "Signature Ritual or Routine" },
] as const;
