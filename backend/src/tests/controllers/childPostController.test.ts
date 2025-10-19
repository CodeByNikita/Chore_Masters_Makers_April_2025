import request from "supertest";
import app from "../../app.js";
import { describe, it, expect, beforeEach, afterAll } from "vitest";

import { ChildModel } from "../../models/child.js";
import { ParentModel } from "../../models/parent.js";
import mongoose from "mongoose";
import { generateToken } from "../../middleware/token.js";

describe("POST /child", () => {
  beforeEach(async () => {
    await ChildModel.deleteMany({});
    await ParentModel.deleteMany({});
  });

  it("should create a new child and add to parent's children list", async () => {
    const parent = await ParentModel.create({
      username: "testparent",
      password: "password123",
      usersChildren: [],
    });

    const childData = {
      name: "testchild",
      password: "childpass123",
      selectedPrize: new mongoose.Types.ObjectId(),
      selectedTasks: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
      ],
      profilePic: "http://example.com/pic.jpg",
    };

    const token = generateToken(parent._id);

    const response = await request(app)
      .post("/child")
      .set("Authorization", `Bearer ${token}`)
      .send(childData);

    expect(response.status).toBe(201);
    // check parent was updated
    const updatedParent = await ParentModel.findById(parent._id);
    expect(updatedParent?.usersChildren).toHaveLength(1);
  });
});
