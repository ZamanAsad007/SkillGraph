import { Router } from "express";
import { getIngestionStatus, triggerIngestion } from "../controllers/ingestion.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const ingestionRouter = Router();

ingestionRouter.post("/trigger", requireAuth, asyncHandler(triggerIngestion));
ingestionRouter.get("/status/:userId", requireAuth, asyncHandler(getIngestionStatus));
