import { sign, verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/User";
import { Types } from "mongoose";

interface IUserData extends IUser {
  _id: Types.ObjectId;
}

interface IRequestValidate extends Request {
  authenticated?: boolean;
}

export const createTokens = (user: IUserData) => {
  const accessToken = sign(
    { _id: user._id, name: user.name, isAdmin: user.isAdmin, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: 60 }
  );
  return accessToken;
};

export const validateToken = (req: IRequestValidate, res: Response, next: NextFunction) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ err: "User not Authenticated" });
  }

  try {
    const validToken = verify(accessToken, process.env.JWT_SECRET as string);
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
};
