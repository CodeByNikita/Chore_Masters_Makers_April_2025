import mongoose, { CallbackError, Document } from "mongoose";
import { Child } from "./child.js";
import { Task } from "./task.js";
import bcrypt from "bcryptjs";
import { Prize } from "./prize.js";

interface Parent extends Document<mongoose.Schema.Types.ObjectId> {
  username: string;
  password: string;
  usersChildren: Child[];
  tasks: Task[];
  profilePic: string;
  prizes: Prize[];
  comparePassword(password: string): Promise<boolean>;
}

const ParentSchema = new mongoose.Schema<Parent>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  usersChildren: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
  ],
  tasks: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  ],
  profilePic: { type: String, required: false },
  prizes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Prize", required: true },
  ],
});

ParentSchema.pre("save", async function (next) {
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

ParentSchema.methods.comparePassword = async function (usersPassword: string) {
  return bcrypt.compare(usersPassword, this.password);
};

const ParentModel = mongoose.model<Parent>("Parent", ParentSchema);

export { ParentModel, Parent };
