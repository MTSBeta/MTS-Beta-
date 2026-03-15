import { pgTable, serial, text, integer, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const coachResponsesTable = pgTable("coach_responses", {
  id: serial("id").primaryKey(),
  playerId: uuid("player_id").notNull(),
  coachCode: varchar("coach_code", { length: 20 }).notNull(),
  questionNumber: integer("question_number").notNull(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertCoachResponseSchema = createInsertSchema(coachResponsesTable).omit({
  id: true,
  submittedAt: true,
});
export type InsertCoachResponse = z.infer<typeof insertCoachResponseSchema>;
export type CoachResponse = typeof coachResponsesTable.$inferSelect;
