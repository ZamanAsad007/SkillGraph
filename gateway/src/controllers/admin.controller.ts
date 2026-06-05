import type { Request, Response } from "express";
import { prisma } from "@skillgraph/database";
import { ok, fail } from "../utils/apiResponse.js";
import { getRedis } from "../utils/redis.js";

// In-memory global configuration settings for demo purposes
export let globalConfig = {
  skillDecayRate: 0.15,
  scanCooldownHours: 1,
  sessionDurationSeconds: 900,
  isMaintenanceMode: false,
  isIngestionDisabled: false,
  isNlpThrottled: false
};

// 1. User Directory & Moderation (Admin only)
export async function listUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      include: {
        studentProfile: {
          include: {
            university: true,
            department: true
          }
        },
        alumniProfile: true
      },
      orderBy: { createdAt: "desc" }
    });
    ok(res, users);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const { role, isActive } = req.body as { role?: string; isActive?: boolean };

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      fail(res, "USER_NOT_FOUND", "User not found", 404);
      return;
    }

    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    // Automatically manage profiles if the role changes
    if (role !== undefined && role !== user.role) {
      if (role === "student") {
        const existing = await prisma.studentProfile.findUnique({ where: { userId: id } });
        if (!existing) {
          await prisma.studentProfile.create({
            data: {
              userId: id,
              publicHandle: `${user.email?.split("@")[0] || "student"}-${Date.now().toString(36)}`
            }
          });
        }
      } else if (role === "alumni") {
        const existing = await prisma.alumniProfile.findUnique({ where: { userId: id } });
        if (!existing) {
          await prisma.alumniProfile.create({
            data: {
              userId: id,
              willingToMentor: true,
              verified: true
            }
          });
        }
      }
    }

    ok(res, updatedUser);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

// 2. Audit Log Explorer (Admin only)
export async function listAuditLogs(req: Request, res: Response) {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: true
      },
      orderBy: { createdAt: "desc" },
      take: 100
    });
    ok(res, logs);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

// 3. System Configuration (Admin only)
export async function getConfig(req: Request, res: Response) {
  ok(res, globalConfig);
}

export async function updateConfig(req: Request, res: Response) {
  const {
    skillDecayRate,
    scanCooldownHours,
    sessionDurationSeconds,
    isMaintenanceMode,
    isIngestionDisabled,
    isNlpThrottled
  } = req.body as {
    skillDecayRate?: number;
    scanCooldownHours?: number;
    sessionDurationSeconds?: number;
    isMaintenanceMode?: boolean;
    isIngestionDisabled?: boolean;
    isNlpThrottled?: boolean;
  };

  if (skillDecayRate !== undefined) globalConfig.skillDecayRate = skillDecayRate;
  if (scanCooldownHours !== undefined) globalConfig.scanCooldownHours = scanCooldownHours;
  if (sessionDurationSeconds !== undefined) globalConfig.sessionDurationSeconds = sessionDurationSeconds;
  if (isMaintenanceMode !== undefined) globalConfig.isMaintenanceMode = isMaintenanceMode;
  if (isIngestionDisabled !== undefined) globalConfig.isIngestionDisabled = isIngestionDisabled;
  if (isNlpThrottled !== undefined) globalConfig.isNlpThrottled = isNlpThrottled;

  ok(res, globalConfig);
}

// 4. Department Student Directory (Professor/Admin)
export async function listStudents(req: Request, res: Response) {
  try {
    const students = await prisma.user.findMany({
      where: { role: "student" },
      include: {
        studentProfile: {
          include: {
            department: true,
            university: true,
            learningPaths: {
              include: {
                role: true
              }
            }
          }
        }
      },
      orderBy: { fullName: "asc" }
    });
    ok(res, students);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

// 5. Course Mapping Editor (Professor/Admin)
export async function listCourses(req: Request, res: Response) {
  try {
    const courses = await prisma.learningResource.findMany({
      where: { isUniversityApproved: true },
      include: {
        skills: {
          include: {
            skill: true
          }
        }
      },
      orderBy: { courseCode: "asc" }
    });
    ok(res, courses);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function mapCourse(req: Request, res: Response) {
  const { title, url, courseCode, skills } = req.body as {
    title: string;
    url: string;
    courseCode: string;
    skills: string[]; // skill IDs
  };

  if (!title || !url || !courseCode) {
    fail(res, "MISSING_FIELDS", "Title, url, and courseCode are required", 400);
    return;
  }

  try {
    const course = await prisma.learningResource.upsert({
      where: { url },
      update: {
        title,
        courseCode,
        isUniversityApproved: true,
        type: "UNIVERSITY_COURSE"
      },
      create: {
        title,
        url,
        courseCode,
        isUniversityApproved: true,
        type: "UNIVERSITY_COURSE"
      }
    });

    // Clean old resource skill links
    await prisma.resourceSkill.deleteMany({
      where: { resourceId: course.id }
    });

    // Add new skill links
    if (skills && skills.length > 0) {
      for (const skillId of skills) {
        await prisma.resourceSkill.create({
          data: {
            resourceId: course.id,
            skillId
          }
        });
      }
    }

    const fullCourse = await prisma.learningResource.findUnique({
      where: { id: course.id },
      include: {
        skills: {
          include: {
            skill: true
          }
        }
      }
    });

    ok(res, fullCourse);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

// 6. Capstone Advising Explorer (Professor/Admin)
export async function listCapstoneMatches(req: Request, res: Response) {
  try {
    const matches = await prisma.teamRequest.findMany({
      include: {
        project: {
          include: {
            owner: true
          }
        },
        requester: true,
        matches: {
          include: {
            user: {
              include: {
                studentProfile: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    ok(res, matches);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function listAllSkills(req: Request, res: Response) {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        category: true
      },
      orderBy: { name: "asc" }
    });

    const data = skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      category: skill.category?.name ?? "Uncategorized"
    }));

    ok(res, data);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function getKpiStats(req: Request, res: Response) {
  try {
    const [totalUsers, githubConnections, totalRoles, pendingAlumni] = await Promise.all([
      prisma.user.count(),
      prisma.oauthConnection.count({ where: { provider: "github" } }),
      prisma.industryRole.count(),
      prisma.alumniProfile.count({ where: { verified: false } })
    ]);

    const connectionRate = totalUsers > 0 ? Math.round((githubConnections / totalUsers) * 100) : 0;

    ok(res, {
      totalUsers,
      githubConnections,
      connectionRate,
      totalRoles,
      pendingAlumni
    });
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function listAllJobs(req: Request, res: Response) {
  try {
    const redis = await getRedis();
    const keys = await redis.keys("ingestion:status:*");
    const jobs: any[] = [];

    for (const key of keys) {
      const statusData = await redis.hGetAll(key);
      if (statusData && Object.keys(statusData).length > 0) {
        const userId = key.split(":").pop();
        jobs.push({
          userId,
          status: statusData.status,
          jobId: statusData.jobId,
          queuedAt: statusData.queuedAt,
          startedAt: statusData.startedAt,
          completedAt: statusData.completedAt,
          repositoryCount: statusData.repositoryCount ? parseInt(statusData.repositoryCount, 10) : undefined,
          skillsFound: statusData.skillsFound ? parseInt(statusData.skillsFound, 10) : undefined,
          error: statusData.error
        });
      }
    }

    ok(res, jobs);
  } catch (error: any) {
    fail(res, "REDIS_ERROR", error.message, 500);
  }
}

export async function listGithubConnections(req: Request, res: Response) {
  try {
    const connections = await prisma.oauthConnection.findMany({
      where: { provider: "github" },
      include: {
        user: true
      },
      orderBy: { createdAt: "desc" }
    });

    const data = connections.map((conn) => ({
      id: conn.id,
      userId: conn.userId,
      fullName: conn.user.fullName,
      email: conn.user.email,
      provider: conn.provider,
      createdAt: conn.createdAt,
      lastUsedAt: conn.lastUsedAt
    }));

    ok(res, data);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function listCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.skillCategory.findMany({
      orderBy: { name: "asc" }
    });
    ok(res, categories);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function createCategory(req: Request, res: Response) {
  const { name } = req.body as { name?: string };
  if (!name) {
    fail(res, "INVALID_BODY", "Category name is required", 400);
    return;
  }
  try {
    const category = await prisma.skillCategory.create({
      data: { name }
    });
    ok(res, category, 201);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function createSkill(req: Request, res: Response) {
  const { name, categoryId, aliases } = req.body as { name?: string; categoryId?: string; aliases?: string[] };
  if (!name) {
    fail(res, "INVALID_BODY", "Skill name is required", 400);
    return;
  }
  try {
    const skill = await prisma.skill.create({
      data: {
        name,
        categoryId: categoryId || null,
        aliases: aliases || []
      },
      include: { category: true }
    });
    ok(res, skill, 201);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function updateSkill(req: Request, res: Response) {
  const { id } = req.params;
  const { name, categoryId, aliases } = req.body as { name?: string; categoryId?: string; aliases?: string[] };
  try {
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        categoryId: categoryId || null,
        aliases: aliases || []
      },
      include: { category: true }
    });
    ok(res, skill);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function deleteSkill(req: Request, res: Response) {
  const { id } = req.params;
  try {
    await prisma.skill.delete({ where: { id } });
    ok(res, { deleted: true });
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}

export async function exportAuditLogsCsv(req: Request, res: Response) {
  try {
    const { action, entity, search } = req.query as { action?: string; entity?: string; search?: string };
    
    const where: any = {};
    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (search) {
      where.OR = [
        { action: { contains: search, mode: "insensitive" } },
        { entity: { contains: search, mode: "insensitive" } },
        { user: { fullName: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } }
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: "desc" }
    });

    let csv = "ID,User Name,User Email,Action,Entity,IP Address,Created At\n";
    for (const log of logs) {
      const id = log.id;
      const name = log.user?.fullName ? `"${log.user.fullName.replace(/"/g, '""')}"` : "System";
      const email = log.user?.email || "N/A";
      const actionStr = `"${log.action.replace(/"/g, '""')}"`;
      const entityStr = log.entity ? `"${log.entity.replace(/"/g, '""')}"` : "N/A";
      const ip = log.ipAddress || "N/A";
      const date = log.createdAt.toISOString();
      csv += `${id},${name},${email},${actionStr},${entityStr},${ip},${date}\n`;
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=audit_logs.csv");
    res.status(200).send(csv);
  } catch (error: any) {
    fail(res, "DB_ERROR", error.message, 500);
  }
}