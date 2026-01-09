import type { Request, Response, NextFunction } from "express";
import { verifyToken, type AccessTokenPayload } from "./jwt.js";

declare global {
  namespace Express {
    interface Request {
      auth?: AccessTokenPayload;
    }
  }
}

export function requireAuth(accessSecret: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
    if (!token) return res.status(401).json({ message: "Missing access token" });

    try {
      const payload = verifyToken<AccessTokenPayload>(token, accessSecret);
      req.auth = payload;
      return next();
    } catch {
      return res.status(401).json({ message: "Invalid/expired access token" });
    }
  };
}
