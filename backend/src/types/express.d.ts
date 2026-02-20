import { IUser } from "../../models/UserModel";
import { Document } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | Document | any;
    }
  }
}

export {};
