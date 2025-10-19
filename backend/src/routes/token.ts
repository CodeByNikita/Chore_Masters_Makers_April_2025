import { Request, Response, Router } from "express";
import { createToken } from "../controllers/authentication.js";

const tokenRouter: Router = Router();
tokenRouter.post("/", createToken);

export { tokenRouter };
