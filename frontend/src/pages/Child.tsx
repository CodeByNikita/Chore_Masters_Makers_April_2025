import { useQuery } from "@tanstack/react-query";
import { fetchChild } from "../services/child";
import { ChildType } from "../types/types";
import Task from "../components/Task";
import Navbar from "../components/Navbar";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

export default function Child() {
  const { width, height } = useWindowSize();

  const {
    isPending,
    isError,
    data: child,
    refetch: fetchChildTrigger,
  } = useQuery<ChildType>({
    queryKey: ["childData"],
    queryFn: () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      return fetchChild(token);
    },
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>Error occurred loading your data. Please try again later.</p>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    Math.round((child.points / Number(child.prize.value)) * 100),
    100
  );

  const achievedPrize =
    Number(child.points) === Number(child.prize.value) ||
    Number(child.points) > Number(child.prize.value);

  return (
    <>
      <Navbar name={child.username} imageURL={child.imageURL} />

      {achievedPrize && (
        <Confetti tweenDuration={10} width={width} height={height} />
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 pb-8">
          <div className="md:flex items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100">
                <img
                  className="w-full h-full object-cover"
                  src={child.imageURL}
                  alt={child.username}
                />
              </div>
              <h1 className="text-3xl font-bold text-amber-500">
                {child.username}
              </h1>
            </div>

            <div className="w-90 bg-gradient-to-r from-indigo-800 to-red-600  bg-opacity-30 rounded-xl p-4 backdrop-blur-sm mt-10">
              <p className="absolute -top-10 text-indigo-700 text-center left-34 text-lg">
                Progress
              </p>
              <div className="flex justify-between mb-2 gap-4">
                <span className="font-bold text-white block mb-4 text-center">
                  {progressPercentage}% Complete!
                </span>
              </div>
              <div className="w-full bg-white bg-opacity-50 rounded-full h-4 -mt-2 mb-4">
                <div
                  className="bg-gradient-to-r from-yellow-300 to-yellow-500 h-4 rounded-full relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute -right-3 -top-1 animate-bounce">
                    🚀
                  </div>
                </div>
              </div>
              <span className="text-lg font-bold text-white">
                🌟 {child.points} / {child.prize.value} points
              </span>
            </div>

            <div className="flex flex-col items-center relative">
              <span className="text-lg text-indigo-600 mb-3">Your Prize</span>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
                <div className="relative w-42 bg-white rounded-lg overflow-hidden shadow-xl">
                  <img
                    className="w-full h-full object-contain p-2 transform group-hover:scale-105 transition-transform duration-300"
                    src={child.prize.imageURL}
                    alt={`Prize: ${child.prize.value} points`}
                  />
                  <p className="mb-1 text-lg font-semibold text-indigo-700 text-center">
                    🎁 {child.prize.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Completed Tasks
          </h2>

          {child.tasksCompleted.length === 0 ? (
            <p className="text-gray-500 italic">
              No tasks completed yet. Keep going!
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {child.tasksCompleted.map((task) => {
                const taskImages = child.taskImages?.find(
                  (image) => image.taskId === task._id
                );
                return (
                  <div key={task._id}>
                    <Task
                      _id={task._id}
                      name={task.name}
                      value={task.value}
                      imageURL={task.imageURL}
                      isTaskComplete={true}
                      fetchChildTrigger={fetchChildTrigger}
                      beforeImage={taskImages?.picBefore}
                      afterImage={taskImages?.picAfter}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Incomplete Tasks */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Tasks To Complete
          </h2>

          {child.tasksNotCompleted.length === 0 ? (
            <p className="text-gray-500 italic">
              All tasks are completed! Great job!
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {child.tasksNotCompleted.map((task) => (
                <div key={task._id}>
                  <Task
                    _id={task._id}
                    name={task.name}
                    value={task.value}
                    imageURL={task.imageURL}
                    isTaskComplete={false}
                    fetchChildTrigger={fetchChildTrigger}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
