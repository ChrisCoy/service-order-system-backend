import express from "express";
import { validateToken } from "../JWTUtil/JWT";
import { Role } from "../models/Role";
import { User } from "../models/User";

export const roleRouter = express.Router();

roleRouter.post("/add", validateToken, async (req, res) => {
  try {
    const { name } = req.body.data;

    const newRole = new Role({
      name,
    });
    await newRole.save();
  } catch (err) {
    console.error(err);

    return res.status(500).json({ err: "Error saving role." });
  }
  return res.status(200).send();
});

roleRouter.post("/update", validateToken, async (req, res) => {
  try {
    const { name, _id } = req.body.data;

    if (!name) {
      return res.status(500).json({ err: "Invalid Data!" });
    }
    const role = await Role.findOne({ _id: _id });

    if (role) {
      role.name = name;
      role.save();
    }

    return res.status(200).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err });
  }
});

roleRouter.post("/remove/:id", validateToken, async (req, res) => {
  try {
    const roleId = req.params.id;
    if (!roleId) {
      return res.status(500).json({ err: "Invalid Data!" });
    }

    const user = await User.findOne({ role: roleId });

    if (user) {
      return res.status(500).json({ err: "Role in use!" });
    }

    const role = await Role.findOne({ _id: roleId });

    if (role) {
      role.remove();
    }

    return res.status(200).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err });
  }
});

roleRouter.post("/list", validateToken, async (req, res) => {
  try {
    const roleList = await Role.find();

    return res.status(200).json({ roleList });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: err });
  }
});

roleRouter.post("/getRole/:id", validateToken, async (req, res) => {
  try {
    const roleId = req.params.id;

    if (!roleId || roleId === "undefined") {
      return res.status(500).json({ err: "Not found" });
    }

    const role = await Role.findById(roleId);

    return res.status(200).json({ role });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: err });
  }
});
