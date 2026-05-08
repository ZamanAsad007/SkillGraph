import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { endorsementsRouter } from "./endorsements.routes.js";
import { ingestionRouter } from "./ingestion.routes.js";
import { matchmakerRouter } from "./matchmaker.routes.js";
import notificationsRouter from "./notifications.routes.js";
import { proxyRouter } from "./proxy.routes.js";
import { teamRouter } from "./team.routes.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/ingestion", ingestionRouter);
router.use("/matchmaker", matchmakerRouter);
router.use("/endorsements", endorsementsRouter);
router.use("/notifications", notificationsRouter);
router.use("/team", teamRouter);
router.use("/", proxyRouter);
