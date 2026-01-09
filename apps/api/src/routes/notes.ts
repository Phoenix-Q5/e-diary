import { Router } from "express";
import { z } from "zod";
import { NoteModel } from "../models/Note.js";
import { UserModel } from "../models/User.js";

const DateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export function notesRouter() {
  const r = Router();

  r.get("/today", async (req, res) => {
    const userId = req.auth!.sub;
    const timezone = (await UserModel.findById(userId).select("timezone"))?.timezone ?? "UTC";

    const dateKey = DateKey.safeParse(req.query.dateKey ?? "");
    if (!dateKey.success) return res.status(400).json({ message: "Provide ?dateKey=YYYY-MM-DD" });

    const note = await NoteModel.findOne({ userId, dateKey: dateKey.data }).lean();
    return res.json({ note: note ?? null, timezone });
  });

  r.get("/", async (req, res) => {
    const userId = req.auth!.sub;
    const q = z
      .object({
        from: DateKey,
        to: DateKey
      })
      .safeParse(req.query);

    if (!q.success) return res.status(400).json({ message: "Provide from/to as YYYY-MM-DD", issues: q.error.issues });

    const notes = await NoteModel.find({
      userId,
      dateKey: { $gte: q.data.from, $lte: q.data.to }
    })
      .sort({ dateKey: 1 })
      .lean();

    return res.json({ notes });
  });

  r.get("/:dateKey", async (req, res) => {
    const userId = req.auth!.sub;
    const p = DateKey.safeParse(req.params.dateKey);
    if (!p.success) return res.status(400).json({ message: "Invalid dateKey" });

    const note = await NoteModel.findOne({ userId, dateKey: p.data }).lean();
    return res.json({ note: note ?? null });
  });

  r.put("/:dateKey", async (req, res) => {
    const userId = req.auth!.sub;
    const p = DateKey.safeParse(req.params.dateKey);
    if (!p.success) return res.status(400).json({ message: "Invalid dateKey" });

    const Body = z.object({
      content: z.string().max(20000),
      tags: z.array(z.string().min(1).max(30)).optional().default([])
    });
    const body = Body.safeParse(req.body);
    if (!body.success) return res.status(400).json({ message: "Invalid payload", issues: body.error.issues });

    const note = await NoteModel.findOneAndUpdate(
      { userId, dateKey: p.data },
      { $set: { content: body.data.content, tags: body.data.tags } },
      { upsert: true, new: true }
    ).lean();

    return res.json({ note });
  });

  r.get("/calendar/:month", async (req, res) => {
    const userId = req.auth!.sub;
    const month = z.string().regex(/^\d{4}-\d{2}$/).safeParse(req.params.month);
    if (!month.success) return res.status(400).json({ message: "Invalid month format YYYY-MM" });

    const from = `${month.data}-01`;
    const to = `${month.data}-31`;

    const notes = await NoteModel.find(
      { userId, dateKey: { $gte: from, $lte: to }, content: { $ne: "" } },
      { dateKey: 1, _id: 0 }
    ).lean();

    return res.json({ dateKeys: notes.map((n) => n.dateKey) });
  });

  return r;
}
