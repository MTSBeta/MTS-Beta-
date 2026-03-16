import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/academies", async (_req, res) => {
  const result = await db.execute(
    sql`SELECT id, key, name, logo_text, primary_color, secondary_color, welcome_message
        FROM academies ORDER BY name`
  );

  const data = (result.rows ?? []).map((r: any) => ({
    id: r.id,
    key: r.key,
    name: r.name,
    logoText: r.logo_text,
    primaryColor: r.primary_color,
    secondaryColor: r.secondary_color,
    welcomeMessage: r.welcome_message,
  }));

  res.json(data);
});

export default router;
