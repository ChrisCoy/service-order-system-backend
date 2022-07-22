import { validateToken } from "./../JWTUtil/JWT";
import bcrypt from "bcrypt";
import express from "express";
import { User } from "../models/User";
import { Role } from "../models/Role";
import type { IRequestValidate } from "../JWTUtil/JWT";

export const adminRouter = express.Router();

adminRouter.post("/register", validateToken, async (req, res) => {
  try {
    const { name, email, password, role } = req.body.data;
    console.log(name, email, password, role);

    if (!name || !email || !password || !role) {
      return res.status(500).json({ err: "Invalid Data!" });
    }

    const hash = await bcrypt.hash(password as string, 10);

    await new User({
      name,
      email,
      password: hash,
      role,
    }).save();
    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
});

adminRouter.post("/update-user", validateToken, async (req, res) => {
  try {
    const { name, email, password, role, _id } = req.body.data;
    console.log(name, email, password, role);

    if (!name || !email || !password || !role || !_id) {
      return res.status(500).json({ err: "Invalid Data!" });
    }

    const hash = await bcrypt.hash(password as string, 10);

    const user = await User.findOne({ _id: _id });

    if (user) {
      user.name = name;
      user.email = email;
      user.password = hash;
      user.role = role;
      user.save();
    }

    return res.status(200).send();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err });
  }
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

adminRouter.post("/role/list", validateToken, async (req: IRequestValidate, res) => {
  if (!req.isAdmin) {
    return res.status(400).json({ err: "Access denied." });
  }

  const roleList = await Role.find();
  console.log(roleList);

  return res.status(200).json({ roleList });
});

adminRouter.post("/user/list", validateToken, async (req: IRequestValidate, res) => {
  if (!req.isAdmin) {
    return res.status(400).json({ err: "Access denied." });
  }

  const userList = await User.find().populate("role");

  console.log(userList);

  return res.status(200).json({ userList });
});

adminRouter.post("/teste", validateToken, (req, res) => {
  return res.status(200).send();
});
