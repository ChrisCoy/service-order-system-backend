import mongoose from "mongoose";
import { Schema } from "mongoose";
import type { Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Types.ObjectId;
  isAdmin?: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: "roles", required: false },
  isAdmin: { type: Boolean, required: false, default: false },
});

export const User = mongoose.model("users", userSchema);
