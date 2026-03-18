import { pgTable, serial, text, varchar, boolean, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const storyProjectsTable = pgTable("story_projects", {
  id: serial("id").primaryKey(),
  playerId: uuid("player_id").notNull().unique(),
  status: varchar("status", { length: 50 }).notNull().default("intake_in_progress"),
  assignedAuthor: varchar("assigned_author", { length: 100 }),
  assignedIllustrator: varchar("assigned_illustrator", { length: 100 }),
  draftVersion: integer("draft_version").notNull().default(1),
  academyPreviewEnabled: boolean("academy_preview_enabled").notNull().default(false),
  academyApproved: boolean("academy_approved").notNull().default(false),
  finalApproved: boolean("final_approved").notNull().default(false),
  lastEditedBy: varchar("last_edited_by", { length: 100 }),
  editorNotes: text("editor_notes"),
  revisionNotes: text("revision_notes"),
  bookFormat: varchar("book_format", { length: 30 }).default("a5"),
  assignedEditorId: integer("assigned_editor_id"),
  assignedAuthorId: integer("assigned_author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStoryProjectSchema = createInsertSchema(storyProjectsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertStoryProject = z.infer<typeof insertStoryProjectSchema>;
export type StoryProject = typeof storyProjectsTable.$inferSelect;

export const STORY_STATUSES = [
  "intake_in_progress",
  "intake_complete",
  "profile_ready",
  "blueprint_in_progress",
  "draft_in_progress",
  "internal_review",
  "academy_preview",
  "revisions_in_progress",
  "approved",
  "ready_for_illustration",
  "illustration_in_progress",
  "final_ready",
] as const;

export type StoryStatus = typeof STORY_STATUSES[number];
