import { ChildType } from "../types/types";
import ChildTaskList from "./ChildTaskList";

export interface ChildInfoProps {
  child: ChildType;
}

export default function ChildInfo({ child }: ChildInfoProps) {
  return (
    <div className="mb-10 bg-white p-4 rounded-2xl shadow-sm pb-6">
      <div className="bg-white p-4">
        <div className="flex justify-between items-center">
          {/* Child Profile Section */}
          <div className="flex items-center gap-6">
            <img
              className="h-16 w-16 object-cover border-2 border-amber-300 rounded-full shadow-md hover:scale-105 transition-transform"
              src={child.imageURL}
              alt={child.username}
            />
            <h1 className="font-bold text-3xl text-amber-500 tracking-wide">
              {child.username}
            </h1>
          </div>

          {/* Prize Section */}
          <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-lg">
            <div className="flex flex-col items-center">
              <h2 className="text-gray-600 font-medium mb-1">Assigned Prize</h2>
              <h3 className="font-semibold text-gray-800">
                {child.prize.name}
              </h3>
            </div>
            <img
              className="w-14 h-14 object-cover border-2 border-gray-200 rounded-full shadow-sm hover:scale-105 transition-transform"
              src={child.prize.imageURL}
              alt={child.prize.name}
            />
          </div>

          {/* Points Counter */}
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 px-6 py-3 rounded-xl shadow-md">
            <p className="text-white text-center font-medium mb-1">Points</p>
            <p className="text-white text-xl font-bold">
              {child.points}
              <span className="text-cyan-200">/</span>
              {child.prize.value}
            </p>
          </div>
        </div>
      </div>

      <ChildTaskList
        tasks={child.tasksCompleted}
        title="Completed Tasks"
        titleColor="text-green-700"
        backgroundColor="bg-green-300"
        taskImages={child.taskImages}
      />

      <span className="block my-6"></span>

      <ChildTaskList
        tasks={child.tasksNotCompleted}
        title="Not Completed Tasks"
        titleColor="text-red-700"
        backgroundColor="bg-red-300"
      />

      {/* Non functional buttons */}
      {/* <div className="mt-6 flex gap-4 px-4 ">
        <button className="text-gray-600 border px-4 py-2 rounded-lg hover:bg-gray-200 hover:cursor-pointer">
          Add Task
        </button>
        <button className="text-gray-600 border px-4 py-2 rounded-lg hover:bg-gray-200 hover:cursor-pointer">
          Remove Task
        </button>
        <button className="text-gray-600 border px-4 py-2 rounded-lg hover:bg-gray-200 hover:cursor-pointer">
          Change Prize
        </button>
      </div> */}
    </div>
  );
}
