import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";

export function requireRole(roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Insufficient role", statusCode: 403 } });
      return;
    }
    next();
  };
}
