import supertest from "supertest";
import { describe, it, expect, beforeEach } from "vitest";
import app from "../../app.js";
import { OneDocumentResponse } from "../../types/responsesTypes.js";
import { Parent, ParentModel } from "../../models/parent.js";

const request = supertest(app);

describe("POST /signup", () => {
  beforeEach(async () => {
    await ParentModel.deleteMany({});
  });

  it("creates a new parent successfully", async () => {
    const newParent = {
      username: "testparent",
      password: "Password123!",
      profilePic: "http://example.com/pic.jpg",
    };

    const response = await request.post("/signup").send(newParent);

    const responseBody = response.body as OneDocumentResponse<Parent>;

    expect(response.status).toBe(201);
    expect(responseBody.document).toHaveProperty(
      "username",
      newParent.username
    );

    expect(responseBody.document).toHaveProperty(
      "profilePic",
      newParent.profilePic
    );

    expect(responseBody.document.usersChildren).toHaveLength(0);
    expect(responseBody.document.tasks).toHaveLength(0);
    expect(responseBody.document.prizes).toHaveLength(0);
  });
});
