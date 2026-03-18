import { pgTable, serial, integer, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const storyScenesTable = pgTable("story_scenes", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  sceneNumber: integer("scene_number").notNull(),
  title: varchar("title", { length: 100 }),
  manuscript: text("manuscript"),
  sceneNotes: text("scene_notes"),
  emotionalBeat: text("emotional_beat"),
  pageLayout: varchar("page_layout", { length: 50 }),
  imageUrl: text("image_url"),
  pageType: varchar("page_type", { length: 50 }),
  pagesData: jsonb("pages_data"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStorySceneSchema = createInsertSchema(storyScenesTable).omit({
  id: true,
  updatedAt: true,
});
export type InsertStoryScene = z.infer<typeof insertStorySceneSchema>;
export type StoryScene = typeof storyScenesTable.$inferSelect;

export const SCENE_DEFINITIONS = [
  {
    number: 1,
    title: "The Vision",
    purpose: "Introduce the player's dream, identity, world, and what they want",
    emotionalBeat: "Hope, ambition, belonging",
    footballPrompts: [
      "What position do they play and why does it suit them?",
      "What does their best game feel like?",
      "What do they picture when they close their eyes and dream?",
    ],
    avoidList: ["Generic football clichés", "Starting with a match description"],
  },
  {
    number: 2,
    title: "The Storm",
    purpose: "Introduce challenge, pressure, disappointment, or conflict",
    emotionalBeat: "Tension, doubt, frustration",
    footballPrompts: [
      "What is their recurring pressure point?",
      "What has gone wrong this season?",
      "Who or what feels like an obstacle?",
    ],
    avoidList: ["Making the challenge too dramatic or physical", "Simplifying the emotion"],
  },
  {
    number: 3,
    title: "Rock Bottom",
    purpose: "Show the lowest point, fracture, doubt, or hardest test",
    emotionalBeat: "Vulnerability, isolation, inner conflict",
    footballPrompts: [
      "What is the moment of hardest self-doubt?",
      "What did they nearly give up?",
      "What feels most unfair or invisible about their situation?",
    ],
    avoidList: ["Physical injury as the main crisis if avoidable", "Over-dramatising"],
  },
  {
    number: 4,
    title: "The Rise",
    purpose: "Show support, change, action, or new belief beginning to form",
    emotionalBeat: "Connection, shift, quiet momentum",
    footballPrompts: [
      "Who helped them or believed in them?",
      "What small moment changed something?",
      "What did they decide to do differently?",
    ],
    avoidList: ["Sudden miracle moments", "Preachy lessons"],
  },
  {
    number: 5,
    title: "Elite Wisdom",
    purpose: "Show the deeper lesson, truth, or wisdom gained through the journey",
    emotionalBeat: "Clarity, self-knowledge, quiet confidence",
    footballPrompts: [
      "What do they understand about themselves now?",
      "What would they tell a younger version of themselves?",
      "What is their new football truth?",
    ],
    avoidList: ["Sounding like a self-help book", "Motivational poster clichés"],
  },
  {
    number: 6,
    title: "Next Level",
    purpose: "End with transformation, momentum, and future promise",
    emotionalBeat: "Determination, possibility, earned optimism",
    footballPrompts: [
      "What are they moving toward?",
      "What is their next challenge or goal?",
      "How have they changed?",
    ],
    avoidList: ["Unrealistic promises", "Tying everything up too neatly"],
  },
] as const;
