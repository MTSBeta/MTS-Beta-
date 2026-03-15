import { pgTable, text, integer, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const playersTable = pgTable("players", {
  id: uuid("id").defaultRandom().primaryKey(),
  playerName: varchar("player_name", { length: 200 }).notNull(),
  age: integer("age").notNull(),
  shirtNumber: integer("shirt_number").notNull(),
  academyKey: varchar("academy_key", { length: 50 }).notNull(),
  academyName: varchar("academy_name", { length: 200 }).notNull(),
  position: varchar("position", { length: 10 }).notNull(),
  accessCode: varchar("access_code", { length: 20 }).notNull().unique(),
  parentCode: varchar("parent_code", { length: 20 }).notNull().unique(),
  coachCode: varchar("coach_code", { length: 20 }).notNull().unique(),
  status: varchar("status", { length: 50 }).notNull().default("registered"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlayerSchema = createInsertSchema(playersTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof playersTable.$inferSelect;
