import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { ingestionRouter } from "./ingestion.routes.js";
import { proxyRouter } from "./proxy.routes.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/ingestion", ingestionRouter);
router.use("/", proxyRouter);
