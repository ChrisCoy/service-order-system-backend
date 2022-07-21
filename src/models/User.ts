import mongoose from "mongoose";
import { Types, Schema } from "mongoose";

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
  role: { type: Schema.Types.ObjectId, required: false },
  isAdmin: { type: Boolean, required: false, default: false },
});

export const User = mongoose.model("users", userSchema);
