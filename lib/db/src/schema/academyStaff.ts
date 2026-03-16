import { pgTable, serial, integer, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const academyStaffTable = pgTable("academy_staff", {
  id: serial("id").primaryKey(),
  academyId: integer("academy_id").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  authUserId: varchar("auth_user_id", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  jobTitle: varchar("job_title", { length: 100 }),
  teamName: varchar("team_name", { length: 100 }),
  ageGroup: varchar("age_group", { length: 50 }),
  systemRole: varchar("system_role", { length: 30 }).notNull().default("staff"),
  questionRole: varchar("question_role", { length: 50 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAcademyStaffSchema = createInsertSchema(academyStaffTable).omit({
  id: true,
  createdAt: true,
});
export type InsertAcademyStaff = z.infer<typeof insertAcademyStaffSchema>;
export type AcademyStaff = typeof academyStaffTable.$inferSelect;
