import bcrypt from "bcrypt";
import express from "express";
import { Request } from "express";
import { User } from "../models/User";
import { createTokens, validateToken } from "../JWTUtil/JWT";

export const publicRouter = express.Router();

interface IRequestValidate extends Request {
  authenticated?: boolean;
}

publicRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      // return res.status(400).json({ err: "Invalid Credentials!" });
      return res.status(400).json({ err: "Usuario nao cadastrado!" });
    }

    console.log(user);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ err: "Invalid Credentials!" });
    }

    const accessToken = createTokens(user);

    // res.cookie("access-token", accessToken, {
    //   maxAge: 1000 * 60 * 60 * 24,
    //   httpOnly: false,
    //   secure: true,
    //   sameSite: "none",
    // });

    return res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(400).json({ err });
  }
});

publicRouter.post("/validate", validateToken, (req: IRequestValidate, res) => {
  if (req.authenticated) {
    return res.status(200).send();
  }
  return res.status(400).json({ err: "Invalid or expired session." });
});
