import { TaskImages, TaskType } from "../types/types";
import { useState } from "react";

interface TaskListProps {
  tasks: Array<TaskType>;
  title: string;
  titleColor: string;
  backgroundColor: string;
  taskImages?: TaskImages[];
}

export default function ChildTaskList({
  tasks,
  title,
  titleColor,
  backgroundColor,
  taskImages,
}: TaskListProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className={`text-xl font-bold ${titleColor} mb-6`}>
        {tasks.length} {title}
      </h2>
      <div className="space-y-4">
        {tasks.map((task) => {
          const completedTask = taskImages?.filter(
            (image) => image.taskId === task._id
          )[0];

          return (
            <div
              key={task._id}
              className={`flex items-center justify-between p-4 ${backgroundColor} rounded-xl shadow-md hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-16 h-16 object-cover rounded-full border-2 border-gray-300 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                  src={task.imageURL}
                  alt={task.name}
                  onClick={() => openModal(task.imageURL)}
                />
                <div>
                  <h3 className="font-semibold text-lg">{task.name}</h3>
                  <p className="text-gray-600 font-medium">
                    {title.includes("Not Completed")
                      ? `${task.value} points`
                      : `+ ${task.value} points`}
                  </p>
                </div>
              </div>

              {completedTask && (
                <div className="flex gap-6">
                  <div className="text-center">
                    <img
                      src={completedTask.picBefore}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 shadow-sm cursor-pointer hover:opacity-90"
                      alt="Before"
                      onClick={() => openModal(completedTask.picBefore)}
                    />
                    <p className="mt-2 text-sm font-medium text-gray-600">
                      Before
                    </p>
                  </div>
                  <div className="text-center">
                    <img
                      src={completedTask.picAfter}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300 shadow-sm cursor-pointer hover:opacity-90"
                      alt="After"
                      onClick={() => openModal(completedTask.picAfter)}
                    />
                    <p className="mt-2 text-sm font-medium text-gray-600">
                      After
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black flex items-center justify-center z-50 "
          onClick={closeModal}
        >
          <div className="relative w-96 p-2">
            <button
              onClick={closeModal}
              className="absolute -top-2 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
