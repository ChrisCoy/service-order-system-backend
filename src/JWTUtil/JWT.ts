import { sign, verify } from "jsonwebtoken";
import { NextFunction } from "express";

import type { Request, Response } from "express";
import type { IUser } from "../models/User";
import type { Types } from "mongoose";

interface IUserData extends IUser {
  _id: Types.ObjectId;
}

export interface IRequestValidate extends Request {
  authenticated?: boolean;
  isAdmin?: false | boolean;
}

interface valideAndReturnUserFunc {
  _id: string;
  name: string;
  isAdmin: boolean;
  role: string;
  iat?: number;
  exp?: number;
}

export const createTokens = (user: IUserData) => {
  const accessToken = sign(
    { _id: user._id, name: user.name, isAdmin: user.isAdmin, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: 60 * 60 * 24 } // 24 hours
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
      const { isAdmin }: any = validToken;
      req.isAdmin = isAdmin;
      return next();
    }
  } catch (err) {
    return res.status(500).json({ err: err });
  }
};

export const valideAndReturnUser = (token: any): valideAndReturnUserFunc => {
  try {
    const validToken = verify(JSON.parse(token as string), process.env.JWT_SECRET as string);

    if (!validToken) {
      throw new Error("Invalid Token");
    }

    return validToken as valideAndReturnUserFunc;
  } catch (err) {
    console.error(err);
    throw new Error("Invalid Token");
  }
};
