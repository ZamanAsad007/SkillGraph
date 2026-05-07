import type { Request, Response } from "express";
import { env } from "../config/env.js";

export function redirectToGithub(_req: Request, res: Response) {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID ?? "",
    redirect_uri: env.GITHUB_CALLBACK_URL ?? "",
    scope: "read:user public_repo"
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}

export function githubCallback(_req: Request, res: Response) {
  res.json({
    success: true,
    data: {
      message: "GitHub OAuth callback scaffolded. Exchange code and issue JWT here."
    }
  });
}

export function getCurrentUser(_req: Request, res: Response) {
  res.json({ success: true, data: { id: "current-user", role: "student" } });
}
