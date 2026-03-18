import { pgTable, serial, integer, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const illustrationAssetsTable = pgTable("illustration_assets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  sceneNumber: integer("scene_number"),
  fileName: varchar("file_name", { length: 255 }),
  driveFileId: varchar("drive_file_id", { length: 255 }),
  driveLink: text("drive_link"),
  assetType: varchar("asset_type", { length: 50 }).notNull().default("reference"),
  approved: boolean("approved").notNull().default(false),
  illustratorNotes: text("illustrator_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertIllustrationAssetSchema = createInsertSchema(illustrationAssetsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertIllustrationAsset = z.infer<typeof insertIllustrationAssetSchema>;
export type IllustrationAsset = typeof illustrationAssetsTable.$inferSelect;

export const ASSET_TYPES = [
  "player_portrait",
  "kit_reference",
  "family_home",
  "scene_illustration",
  "reference_image",
  "voice_note",
  "transcript",
] as const;
