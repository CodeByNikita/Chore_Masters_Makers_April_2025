import { Request, Response, NextFunction } from "express";
import { OneDocumentResponse } from "../types/responsesTypes.js";
import { DatabaseError, ValidationError } from "../types/errorTypes.js";
import { Parent, ParentModel } from "../models/parent.js";
import { ChildModel } from "../models/child.js";
import { Prize, PrizeModel } from "../models/prize.js";
import { TaskModel, Task } from "../models/task.js";

import {
  addParentRequest,
  addPrizeRequest,
  addTaskRequest,
  removeTaskRequest,
  deletePrizeRequest,
} from "../types/requestTypes.js";

const getParentByIdController = async (
  req: Request<{}, {}, { id: string }, {}>,
  res: Response<OneDocumentResponse<Parent>>,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new ValidationError("Missing id from request", 400);
    }

    const parentDoc: Parent | null = await ParentModel.findById(id)
      .populate({
        path: "usersChildren",
        populate: [
          { path: "prize", model: PrizeModel },
          { path: "tasksCompleted" },
          { path: "tasksNotCompleted" },
        ],
      })
      .populate("tasks")
      .populate("prizes");

    if (!parentDoc) {
      throw new DatabaseError("Parent not found with that username", 404);
    }

    res.status(200).json({ document: parentDoc });
  } catch (error) {
    next(error);
  }
};

const addTaskController = async (
  req: Request<{}, {}, addTaskRequest, {}>,
  res: Response<OneDocumentResponse<Task>>,
  next: NextFunction
) => {
  try {
    const { id, name, value, imageURL } = req.body;

    const parent = await ParentModel.findById(id);
    if (!parent) {
      throw new DatabaseError("Parent not found", 404);
    }

    if (!name || !value || !imageURL) {
      throw new ValidationError("Missing attributes in request body", 400);
    }

    const newTask = await TaskModel.create({
      name: name,
      value: value,
      imageURL: imageURL,
    });

    const createdTask = await TaskModel.create(newTask);

    if (!createdTask) {
      throw new DatabaseError("Failed to create a new task", 400);
    }

    parent.tasks.push(createdTask);
    await parent.save();

    res.status(200).json({ document: createdTask });
  } catch (error) {
    next(error);
  }
};

const editTaskController = async (
  req: Request<{}, {}, addTaskRequest, {}>,
  res: Response<OneDocumentResponse<Task>>,
  next: NextFunction
) => {
  try {
    const { id, name, value, imageURL, _id: taskId } = req.body;

    const findTask = await TaskModel.findById(taskId);

    if (!findTask) {
      throw new DatabaseError("Task not found", 404);
    }

    if (!name || !value || !imageURL) {
      throw new ValidationError("Missing attributes in request body", 400);
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      {
        name,
        value,
        imageURL,
      },
      { new: true }
    );

    if (!updatedTask) {
      throw new DatabaseError("Failed to update task", 500);
    }

    const parent = await ParentModel.findByIdAndUpdate(id, {
      $addToSet: { tasks: updatedTask._id },
    });

    if (!parent) {
      throw new DatabaseError("Could not update parent tasks", 500);
    }

    res.status(200).json({ document: updatedTask });
  } catch (error) {
    next(error);
  }
};

const removeTaskController = async (
  req: Request<{}, {}, removeTaskRequest, {}>,
  res: Response<OneDocumentResponse<Task>>,
  next: NextFunction
) => {
  try {
    const { id, taskId } = req.body;

    if (!taskId) {
      throw new ValidationError("No task id in request body", 400);
    }

    if (!id) {
      throw new ValidationError("No user id in request body", 400);
    }

    const parent = await ParentModel.findById(id);
    if (!parent) {
      throw new DatabaseError("No parent found with that id", 404);
    }

    const taskToDelete = await TaskModel.findById(taskId);
    if (!taskToDelete) {
      throw new DatabaseError("No task found with that id", 404);
    }

    if (!parent.tasks.map((id) => id.toString()).includes(taskId)) {
      throw new DatabaseError("This task does not belong to the parent", 400);
    }

    const childrenWithTask = await ChildModel.find({
      $or: [{ tasksCompleted: taskId }, { tasksNotCompleted: taskId }],
    }).limit(1); // We only need to know if at least one exists

    // If task is assigned to any child, prevent deletion
    if (childrenWithTask.length > 0) {
      throw new DatabaseError(
        "Cannot delete task that is assigned to children",
        400
      );
    }

    await ParentModel.updateOne({ _id: id }, { $pull: { tasks: taskId } });

    await taskToDelete.deleteOne();

    res.status(200).json({ document: taskToDelete });
  } catch (error) {
    next(error);
  }
};

const newParentController = async (
  req: Request<{}, {}, addParentRequest, {}>,
  res: Response<OneDocumentResponse<Parent>>,
  next: NextFunction
) => {
  try {
    const { username, password, profilePic } = req.body;

    if (!username || !password || !profilePic) {
      throw new ValidationError("All fields must be filled", 400);
    }
    const userExists = await ParentModel.findOne({ username: username });

    if (userExists) {
      throw new DatabaseError("Username already exists", 400);
    }

    const createdParent = await ParentModel.create({
      username,
      password,
      usersChildren: [],
      tasks: [],
      prizes: [],
      profilePic: profilePic ? profilePic : "",
    });
    if (!createdParent) {
      throw new DatabaseError("Parent creation failed", 500);
    }

    res.status(201).json({ document: createdParent });
  } catch (error) {
    next(error);
  }
};

const addPrizeController = async (
  req: Request<{}, {}, addPrizeRequest, {}>,
  res: Response<OneDocumentResponse<Prize>>,
  next: NextFunction
) => {
  try {
    const { name, value, imageURL, id } = req.body;
    const parent = await ParentModel.findById(id);
    if (!parent) {
      throw new DatabaseError("Parent not found", 404);
    }
    if (!name || !value || !imageURL) {
      throw new ValidationError("All fields must be filled", 400);
    }
    const newPrize = await PrizeModel.create({
      name: name,
      value: value,
      imageURL: imageURL,
    });
    if (!newPrize) {
      throw new DatabaseError("Failed to create new prize", 500);
    }
    await ParentModel.findByIdAndUpdate(
      id,
      { $push: { prizes: newPrize._id } },
      { new: true }
    );
    res.status(201).json({ document: newPrize });
  } catch (error) {
    next(error);
  }
};

const deletePrizeController = async (
  req: Request<{}, {}, deletePrizeRequest, {}>,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  try {
    const { id, prizeId } = req.body;
    const parent = await ParentModel.findById(id);
    if (!parent) {
      throw new DatabaseError("Parent not found", 404);
    }
    if (!prizeId) {
      throw new ValidationError("No prize id provided", 400);
    }
    if (!parent.prizes.some((p) => p.toString() === prizeId)) {
      throw new ValidationError(
        "Prize not found in this parent's prize list",
        404
      );
    }
    const prizeAllocatedToChild = await ChildModel.exists({ prize: prizeId });

    if (prizeAllocatedToChild) {
      throw new ValidationError(
        "Prize is still allocated to a child and cannot be deleted",
        400
      );
    }
    await ParentModel.updateMany(
      { prizes: prizeId },
      { $pull: { prizes: prizeId } }
    );
    await PrizeModel.findByIdAndDelete(prizeId);
    res.status(200).json({ message: "prize deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  getParentByIdController,
  addTaskController,
  removeTaskController,
  addPrizeController,
  newParentController,
  deletePrizeController,
  editTaskController,
};
