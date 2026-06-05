import { Request, Response } from "express";
import { prisma } from "@skillgraph/database";
import { runRead } from "../neo4j/driver.js";

export async function getSkillHeatmap(req: Request, res: Response) {
  try {
    const universityId = req.query.universityId as string | undefined;
    const studentMatch = universityId
      ? `MATCH (s:Student {universityId: $universityId})`
      : `MATCH (s:Student)`;
    const cypher = `
      ${studentMatch}-[knows:KNOWS]->(sk:Skill)
      WHERE coalesce(knows.confidence, 0) >= 0.5 AND coalesce(knows.dormant, false) = false
      RETURN sk.name AS name, coalesce(sk.category, 'Uncategorized') AS category, toInteger(count(s)) AS count
      ORDER BY count DESC, name ASC
    `;
    const records = await runRead<{ name: string; category: string; count: { low: number; high: number } | number }>(cypher, universityId ? { universityId } : {});

    const data = records.map((r) => ({
      name: r.name,
      category: r.category,
      count: typeof r.count === "object" ? (r.count as { low: number }).low : r.count
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error("[getSkillHeatmap] Error:", error);
    res.status(500).json({ success: false, error: { message: "Internal server error" } });
  }
}

export async function getIndustryGap(req: Request, res: Response) {
  try {
    const universityId = req.query.universityId as string | undefined;
    const studentMatch = universityId
      ? `(s:Student {universityId: $universityId})`
      : `(s:Student)`;
    const cypher = `
      MATCH (r:Role)-[req:REQUIRES]->(sk:Skill)
      OPTIONAL MATCH ${studentMatch}-[knows:KNOWS]->(sk)
      WHERE coalesce(knows.confidence, 0) >= 0.5 AND coalesce(knows.dormant, false) = false
      RETURN r.title AS roleTitle, 
             r.id AS roleId,
             sk.name AS skillName, 
             toFloat(req.criticality) AS industryRequired, 
             toFloat(coalesce(avg(knows.proficiency), 0)) AS studentAverage
      ORDER BY roleTitle ASC, industryRequired DESC
    `;
    const records = await runRead<{
      roleTitle: string;
      roleId: string;
      skillName: string;
      industryRequired: number;
      studentAverage: number;
    }>(cypher, universityId ? { universityId } : {});

    res.json({ success: true, data: records });
  } catch (error) {
    console.error("[getIndustryGap] Error:", error);
    res.status(500).json({ success: false, error: { message: "Internal server error" } });
  }
}

export async function getMissingSkills(req: Request, res: Response) {
  try {
    const universityId = req.query.universityId as string | undefined;
    const where: any = { isActive: true };
    if (universityId) {
      where.student = { user: { universityId } };
    }
    const paths = await prisma.studentLearningPath.findMany({
      where,
      select: { missingSkillsJson: true }
    });

    const counts: Record<string, number> = {};
    for (const path of paths) {
      if (path.missingSkillsJson && Array.isArray(path.missingSkillsJson)) {
        const missing = path.missingSkillsJson as Array<{ name: string }>;
        for (const skill of missing) {
          counts[skill.name] = (counts[skill.name] || 0) + 1;
        }
      }
    }

    const data = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({ success: true, data });
  } catch (error) {
    console.error("[getMissingSkills] Error:", error);
    res.status(500).json({ success: false, error: { message: "Internal server error" } });
  }
}

export async function getSkillTrends(req: Request, res: Response) {
  try {
    const universityId = req.query.universityId as string | undefined;
    const studentMatch = universityId
      ? `MATCH (s:Student {universityId: $universityId})`
      : `MATCH (s:Student)`;
    const cypher = `
      ${studentMatch}-[knows:KNOWS]->(sk:Skill)
      WHERE coalesce(knows.confidence, 0) >= 0.5
      RETURN sk.name AS name,
             coalesce(sk.category, 'Uncategorized') AS category,
             toString(knows.updatedAt.year) + "-" + substring("0" + toString(knows.updatedAt.month), size("0" + toString(knows.updatedAt.month)) - 2) AS date,
             toInteger(count(s)) AS count
      ORDER BY date ASC, count DESC
    `;
    const records = await runRead<{
      name: string;
      category: string;
      date: string;
      count: { low: number; high: number } | number;
    }>(cypher, universityId ? { universityId } : {});

    const data = records.map((r) => ({
      name: r.name,
      category: r.category,
      date: r.date,
      count: typeof r.count === "object" ? (r.count as { low: number }).low : r.count
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error("[getSkillTrends] Error:", error);
    res.status(500).json({ success: false, error: { message: "Internal server error" } });
  }
}