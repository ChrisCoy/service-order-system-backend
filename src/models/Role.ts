import mongoose from "mongoose";
import { Schema } from "mongoose";

interface IRole {
  name: string;
}

const roleSchema = new Schema<IRole>({
  name: { type: String, required: true },
});

export const Role = mongoose.model("roles", roleSchema);
