import type { Request, Response } from "express";

export function triggerIngestion(_req: Request, res: Response) {
  res.status(202).json({
    success: true,
    data: { status: "queued", stream: "ingestion:queue" }
  });
}

export function getIngestionStatus(req: Request, res: Response) {
  res.json({
    success: true,
    data: { userId: req.params.userId, status: "pending" }
  });
}
