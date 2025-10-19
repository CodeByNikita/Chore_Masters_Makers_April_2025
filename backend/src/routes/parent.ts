import { Request, Response, Router } from "express";
import {
  getParentByIdController,
  addTaskController,
  addPrizeController,
  removeTaskController,
  deletePrizeController,
  editTaskController,
} from "../controllers/parent.js";

const parentRouter: Router = Router();
parentRouter.get("/", getParentByIdController);
parentRouter.post("/task", addTaskController);
parentRouter.put("/task", editTaskController);
parentRouter.delete("/task", removeTaskController);
parentRouter.post("/prize", addPrizeController);
parentRouter.delete("/prize", deletePrizeController);

export { parentRouter };
