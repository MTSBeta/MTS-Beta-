import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { academiesTable } from "@workspace/db/schema";
import { ListAcademiesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/academies", async (_req, res) => {
  const rows = await db.select().from(academiesTable).orderBy(academiesTable.name);
  const data = ListAcademiesResponse.parse(
    rows.map((r) => ({
      id: r.id,
      key: r.key,
      name: r.name,
      logoText: r.logoText,
      primaryColor: r.primaryColor,
      secondaryColor: r.secondaryColor,
      welcomeMessage: r.welcomeMessage,
    }))
  );
  res.json(data);
});

export default router;
