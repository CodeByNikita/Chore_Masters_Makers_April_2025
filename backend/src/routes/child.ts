import { Request, Response, Router } from "express";
import {
  getChildByIdController,
  putPicsOnTask,
  putTaskOnChild,
  postAddNewChild,
} from "../controllers/child.js";

const childRouter: Router = Router();
childRouter.get("/", getChildByIdController);
childRouter.put("/", putTaskOnChild, putPicsOnTask);
childRouter.post("/", postAddNewChild);

export { childRouter };
