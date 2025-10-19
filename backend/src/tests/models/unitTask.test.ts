import supertest from "supertest";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import app from "../../app.js";
import { TaskModel } from "../../models/task.js";
import mongoose from "mongoose";

describe("Task Model instantiates", () => {
  afterEach(async () => {
    await TaskModel.deleteMany({});
  });
  it("Instantiates with all fields", async () => {
    const task1 = new TaskModel({
      name: "test1",
      value: 20,
      imageURL: "imageURL1",
    });

    await task1.save();
    expect(task1._id).toBeDefined();
    expect(task1.name).toBe("test1");
    expect(task1.value).toBe(20);
    expect(task1.imageURL).toBe("imageURL1");
  });

  it("should fail to create a task without required fields", async () => {
    const taskWithoutRequiredField = new TaskModel({});

    let err;
    try {
      await taskWithoutRequiredField.save();
    } catch (error: any) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors).toHaveProperty("name");
    expect(err.errors).toHaveProperty("value");
    expect(err.errors).toHaveProperty("imageURL");
  });

  it("should not allow value to be other type than number", async () => {
    const task2 = new TaskModel({
      name: "test2",
      value: "twenty",
      imageURL: "imageURL1",
    });

    let err;
    try {
      await task2.save();
    } catch (error: any) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.value.kind).toBe("Number");
  });
});
