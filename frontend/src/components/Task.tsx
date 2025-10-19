import { TaskType } from "../types/types";
import { TaskCompleteButton } from "./taskCompleteButton";

interface TaskProps extends TaskType {
  isTaskComplete: boolean;
  fetchChildTrigger: () => void;
  beforeImage?: string;
  afterImage?: string;
}

const Task = ({
  _id,
  name,
  value,
  imageURL,
  isTaskComplete,
  fetchChildTrigger,
  beforeImage,
  afterImage,
}: TaskProps) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Task Image at the Top */}
      <div className="flex justify-center p-4 bg-gray-50">
        <div className="relative w-32 h-32 overflow-hidden rounded">
          <img
            className="w-full h-full object-cover object-center"
            src={imageURL}
            alt={name}
          />
          {isTaskComplete && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Flex container for Before and After images, next to each other */}
      {isTaskComplete && (beforeImage || afterImage) && (
        <div className="flex justify-center space-x-4 p-4">
          {beforeImage && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">Before:</h3>
              <img
                src={beforeImage} // Base64 or URL for before image
                alt="Before"
                className="w-32 h-32 object-cover object-center rounded-md shadow-sm"
              />
            </div>
          )}

          {afterImage && (
            <div>
              <h3 className="text-sm font-medium text-gray-700">After:</h3>
              <img
                src={afterImage} // Base64 or URL for after image
                alt="After"
                className="w-32 h-32 object-cover object-center rounded-md shadow-sm"
              />
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{name}</h2>
        <div className="flex items-center justify-between mb-4">
          <span
            className={`${
              isTaskComplete ? `bg-green-500` : `bg-indigo-500`
            } text-sm font-medium text-white px-2.5 py-0.5 rounded`}
          >
            {isTaskComplete && "+"}
            {value} Points
          </span>
        </div>

        <TaskCompleteButton
          task_id={_id}
          isTaskComplete={isTaskComplete}
          fetchChildTrigger={fetchChildTrigger}
        />
      </div>
    </div>
  );
};

export default Task;
