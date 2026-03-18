import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const meTimeStaffTable = pgTable("metime_staff", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  role: varchar("role", { length: 30 }).notNull().default("author"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMeTimeStaffSchema = createInsertSchema(meTimeStaffTable).omit({
  id: true,
  createdAt: true,
});
export type InsertMeTimeStaff = z.infer<typeof insertMeTimeStaffSchema>;
export type MeTimeStaff = typeof meTimeStaffTable.$inferSelect;
