import JWT from "jsonwebtoken";
import { DatabaseError } from "../types/errorTypes.js";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { TokenReqBody } from "../types/requestTypes.js";

export function generateToken(
  user_id: mongoose.Schema.Types.ObjectId | string
) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new DatabaseError("No secret", 500);
  }

  const token = JWT.sign(
    {
      user_id: user_id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    },
    secret
  );

  if (!token) {
    throw new DatabaseError("Token generation failed", 500);
  }

  return token;
}

export function decodeToken(token: string) {
  return JWT.decode(token);
}

export function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new DatabaseError("No secret", 401);
    }
    return JWT.verify(token, secret);
  } catch (error) {
    // Handle invalid or expired token error
    throw new DatabaseError("Invalid or expired token", 401);
  }
}

export const TokenMiddleware = async (
  req: Request<{}, {}, TokenReqBody, {}>,
  res: Response<{}, {}>,
  next: NextFunction
) => {
  try {
    let token: string = "";
    const authHeader = req.get("Authorization");
    if (authHeader) {
      token = authHeader.slice(7);
    }
    const result = verifyToken(token) as JwtPayload;
    if (!result.user_id) {
      throw new DatabaseError("mongoUserId not set in environment", 400);
    }
    req.body.id = result.user_id;
    next();
  } catch (error) {
    next(error);
  }
};
