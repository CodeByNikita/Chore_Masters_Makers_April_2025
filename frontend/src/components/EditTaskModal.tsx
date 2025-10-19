import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putEditTask } from "../services/parent";
import { TaskPayload } from "../types/types";
import { convertToBase64 } from "../utils/utils";
import { TaskType } from "../types/types";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskData: TaskType;
}

export default function EditTaskModal({
  isOpen,
  onClose,
  taskData,
}: EditTaskModalProps) {
  const queryClient = useQueryClient();
  const [editedTask, setEditedTask] = useState<TaskType>({
    _id: taskData._id,
    name: taskData.name,
    value: taskData.value,
    imageURL: taskData.imageURL,
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const editTaskMutation = useMutation({
    mutationFn: (taskData: TaskPayload) => putEditTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parentData"] });
      onClose();
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let base64TaskImage = "";

    if (newImage) {
      base64TaskImage = await convertToBase64(newImage);
    } else if (editedTask.imageURL) {
      base64TaskImage = editedTask.imageURL;
    }

    const finalTaskData = {
      _id: editedTask._id,
      name: editedTask.name,
      value: Number(editedTask.value),
      imageURL: base64TaskImage,
    };

    editTaskMutation.mutate(finalTaskData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-3xl">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Task Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task name"
              value={editedTask.name}
              onChange={(e) =>
                setEditedTask({ ...editedTask, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Task Value
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter point value"
              value={editedTask.value}
              onChange={(e) =>
                setEditedTask({ ...editedTask, value: Number(e.target.value) })
              }
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {newImage ? "New Image" : "Current Image"}
            </label>
            <div className="flex items-center space-x-4">
              {(editedTask.imageURL || newImage) && (
                <img
                  src={
                    newImage
                      ? URL.createObjectURL(newImage)
                      : editedTask.imageURL
                  }
                  className="w-20 h-20 rounded-full object-cover"
                  alt="Task preview"
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="border rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:text-sm
                            file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-200"
                onChange={(e) => setNewImage(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100 hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:cursor-pointer"
              disabled={editTaskMutation.isPending}
            >
              {editTaskMutation.isPending ? "Submitting..." : "Edit Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
