import jwt from "jsonwebtoken";

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

export function signAccessToken(payload: AccessTokenPayload, secret: string, ttlMinutes: number): string {
  return jwt.sign(payload, secret, { expiresIn: `${ttlMinutes}m` });
}

export function signRefreshToken(payload: AccessTokenPayload, secret: string, ttlDays: number): string {
  return jwt.sign(payload, secret, { expiresIn: `${ttlDays}d` });
}

export function verifyToken<T>(token: string, secret: string): T {
  return jwt.verify(token, secret) as T;
}
