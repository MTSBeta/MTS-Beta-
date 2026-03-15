import { pgTable, serial, text, integer, varchar, jsonb, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const stakeholderResponsesTable = pgTable("stakeholder_responses", {
  id: serial("id").primaryKey(),
  stakeholderLinkId: integer("stakeholder_link_id").notNull(),
  playerId: uuid("player_id").notNull(),
  questionNumber: integer("question_number").notNull(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text").notNull().default(""),
  audioUrl: text("audio_url"), // voice note object path
  mediaUrls: jsonb("media_urls").$type<string[]>().default([]), // image/video receipts
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertStakeholderResponseSchema = createInsertSchema(stakeholderResponsesTable).omit({
  id: true,
  submittedAt: true,
});
export type InsertStakeholderResponse = z.infer<typeof insertStakeholderResponseSchema>;
export type StakeholderResponse = typeof stakeholderResponsesTable.$inferSelect;
