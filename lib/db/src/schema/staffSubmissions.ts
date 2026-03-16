import { pgTable, serial, integer, text, varchar, jsonb, uuid, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const staffSubmissionsTable = pgTable("staff_submissions", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").notNull(),
  playerId: uuid("player_id").notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStaffSubmissionSchema = createInsertSchema(staffSubmissionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertStaffSubmission = z.infer<typeof insertStaffSubmissionSchema>;
export type StaffSubmission = typeof staffSubmissionsTable.$inferSelect;
