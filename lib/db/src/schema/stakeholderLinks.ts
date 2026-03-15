import { pgTable, serial, text, varchar, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const stakeholderLinksTable = pgTable("stakeholder_links", {
  id: serial("id").primaryKey(),
  playerId: uuid("player_id").notNull(),
  type: varchar("type", { length: 30 }).notNull(), // parent | friend | football_coach | education | psychology | player_care
  label: varchar("label", { length: 100 }).notNull(), // e.g. "Parent 1", "Best Friend", "Head Coach"
  code: varchar("code", { length: 30 }).notNull().unique(),
  submitted: boolean("submitted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertStakeholderLinkSchema = createInsertSchema(stakeholderLinksTable).omit({
  id: true,
  createdAt: true,
});
export type InsertStakeholderLink = z.infer<typeof insertStakeholderLinkSchema>;
export type StakeholderLink = typeof stakeholderLinksTable.$inferSelect;
