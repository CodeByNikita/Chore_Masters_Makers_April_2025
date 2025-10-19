import { Request, Response, NextFunction } from "express";
import { OneDocumentResponse } from "../types/responsesTypes.js";
import { DatabaseError, ValidationError } from "../types/errorTypes.js";
import { TaskModel, Task } from "../models/task.js";
import { PrizeModel } from "../models/prize.js";
import { Child, ChildModel } from "../models/child.js";
import { addChildRequest, reqPutTaskOnChild } from "../types/requestTypes.js";
import { ParentModel } from "../models/parent.js";

const getChildByIdController = async (
  req: Request<{}, {}, { id: string }, {}>,
  res: Response<OneDocumentResponse<Child>>,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw new ValidationError("Missing id from request", 400);
    }

    const childDoc: Child | null = await ChildModel.findById(id).populate([
      { path: "prize", model: PrizeModel },
      { path: "tasksCompleted", model: TaskModel },
      { path: "tasksNotCompleted", model: TaskModel },
    ]);

    if (!childDoc) {
      throw new DatabaseError("Child not found child with that username", 404);
    }

    res.status(200).json({ document: childDoc });
  } catch (error) {
    next(error);
  }
};

const putTaskOnChild = async (
  req: Request<{}, {}, reqPutTaskOnChild, {}>,
  res: Response<OneDocumentResponse<Child>>,
  next: NextFunction
) => {
  try {
    const { id, task_id } = req.body;
    if (!id) {
      throw new ValidationError("Missing child ID in request body", 400);
    }

    const childDoc = await ChildModel.findById(id).populate([
      { path: "prize", model: PrizeModel },
      { path: "tasksCompleted", model: TaskModel },
      { path: "tasksNotCompleted", model: TaskModel },
    ]);

    if (!childDoc) {
      throw new DatabaseError("Child not found", 404);
    }

    const taskInCompleted = childDoc.tasksCompleted.find(
      (task: Task) => task._id.toString() === task_id
    );
    const taskInNotCompleted = childDoc.tasksNotCompleted.find(
      (task: Task) => task._id.toString() === task_id
    );

    let update;
    let taskValue = 0;

    if (taskInNotCompleted) {
      req.body.isTaskComplete = true;
      taskValue = Number((taskInNotCompleted as Task).value);
      update = {
        $pull: { tasksNotCompleted: task_id },
        $addToSet: { tasksCompleted: task_id },
        $inc: { points: taskValue },
      };
    } else if (taskInCompleted) {
      req.body.isTaskComplete = false;
      taskValue = Number((taskInCompleted as Task).value);
      update = {
        $pull: { tasksCompleted: task_id },
        $addToSet: { tasksNotCompleted: task_id },
        $inc: { points: -taskValue },
      };
    } else {
      throw new DatabaseError("Task not found in child task lists", 404);
    }

    const updatedChild = await ChildModel.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedChild) {
      throw new DatabaseError("Failed to update child", 500);
    }

    req.body.updatedTaskAndPoints = updatedChild;

    next();
  } catch (error) {
    next(error);
  }
};

const putPicsOnTask = async (
  req: Request<{}, {}, reqPutTaskOnChild, {}>,
  res: Response<OneDocumentResponse<Child>>,
  next: NextFunction
) => {
  try {
    const {
      picBefore,
      picAfter,
      task_id,
      id,
      updatedTaskAndPoints,
      isTaskComplete,
    } = req.body;
    const update =
      isTaskComplete && (picBefore || picAfter)
        ? {
            $addToSet: {
              taskImages: {
                taskId: task_id,
                ...(picBefore && { picBefore: picBefore }),
                ...(picAfter && { picAfter: picAfter }),
              },
            },
          }
        : {
            $pull: {
              taskImages: {
                taskId: task_id,
              },
            },
          };

    const updatedChild = await ChildModel.findByIdAndUpdate(id, update, {
      new: true,
    }).populate([
      { path: "prize", model: PrizeModel },
      { path: "tasksCompleted", model: TaskModel },
      { path: "tasksNotCompleted", model: TaskModel },
    ]);

    if (updatedChild) {
      res.status(200).json({ document: updatedChild });
    }
  } catch (error) {
    next(error);
  }
};

const postAddNewChild = async (
  req: Request<{}, {}, addChildRequest, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password, selectedPrize, selectedTasks, profilePic, id } =
      req.body;

    const parent = await ParentModel.findById(id);
    if (!parent) {
      throw new DatabaseError("Parent not found", 404);
    }

    const newChild = await ChildModel.create({
      username: name,
      password: password,
      prize: selectedPrize,
      tasksCompleted: [],
      tasksNotCompleted: [...selectedTasks],
      points: 0,
      imageURL: profilePic ? profilePic : "",
      taskImages: [],
    });

    if (!newChild) {
      throw new DatabaseError("Failed to create new child", 500);
    }

    parent.usersChildren.push(newChild);
    await parent.save();

    res.status(201).json({ document: newChild });
  } catch (error) {
    next(error);
  }
};

export {
  getChildByIdController,
  putTaskOnChild,
  putPicsOnTask,
  postAddNewChild,
};
