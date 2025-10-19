import supertest from "supertest";
import { describe, it, expect, afterEach } from "vitest";
import app from "../../app.js";
import { PrizeModel } from "../../models/prize.js";
import mongoose from "mongoose";

describe("Prize Model instantiates", () => {
  afterEach(async () => {
    await PrizeModel.deleteMany({});
  });
  it("Prize model instantiates with all fields", async () => {
    const prize1 = new PrizeModel({
      name: "test1",
      value: 20,
      imageURL: "imageURL1",
    });

    await prize1.save();
    expect(prize1._id).toBeDefined();
    expect(prize1.name).toBe("test1");
    expect(prize1.value).toBe(20);
    expect(prize1.imageURL).toBe("imageURL1");
  });

  it("should fail to create a task without required fields", async () => {
    const prizeWithoutRequiredField = new PrizeModel({});

    let err;
    try {
      await prizeWithoutRequiredField.save();
    } catch (error: any) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors).toHaveProperty("name");
    expect(err.errors).toHaveProperty("value");
    expect(err.errors).toHaveProperty("imageURL");
  });

  it("should not allow value to be other type than number", async () => {
    const prize2 = new PrizeModel({
      name: "test2",
      value: "twenty",
      imageURL: "imageURL1",
    });

    let err;
    try {
      await prize2.save();
    } catch (error: any) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.value.kind).toBe("Number");
  });
});
