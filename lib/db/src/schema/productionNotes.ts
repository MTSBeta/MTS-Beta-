import { pgTable, serial, integer, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productionNotesTable = pgTable("production_notes", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  noteType: varchar("note_type", { length: 50 }).notNull().default("general"),
  content: text("content").notNull(),
  createdBy: varchar("created_by", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductionNoteSchema = createInsertSchema(productionNotesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertProductionNote = z.infer<typeof insertProductionNoteSchema>;
export type ProductionNote = typeof productionNotesTable.$inferSelect;

export const NOTE_TYPES = ["general", "editor", "revision", "activity", "author"] as const;
