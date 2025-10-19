import { generateToken } from "../middleware/token.js";
import { ParentModel, Parent } from "../models/parent.js";
import { ChildModel, Child } from "../models/child.js";
import { Request, Response, NextFunction } from "express";
import { TokenDocumentResponse } from "../types/responsesTypes.js";
import { authenticationBody } from "../types/paramsTypes.js";
import { DatabaseError } from "../types/errorTypes.js";

export const createToken = async (
  req: Request<{}, {}, authenticationBody, {}>,
  res: Response<TokenDocumentResponse>,
  next: NextFunction
) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    let userType: string = "Parent";

    let userDB = await ParentModel.findOne({ username: username });
    if (!userDB) {
      userDB = await ChildModel.findOne({ username: username });
      userType = "Child";
    }
    if (!userDB) {
      throw new DatabaseError("Invalid username", 404);
    }

    const isMatch = await userDB.comparePassword(password);
    if (!isMatch) {
      throw new DatabaseError("Password does not match", 404);
    }
    const token = generateToken(userDB._id);
    res.status(200).json({ token: token, userType: userType });
  } catch (error) {
    next(error);
  }
};
