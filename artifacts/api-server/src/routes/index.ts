import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import academiesRouter from "./academies.js";
import playersRouter from "./players.js";
import journeyRouter from "./journey.js";
import stakeholdersRouter from "./stakeholders.js";
import adminRouter from "./admin.js";
import storageRouter from "./storage.js";
import parentRouter from "./parent.js";
import staffAuthRouter from "./staffAuth.js";
import staffPlayersRouter from "./staffPlayers.js";
import staffSubmissionsRouter from "./staffSubmissions.js";
import staffTeamRouter from "./staffTeam.js";
import staffAcademyRouter from "./staffAcademy.js";
import ttsRouter from "./tts.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(academiesRouter);
router.use(playersRouter);
router.use(journeyRouter);
router.use(stakeholdersRouter);
router.use(adminRouter);
router.use(storageRouter);
router.use(parentRouter);
router.use(staffAuthRouter);
router.use(staffPlayersRouter);
router.use(staffSubmissionsRouter);
router.use(staffTeamRouter);
router.use(staffAcademyRouter);
router.use(ttsRouter);

export default router;
