import mongoose, { Document } from "mongoose";

interface Task extends Document<mongoose.Schema.Types.ObjectId> {
  name: string;
  value: Number;
  imageURL: string;
}

const TaskSchema = new mongoose.Schema<Task>({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  imageURL: { type: String, required: true },
});

const TaskModel = mongoose.model<Task>("Task", TaskSchema);

export { TaskModel, Task };
