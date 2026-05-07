import { Router } from "express";
import { getCurrentUser, githubCallback, redirectToGithub } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.get("/github", redirectToGithub);
authRouter.get("/github/callback", githubCallback);
authRouter.get("/me", requireAuth, getCurrentUser);
authRouter.post("/refresh", requireAuth, (_req, res) => res.json({ success: true, data: null }));
authRouter.post("/logout", requireAuth, (_req, res) => res.json({ success: true, data: null }));
