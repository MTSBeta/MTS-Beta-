import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import academiesRouter from "./academies.js";
import playersRouter from "./players.js";
import journeyRouter from "./journey.js";
import parentRouter from "./parent.js";
import coachRouter from "./coach.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(academiesRouter);
router.use(playersRouter);
router.use(journeyRouter);
router.use(parentRouter);
router.use(coachRouter);
router.use(adminRouter);

export default router;
