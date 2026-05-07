import { Router } from "express";
import { getIngestionStatus, triggerIngestion } from "../controllers/ingestion.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const ingestionRouter = Router();

ingestionRouter.post("/trigger", requireAuth, triggerIngestion);
ingestionRouter.get("/status/:userId", requireAuth, getIngestionStatus);
