import { validateToken } from "./../JWTUtil/JWT";
import bcrypt from "bcrypt";
import express from "express";
import { User } from "../models/User";
import { Role } from "../models/Role";

export const adminRouter = express.Router();



adminRouter.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(500).json({ err: "Invalid Data!" });
  }

  const hash = await bcrypt.hash(process.env.ADMIN_EMAIL as string, 10);

  const newUser = new User({
    name,
    email,
    password: hash,
    role,
  });

  try {
    await newUser.save();
  } catch (err) {
    return res.status(500).json({ err: "Error saving user." });
  }
  return res.status(200);
});

adminRouter.post("/role/add", async (req, res) => {
  const { name } = req.body;

  const newRole = new Role({
    name,
  });

  try {
    await newRole.save();
  } catch (err) {
    return res.status(500).json({ err: "Error saving user." });
  }
  return res.status(200).send();
});

adminRouter.post("/teste", validateToken, (req, res) => {
  User.findOne({ isAdmin: true }).then((item) => {
    // console.log(item);
  });

  return res.status(200).send();
});


