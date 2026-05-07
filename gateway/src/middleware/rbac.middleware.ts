import type { NextFunction, Request, Response } from "express";

export function requireRole(roles: string[]) {
  return (_req: Request, res: Response, next: NextFunction) => {
    const role = "student";
    if (!roles.includes(role)) {
      res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Insufficient role", statusCode: 403 } });
      return;
    }
    next();
  };
}
