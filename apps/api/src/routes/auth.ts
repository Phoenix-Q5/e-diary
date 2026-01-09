import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User.js";
import { signAccessToken, signRefreshToken, verifyToken, type AccessTokenPayload } from "../security/jwt.js";

export function authRouter(opts: {
  accessSecret: string;
  refreshSecret: string;
  accessTtlMinutes: number;
  refreshTtlDays: number;
  isProd: boolean;
}) {
  const r = Router();

  const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    timezone: z.string().min(1).max(100).default("UTC")
  });

  const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
  });

  function setRefreshCookie(res: any, token: string) {
    res.cookie("refresh_token", token, {
      httpOnly: true,
      secure: opts.isProd,
      sameSite: opts.isProd ? "none" : "lax",
      path: "/auth/refresh"
    });
  }

  r.post("/register", async (req, res) => {
    const body = RegisterSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ message: "Invalid payload", issues: body.error.issues });

    const exists = await UserModel.findOne({ email: body.data.email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(body.data.password, 12);
    const user = await UserModel.create({
      email: body.data.email.toLowerCase(),
      passwordHash,
      firstName: body.data.firstName,
      lastName: body.data.lastName,
      timezone: body.data.timezone
    });

    const payload: AccessTokenPayload = { sub: String(user._id), email: user.email };
    const access = signAccessToken(payload, opts.accessSecret, opts.accessTtlMinutes);
    const refresh = signRefreshToken(payload, opts.refreshSecret, opts.refreshTtlDays);
    setRefreshCookie(res, refresh);

    return res.json({
      accessToken: access,
      user: { id: String(user._id), email: user.email, firstName: user.firstName, lastName: user.lastName, timezone: user.timezone }
    });
  });

  r.post("/login", async (req, res) => {
    const body = LoginSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ message: "Invalid payload", issues: body.error.issues });

    const user = await UserModel.findOne({ email: body.data.email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(body.data.password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const payload: AccessTokenPayload = { sub: String(user._id), email: user.email };
    const access = signAccessToken(payload, opts.accessSecret, opts.accessTtlMinutes);
    const refresh = signRefreshToken(payload, opts.refreshSecret, opts.refreshTtlDays);
    setRefreshCookie(res, refresh);

    return res.json({
      accessToken: access,
      user: { id: String(user._id), email: user.email, firstName: user.firstName, lastName: user.lastName, timezone: user.timezone }
    });
  });

  r.post("/refresh", async (req, res) => {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ message: "Missing refresh token" });

    try {
      const payload = verifyToken<AccessTokenPayload>(token, opts.refreshSecret);
      const user = await UserModel.findById(payload.sub);
      if (!user) return res.status(401).json({ message: "Unknown user" });

      const newPayload: AccessTokenPayload = { sub: String(user._id), email: user.email };
      const access = signAccessToken(newPayload, opts.accessSecret, opts.accessTtlMinutes);

      return res.json({
        accessToken: access,
        user: { id: String(user._id), email: user.email, firstName: user.firstName, lastName: user.lastName, timezone: user.timezone }
      });
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  });

  r.post("/logout", async (_req, res) => {
    res.clearCookie("refresh_token", { path: "/auth/refresh" });
    return res.json({ ok: true });
  });

  return r;
}
