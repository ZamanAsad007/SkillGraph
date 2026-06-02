import type { Request, Response } from "express";
import { prisma } from "@skillgraph/database";
import { fail, ok } from "../utils/apiResponse.js";

export async function saveSimulation(req: Request, res: Response) {
  if (!req.user) {
    fail(res, "UNAUTHORIZED", "Missing authenticated user", 401);
    return;
  }

  const {
    scenarioName,
    targetRoleId,
    hypotheticalSkills,
    simulatedResult,
    completionDelta,
    weeksSaved
  } = req.body as {
    scenarioName?: string;
    targetRoleId?: string;
    hypotheticalSkills?: string[];
    simulatedResult?: any;
    completionDelta?: number;
    weeksSaved?: number;
  };

  if (!targetRoleId || !hypotheticalSkills || !simulatedResult) {
    fail(res, "INVALID_BODY", "targetRoleId, hypotheticalSkills, and simulatedResult are required", 400);
    return;
  }

  const student = await prisma.studentProfile.findUnique({
    where: { userId: req.user.id }
  });

  if (!student) {
    fail(res, "STUDENT_NOT_FOUND", "Student profile not found", 404);
    return;
  }

  try {
    const saved = await prisma.simulatedPath.create({
      data: {
        studentId: student.id,
        scenarioName: scenarioName || "Simulated Path",
        targetRoleId,
        hypotheticalSkills: hypotheticalSkills as any,
        simulatedResult: simulatedResult as any,
        completionDelta: completionDelta ?? null,
        weeksSaved: weeksSaved ?? null
      }
    });

    ok(res, saved, 201);
  } catch (error) {
    console.error("Save simulation error:", error);
    fail(res, "INTERNAL_ERROR", "Failed to save simulation scenario", 500);
  }
}

export async function getSimulations(req: Request, res: Response) {
  let targetStudentId = req.params.studentId;

  if (targetStudentId === "me") {
    if (!req.user) {
      fail(res, "UNAUTHORIZED", "Missing authenticated user", 401);
      return;
    }
    const student = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });
    if (!student) {
      fail(res, "STUDENT_NOT_FOUND", "Student profile not found", 404);
      return;
    }
    targetStudentId = student.id;
  } else {
    const student = await prisma.studentProfile.findFirst({
      where: { OR: [{ id: targetStudentId }, { userId: targetStudentId }] }
    });
    if (!student) {
      fail(res, "STUDENT_NOT_FOUND", "Student profile not found", 404);
      return;
    }
    targetStudentId = student.id;
  }

  try {
    const paths = await prisma.simulatedPath.findMany({
      where: { studentId: targetStudentId },
      include: { targetRole: true },
      orderBy: { createdAt: "desc" }
    });

    ok(res, paths);
  } catch (error) {
    console.error("Get simulations error:", error);
    fail(res, "INTERNAL_ERROR", "Failed to retrieve simulation scenarios", 500);
  }
}

export async function deleteSimulation(req: Request, res: Response) {
  if (!req.user) {
    fail(res, "UNAUTHORIZED", "Missing authenticated user", 401);
    return;
  }

  const { id } = req.params;

  try {
    const simulation = await prisma.simulatedPath.findUnique({
      where: { id }
    });

    if (!simulation) {
      fail(res, "NOT_FOUND", "Simulation scenario not found", 404);
      return;
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id }
    });

    // Allow deleting if it's the student's own simulation or if the user is admin/professor
    if (req.user.role !== "admin" && req.user.role !== "professor" && (!student || simulation.studentId !== student.id)) {
      fail(res, "FORBIDDEN", "You do not have permission to delete this simulation", 403);
      return;
    }

    await prisma.simulatedPath.delete({
      where: { id }
    });

    ok(res, { success: true });
  } catch (error) {
    console.error("Delete simulation error:", error);
    fail(res, "INTERNAL_ERROR", "Failed to delete simulation scenario", 500);
  }
}