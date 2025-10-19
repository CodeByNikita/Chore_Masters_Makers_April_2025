import mongoose, { CallbackError, Document } from "mongoose";
import { Prize } from "./prize.js";
import bcrypt from "bcryptjs";
import { Task } from "./task.js";

interface TaskImages {
  taskId: string;
  picBefore: string;
  picAfter: string;
}

interface Child extends Document<mongoose.Schema.Types.ObjectId> {
  username: string;
  password: string;
  prize: Prize;
  tasksCompleted: Task[];
  tasksNotCompleted: Task[];
  points: number;
  imageURL: string;
  taskImages: TaskImages[];
  comparePassword(password: string): Promise<boolean>;
}

const ChildSchema = new mongoose.Schema<Child>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  prize: { type: mongoose.Types.ObjectId, ref: "Prize", required: true },
  tasksCompleted: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
  tasksNotCompleted: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
  points: { type: Number, required: true },
  imageURL: { type: String, required: true },
  taskImages: [
    {
      taskId: { type: mongoose.Types.ObjectId, ref: "Task", required: true },
      picBefore: { type: String },
      picAfter: { type: String },
    },
  ],
});

ChildSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

ChildSchema.methods.comparePassword = async function (
  childUserPassword: string
) {
  return bcrypt.compare(childUserPassword, this.password);
};

const ChildModel = mongoose.model<Child>("Child", ChildSchema);

export { ChildModel, Child };
