import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";
import bcrypt from "bcrypt";

dotenv.config();

let database: mongoose.Connection;

export const connectDB = () => {
  if (database) {
    return;
  }
  mongoose
    .connect(process.env.MONGO_LINK_CONNECTION as string)
    .then((db) => {
      database = db.connection;

      bcrypt.hash(process.env.ADMIN_PASSWORD as string, 10).then((hash) => {
        new User({
          name: "Admin",
          email: process.env.ADMIN_EMAIL,
          password: hash,
          isAdmin: true,
        })
          .save()
          .catch((err) => err.code !== 11000 && console.log(err));
      });

      console.log("Connected on DB with success.");
    })
    .catch((err) => console.error("ERROR ON DB CONNECTION: " + err));
};

export const disconnect = () => {
  if (!database) {
    return;
  }
  mongoose.disconnect();
};
