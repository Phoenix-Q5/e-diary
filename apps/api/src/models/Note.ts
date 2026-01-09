import mongoose from "mongoose";

export type NoteDoc = mongoose.InferSchemaType<typeof NoteSchema>;

const NoteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: "User" },
    dateKey: { type: String, required: true },
    content: { type: String, default: "" },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

NoteSchema.index({ userId: 1, dateKey: 1 }, { unique: true });
NoteSchema.index({ userId: 1, updatedAt: -1 });

export const NoteModel = mongoose.model("Note", NoteSchema);
