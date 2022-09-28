import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";
import { IUser } from "./User";

export interface ICallMongo {
  sector: Types.ObjectId;
  author: Types.ObjectId;
  date: string;
  resume: string;
}

// prettier-ignore
export interface ICall {
  sector: any;
  author: any;
  date: string;
  resume: string;
}

const callSchema = new Schema<ICallMongo>({
  sector: { type: Schema.Types.ObjectId, ref: "roles" },
  author: { type: Schema.Types.ObjectId, ref: "users" },
  date: { type: String, required: true },
  resume: { type: String, required: true },
});

export const Call = mongoose.model("calls", callSchema);
