import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import academiesRouter from "./academies.js";
import playersRouter from "./players.js";
import journeyRouter from "./journey.js";
import stakeholdersRouter from "./stakeholders.js";
import adminRouter from "./admin.js";
import storageRouter from "./storage.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(academiesRouter);
router.use(playersRouter);
router.use(journeyRouter);
router.use(stakeholdersRouter);
router.use(adminRouter);
router.use(storageRouter);

export default router;
