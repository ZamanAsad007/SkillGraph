import cors from "cors";
import express from "express";
import helmet from "helmet";
import { publicLimiter } from "./middleware/rateLimit.middleware.js";
import { router } from "./routes/index.js";
import { errorHandler } from "./utils/errorHandler.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(publicLimiter);

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { service: "gateway", status: "ok" } });
});

app.use("/api/v1", router);
app.use(errorHandler);
