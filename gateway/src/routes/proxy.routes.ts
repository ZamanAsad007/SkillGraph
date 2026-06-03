import { Router } from "express";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CircuitBreaker } from "../utils/circuitBreaker.js";

export const proxyRouter = Router();

const graphCircuitBreaker = new CircuitBreaker("graph-service", 3, 10000);

async function proxyToGraph(
  url: string,
  options: RequestInit = {}
): Promise<{ status: number; data: any }> {
  const fallback = {
    status: 503,
    data: {
      success: false,
      error: { message: "Internal graph-service is temporarily unavailable (circuit breaker active)" }
    }
  };

  return graphCircuitBreaker.execute(async () => {
    const response = await fetch(url, options);
    if (!response.ok && response.status >= 500) {
      throw new Error(`Downstream server error: ${response.status}`);
    }
    return {
      status: response.status,
      data: await response.json()
    };
  }, fallback);
}

proxyRouter.get("/graph/roles", requireAuth, asyncHandler(async (_req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/roles`);
  res.status(result.status).json(result.data);
}));

proxyRouter.get("/graph/student/:id/skills", requireAuth, asyncHandler(async (req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/student/${req.params.id}/skills`);
  res.status(result.status).json(result.data);
}));

proxyRouter.get("/graph/galaxy/:studentId", requireAuth, asyncHandler(async (req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/galaxy/${req.params.studentId}`);
  res.status(result.status).json(result.data);
}));

proxyRouter.get("/graph/skills/all", requireAuth, asyncHandler(async (_req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/skills/all`);
  res.status(result.status).json(result.data);
}));

proxyRouter.get("/public/galaxy/:handle", asyncHandler(async (req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/public/galaxy/${req.params.handle}`);
  res.status(result.status).json(result.data);
}));

proxyRouter.post("/matchmaker/candidates", requireAuth, asyncHandler(async (req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/matchmaker/candidates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...req.body,
      requesterId: req.user!.id
    })
  });
  res.status(result.status).json(result.data);
}));

// Career GPS routes
proxyRouter.get("/career-gps", requireAuth, asyncHandler(async (req, res) => {
  const { studentId, targetRoleId } = req.query;
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/career-gps?studentId=${studentId}&targetRoleId=${targetRoleId}`);
  res.status(result.status).json(result.data);
}));

proxyRouter.post("/career-gps/save", requireAuth, asyncHandler(async (req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/career-gps/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  });
  res.status(result.status).json(result.data);
}));

proxyRouter.get("/career-gps/history/:studentId", requireAuth, asyncHandler(async (req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/career-gps/history/${req.params.studentId}`);
  res.status(result.status).json(result.data);
}));

proxyRouter.get("/admin/analytics/skill-heatmap", requireAuth, requireRole(["admin", "professor"]), asyncHandler(async (_req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/analytics/skill-heatmap`);
  res.status(result.status).json(result.data);
}));

proxyRouter.get("/admin/analytics/industry-gap", requireAuth, requireRole(["admin", "professor"]), asyncHandler(async (_req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/analytics/industry-gap`);
  res.status(result.status).json(result.data);
}));

proxyRouter.get("/admin/analytics/missing-skills", requireAuth, requireRole(["admin", "professor"]), asyncHandler(async (_req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/analytics/missing-skills`);
  res.status(result.status).json(result.data);
}));

proxyRouter.get("/admin/analytics/trend", requireAuth, requireRole(["admin", "professor"]), asyncHandler(async (_req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/analytics/trend`);
  res.status(result.status).json(result.data);
}));

proxyRouter.post("/simulator/run", requireAuth, asyncHandler(async (req, res) => {
  const result = await proxyToGraph(`${env.GRAPH_SERVICE_URL}/graph/simulator/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body)
  });
  res.status(result.status).json(result.data);
}));