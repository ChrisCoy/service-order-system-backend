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
      res.status(400).json({ err: "Invalid Credentials!" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(400).json({ err: "Invalid Credentials!" });
      return;
    }

    const accessToken = createTokens(user);

    res.cookie("access-token", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });
  } catch (err) {
    return res.status(400).json({ err });
  }

  return res.status(200).send();
});

publicRouter.post("/validate", validateToken, (req: IRequestValidate, res) => {
  if (req.authenticated) {
    return res.status(200).send();
  }

  console.log("Cookies: ", req.cookies);

  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);

  return res.status(400).json({ err: "Invalid or expired session." });
});
