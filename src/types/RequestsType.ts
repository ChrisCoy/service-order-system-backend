import { Request, Response, NextFunction } from "express";

export interface RequestUsr extends Request {
  user: any;
}
