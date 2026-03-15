import { pgTable, serial, text, integer, varchar, jsonb, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const playerJourneyResponsesTable = pgTable("player_journey_responses", {
  id: serial("id").primaryKey(),
  playerId: uuid("player_id").notNull(),
  stage: varchar("stage", { length: 50 }).notNull(),
  questionNumber: integer("question_number").notNull(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text").notNull().default(""),
  audioUrl: text("audio_url"), // voice note
  mediaUrls: jsonb("media_urls").$type<string[]>().default([]), // photo/video receipts
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertJourneyResponseSchema = createInsertSchema(playerJourneyResponsesTable).omit({
  id: true,
  createdAt: true,
});
export type InsertJourneyResponse = z.infer<typeof insertJourneyResponseSchema>;
export type JourneyResponse = typeof playerJourneyResponsesTable.$inferSelect;
