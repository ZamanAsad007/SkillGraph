import { Router } from "express";
import { getCareerGapQuery } from "../neo4j/queries/gps.queries.js";
import { findCandidatesQuery } from "../neo4j/queries/matchmaker.queries.js";

export const graphRouter = Router();

graphRouter.get("/student/:id/skills", (req, res) => {
  res.json({ success: true, data: { studentId: req.params.id, skills: [] } });
});

graphRouter.get("/career-gps", (req, res) => {
  res.json({ success: true, data: { query: getCareerGapQuery, roadmap: [] } });
});

graphRouter.post("/matchmaker/find", (req, res) => {
  res.json({ success: true, data: { query: findCandidatesQuery, candidates: [] } });
});
