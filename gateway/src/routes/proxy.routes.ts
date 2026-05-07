import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";

export const proxyRouter = Router();

proxyRouter.get("/graph/roles", requireAuth, (_req, res) => res.json({ success: true, data: [] }));
proxyRouter.get("/graph/student/:id/skills", requireAuth, (_req, res) => res.json({ success: true, data: [] }));
proxyRouter.get("/public/galaxy/:handle", (_req, res) => res.json({ success: true, data: { nodes: [], links: [] } }));
proxyRouter.get("/admin/analytics/skill-heatmap", requireAuth, requireRole(["admin", "professor"]), (_req, res) => res.json({ success: true, data: [] }));
