import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  listUsers,
  updateUser,
  listAuditLogs,
  getConfig,
  updateConfig,
  listStudents,
  listCourses,
  mapCourse,
  listCapstoneMatches,
  listAllSkills,
  getKpiStats,
  listAllJobs,
  listGithubConnections,
  listCategories,
  createCategory,
  createSkill,
  updateSkill,
  deleteSkill,
  exportAuditLogsCsv,
  extractSyllabusSkills,
  listAlumni
} from "../controllers/admin.controller.js";

export const adminRouter = Router();

// Admin-only management endpoints
adminRouter.get(
  "/admin/users",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(listUsers)
);

adminRouter.patch(
  "/admin/users/:id",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(updateUser)
);

adminRouter.get(
  "/admin/audit-logs",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(listAuditLogs)
);

adminRouter.get(
  "/admin/config",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(getConfig)
);

adminRouter.post(
  "/admin/config",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(updateConfig)
);

adminRouter.get(
  "/admin/skills",
  requireAuth,
  requireRole(["admin", "professor"]),
  asyncHandler(listAllSkills)
);

adminRouter.get(
  "/admin/kpi-stats",
  requireAuth,
  requireRole(["admin", "professor"]),
  asyncHandler(getKpiStats)
);

// Professor & Admin shared academic advising endpoints
adminRouter.get(
  "/professor/students",
  requireAuth,
  requireRole(["admin", "professor"]),
  asyncHandler(listStudents)
);

adminRouter.get(
  "/professor/courses",
  requireAuth,
  requireRole(["admin", "professor"]),
  asyncHandler(listCourses)
);

adminRouter.post(
  "/professor/courses",
  requireAuth,
  requireRole(["admin", "professor"]),
  asyncHandler(mapCourse)
);

adminRouter.get(
  "/professor/capstone-matches",
  requireAuth,
  requireRole(["admin", "professor"]),
  asyncHandler(listCapstoneMatches)
);

// Advanced Administrator features (Admin only)
adminRouter.get(
  "/admin/jobs",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(listAllJobs)
);

adminRouter.get(
  "/admin/github-connections",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(listGithubConnections)
);

adminRouter.get(
  "/admin/categories",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(listCategories)
);

adminRouter.post(
  "/admin/categories",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(createCategory)
);

adminRouter.post(
  "/admin/skills",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(createSkill)
);

adminRouter.put(
  "/admin/skills/:id",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(updateSkill)
);

adminRouter.delete(
  "/admin/skills/:id",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(deleteSkill)
);

adminRouter.get(
  "/admin/audit-logs/export",
  requireAuth,
  requireRole(["admin"]),
  asyncHandler(exportAuditLogsCsv)
);

adminRouter.post(
  "/professor/courses/extract-skills",
  requireAuth,
  requireRole(["admin", "professor"]),
  asyncHandler(extractSyllabusSkills)
);

adminRouter.get(
  "/professor/alumni",
  requireAuth,
  requireRole(["admin", "professor"]),
  asyncHandler(listAlumni)
);