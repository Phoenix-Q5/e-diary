import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { loadEnv } from "./env.js";
import { buildMongoUri } from "./db.js";
import { connectMongo } from "./db.js";
import { authRouter } from "./routes/auth.js";
import { requireAuth } from "./security/authMiddleware.js";
import { notesRouter } from "./routes/notes.js";

const env = loadEnv(process.env);

const mongoUri = buildMongoUri(env);
await connectMongo(mongoUri);

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(
  "/auth",
  authRouter({
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessTtlMinutes: env.ACCESS_TOKEN_TTL_MINUTES,
    refreshTtlDays: env.REFRESH_TOKEN_TTL_DAYS,
    isProd: env.NODE_ENV === "production"
  })
);

app.use("/notes", requireAuth(env.JWT_ACCESS_SECRET), notesRouter());

app.listen(env.PORT, () => {
  console.log(`API listening on :${env.PORT}`);
});
