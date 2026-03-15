import { pgTable, serial, text, integer, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const parentResponsesTable = pgTable("parent_responses", {
  id: serial("id").primaryKey(),
  playerId: uuid("player_id").notNull(),
  parentCode: varchar("parent_code", { length: 20 }).notNull(),
  questionNumber: integer("question_number").notNull(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertParentResponseSchema = createInsertSchema(parentResponsesTable).omit({
  id: true,
  submittedAt: true,
});
export type InsertParentResponse = z.infer<typeof insertParentResponseSchema>;
export type ParentResponse = typeof parentResponsesTable.$inferSelect;
