import { Child } from "../models/child.js";
import { Task } from "../models/task.js";
import { Prize } from "../models/prize.js";

export interface reqPutTaskOnChild {
  id: string;
  task_id: string;
  picBefore?: string;
  picAfter?: string;
  updatedTaskAndPoints?: Child;
  isTaskComplete?: boolean;
}

export interface TokenReqBody {
  id?: string;
}

export interface removeTaskRequest {
  id: string;
  taskId: string;
}

export interface addTaskRequest {
  _id?: string;
  id: string;
  name: string;
  value: number;
  imageURL: string;
}

export interface addPrizeRequest {
  id: string;
  name: string;
  value: number;
  imageURL: string;
}

export interface addChildRequest {
  name: string;
  password: string;
  profilePic: File | null;
  selectedTasks: Task[];
  selectedPrize: Prize;
  id: string;
}

export interface addParentRequest {
  username: string;
  password: number;
  profilePic: string;
}

export interface deletePrizeRequest {
  id: string;
  prizeId: string;
}
