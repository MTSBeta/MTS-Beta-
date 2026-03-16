import { pgTable, serial, integer, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const academiesTable = pgTable("academies", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  logoText: varchar("logo_text", { length: 20 }).notNull(),
  primaryColor: varchar("primary_color", { length: 20 }).notNull(),
  secondaryColor: varchar("secondary_color", { length: 20 }).notNull(),
  accentColor: varchar("accent_color", { length: 20 }),
  crestUrl: text("crest_url"),
  welcomeMessage: text("welcome_message").notNull(),
  chantUrl: text("chant_url"),
  maxStaffAccounts: integer("max_staff_accounts").notNull().default(8),
  accessCode: varchar("access_code", { length: 20 }).unique(),
});

export const insertAcademySchema = createInsertSchema(academiesTable).omit({ id: true });
export type InsertAcademy = z.infer<typeof insertAcademySchema>;
export type Academy = typeof academiesTable.$inferSelect;
