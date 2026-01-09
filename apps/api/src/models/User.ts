import mongoose from "mongoose";

export type UserDoc = mongoose.InferSchemaType<typeof UserSchema>;

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    timezone: { type: String, required: true, default: "UTC" }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", UserSchema);
