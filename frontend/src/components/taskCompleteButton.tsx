import { putTaskCompleteChild } from "../services/child";
import { useState } from "react";
import { convertToBase64 } from "../utils/utils";

interface TaskCompleteButtonProps {
  task_id: string;
  isTaskComplete: boolean;
  fetchChildTrigger: () => void;
}
export const TaskCompleteButton = ({
  task_id,
  isTaskComplete,
  fetchChildTrigger,
}: TaskCompleteButtonProps) => {
  let token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Unable to update like listing");
  }

  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const handleClickButton = async () => {
    setIsButtonClicked(true);
    const beforeBase64 = beforeImage
      ? await convertToBase64(beforeImage)
      : null;
    const afterBase64 = afterImage ? await convertToBase64(afterImage) : null;
    await putTaskCompleteChild(token, task_id, beforeBase64, afterBase64);
    fetchChildTrigger();
  };

  return (
    <div className="flex flex-col gap-2">
      {!isTaskComplete && (
        <>
          <label className="inline-block">
            <span className="block mb-1 text-sm font-medium text-gray-700">
              Before Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBeforeImage(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-blue-800 file:m-1"
            />
          </label>

          <label className="inline-block">
            <span className="block mb-1 text-sm font-medium text-gray-700">
              After Image
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAfterImage(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-blue-800 file:m-1"
            />
          </label>
        </>
      )}

      <button
        disabled={isButtonClicked}
        onClick={handleClickButton}
        className={`text-white px-4 py-2 rounded-full font-semibold cursor-pointer ${
          isTaskComplete
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {}
        {isButtonClicked
          ? "Marking..."
          : isTaskComplete
          ? "Mark as Incomplete"
          : "Mark Complete"}
      </button>
    </div>
  );
};
