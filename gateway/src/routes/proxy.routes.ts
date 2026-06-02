import { Router } from "express";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const proxyRouter = Router();

proxyRouter.get("/graph/roles", requireAuth, asyncHandler(async (_req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/roles`);
  res.status(response.status).json(await response.json());
}));
proxyRouter.get("/graph/student/:id/skills", requireAuth, asyncHandler(async (req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/student/${req.params.id}/skills`);
  res.status(response.status).json(await response.json());
}));
proxyRouter.get("/graph/galaxy/:studentId", requireAuth, asyncHandler(async (req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/galaxy/${req.params.studentId}`);
  res.status(response.status).json(await response.json());
}));
proxyRouter.get("/graph/skills/all", requireAuth, asyncHandler(async (_req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/skills/all`);
  res.status(response.status).json(await response.json());
}));
proxyRouter.get("/public/galaxy/:handle", asyncHandler(async (req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/public/galaxy/${req.params.handle}`);
  res.status(response.status).json(await response.json());
}));

proxyRouter.post("/matchmaker/candidates", requireAuth, asyncHandler(async (req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/matchmaker/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...req.body,
      requesterId: req.user!.id
    })
  });
  res.status(response.status).json(await response.json());
}));

// Career GPS routes
proxyRouter.get("/career-gps", requireAuth, asyncHandler(async (req, res) => {
  const { studentId, targetRoleId } = req.query;
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/career-gps?studentId=${studentId}&targetRoleId=${targetRoleId}`);
  res.status(response.status).json(await response.json());
}));
proxyRouter.post("/career-gps/save", requireAuth, asyncHandler(async (req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/career-gps/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  });
  res.status(response.status).json(await response.json());
}));
proxyRouter.get("/career-gps/history/:studentId", requireAuth, asyncHandler(async (req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/career-gps/history/${req.params.studentId}`);
  res.status(response.status).json(await response.json());
}));

proxyRouter.get("/admin/analytics/skill-heatmap", requireAuth, requireRole(["admin", "professor"]), (_req, res) => res.json({ success: true, data: [] }));

proxyRouter.get("/admin/analytics/industry-gap", requireAuth, requireRole(["admin", "professor"]), asyncHandler(async (_req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/analytics/industry-gap`);
  res.status(response.status).json(await response.json());
}));

proxyRouter.get("/admin/analytics/missing-skills", requireAuth, requireRole(["admin", "professor"]), asyncHandler(async (_req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/analytics/missing-skills`);
  res.status(response.status).json(await response.json());
}));

proxyRouter.get("/admin/analytics/trend", requireAuth, requireRole(["admin", "professor"]), asyncHandler(async (_req, res) => {
  const response = await fetch(`${env.GRAPH_SERVICE_URL}/graph/analytics/trend`);
  res.status(response.status).json(await response.json());
}));