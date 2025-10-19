import supertest from "supertest";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import app from "../../app.js";
import { ParentModel } from "../../models/parent.js";
import mongoose from "mongoose";
import { generateToken } from "../../middleware/token.js";
import jwt from "jsonwebtoken";

const request = require("supertest");

describe("GET /parent", () => {
  afterEach(async () => {
    await ParentModel.deleteMany({});
  });

  it("returns 200 when parent by ID is successfully found", async () => {
    const parent = await ParentModel.create({
      username: "TestParent",
      password: "Password1!0",
      profilePic: "ImageURL",
    });

    const token = generateToken(parent._id);

    const response = await request(app)
      .get("/parent")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("document");
    expect(response.body.document._id).toBe(parent._id.toString());
  });

  it("returns 404 if parent not found", async () => {
    const JWT = require("jsonwebtoken");
    const fakeId = new mongoose.Types.ObjectId();
    const secret = process.env.JWT_SECRET;
    const tokenWithFakeId = JWT.sign(
      {
        user_id: fakeId.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      },
      secret
    );
    const response = await request(app)
      .get("/parent")
      .set("Authorization", `Bearer ${tokenWithFakeId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
