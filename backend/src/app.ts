import express, { Express, Application } from "express";
import dotenv from "dotenv";
import { parentRouter } from "./routes/parent.js";
import cors from "cors";
import { globalErrorHandler } from "./errorHandlers/errorHandlers.js";
import { childRouter } from "./routes/child.js";
import { tokenRouter } from "./routes/token.js";
import { TokenMiddleware } from "./middleware/token.js";
import { newParentController } from "./controllers/parent.js";

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.post("/signup", newParentController);
app.use("/parent", TokenMiddleware, parentRouter);
app.use("/child", TokenMiddleware, childRouter);
app.use("/token", tokenRouter);

app.use(globalErrorHandler);

export default app;
