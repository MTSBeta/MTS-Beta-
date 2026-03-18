import { pgTable, serial, integer, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const storyBlueprintsTable = pgTable("story_blueprints", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().unique(),
  coreIdentity: text("core_identity"),
  emotionalChallenge: text("emotional_challenge"),
  falseBelief: text("false_belief"),
  hiddenStrength: text("hidden_strength"),
  supportFigure: text("support_figure"),
  academyValues: text("academy_values"),
  keyFootballTest: text("key_football_test"),
  turningPoint: text("turning_point"),
  lessonTheme: text("lesson_theme"),
  endingTransformation: text("ending_transformation"),
  symbolicObject: text("symbolic_object"),
  parentResonanceNote: text("parent_resonance_note"),
  coachResonanceNote: text("coach_resonance_note"),
  blueprintApproved: boolean("blueprint_approved").notNull().default(false),
  blueprintApprovedBy: varchar("blueprint_approved_by", { length: 200 }),
  blueprintApprovedAt: timestamp("blueprint_approved_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStoryBlueprintSchema = createInsertSchema(storyBlueprintsTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertStoryBlueprint = z.infer<typeof insertStoryBlueprintSchema>;
export type StoryBlueprint = typeof storyBlueprintsTable.$inferSelect;
