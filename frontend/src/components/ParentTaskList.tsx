import { useState } from "react";
import { TaskType } from "../types/types";
import DeleteTaskModal from "./DeleteTaskModal";
import EditTaskModal from "./EditTaskModal";

interface ParentTaskProps {
  task: TaskType;
  isLast: boolean;
}

export default function ParentTask({ task, isLast }: ParentTaskProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div
        className={`flex justify-between items-center px-6 py-4 ${
          !isLast && "border-b border-gray-300"
        } hover:bg-gray-50 transition-colors duration-200 group`}
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              className="w-14 h-14 object-cover rounded-lg shadow-sm transform group-hover:scale-105 transition-transform duration-200"
              src={task.imageURL}
              alt={task.name}
            />
            <div className="absolute -top-2 -right-2 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">
              {task.value} pts
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-500">{task.name}</h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="text-blue-500 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-indigo-50 hover:cursor-pointer transition-colors duration-200"
            onClick={() => setIsEditTaskModalOpen(true)}
          >
            Edit
          </button>
          <EditTaskModal
            isOpen={isEditTaskModalOpen}
            onClose={() => setIsEditTaskModalOpen(false)}
            taskData={task}
          />
          <button
            className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50 hover:cursor-pointer transition-colors duration-200"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Delete Task Confirmation Modal */}
      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        taskId={task._id}
        taskName={task.name}
      />
    </>
  );
}
