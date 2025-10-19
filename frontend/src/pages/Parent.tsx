import { useQuery } from "@tanstack/react-query";
import { fetchParent } from "../services/parent";
import { ParentType } from "../types/types";
import ChildInfo from "../components/ChildInfo";
import Navbar from "../components/Navbar";
import ParentTask from "../components/ParentTaskList";
import { useState } from "react";
import AddChildModal from "../components/AddChildModal";
import AddTaskModal from "../components/AddTaskModal";
import AddPrizeModal from "../components/AddPrizeModal";
import ParentPrize from "../components/ParentPrizeList";

export default function Parent() {
  const {
    isPending,
    isError,
    data: parent,
  } = useQuery<ParentType>({
    queryKey: ["parentData"],
    queryFn: () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      return fetchParent(token);
    },
  });
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddPrizeModalOpen, setIsAddPrizeModalOpen] = useState(false);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred</div>;
  }
  return (
    <>
      <Navbar name={parent.username} imageURL={parent.profilePic} />

      <main className="grid grid-cols-2 gap-8 px-4 ">
        <section className="px-4 mt-12">
          <div className="flex justify-between items-center px-2 mb-5">
            <h1 className="text-2xl text-gray-500">Children Overview</h1>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:cursor-pointer"
              onClick={() => setIsAddChildModalOpen(true)}
            >
              Add Child
            </button>
            <AddChildModal
              isOpen={isAddChildModalOpen}
              onClose={() => setIsAddChildModalOpen(false)}
              tasks={parent.tasks}
              prizes={parent.prizes}
            />
          </div>
          {parent.usersChildren.map((child) => {
            return <ChildInfo key={child._id} child={child} />;
          })}
        </section>

        <section className="px-4 mt-12">
          <div>
            <div className="flex justify-between items-center px-2 mb-5">
              <h1 className="text-2xl text-gray-500">Task List</h1>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:cursor-pointer"
                onClick={() => setIsAddTaskModalOpen(true)}
              >
                Add Task
              </button>
              <AddTaskModal
                isOpen={isAddTaskModalOpen}
                onClose={() => setIsAddTaskModalOpen(false)}
              />
            </div>
            <div className="rounded-2xl bg-white">
              {parent.tasks.map((task, index) => {
                return (
                  <ParentTask
                    key={task._id}
                    isLast={index === parent.tasks.length - 1}
                    task={task}
                  />
                );
              })}
            </div>
          </div>

          <section className="w-full mt-20">
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-2xl text-gray-500">Available Prizes</h1>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:cursor-pointer"
                onClick={() => setIsAddPrizeModalOpen(true)}
              >
                Add Prize
              </button>
              <AddPrizeModal
                isOpen={isAddPrizeModalOpen}
                onClose={() => setIsAddPrizeModalOpen(false)}
              />
            </div>
            <div className="grid grid-cols-3 gap-6">
              {parent.prizes.map((prize) => {
                return <ParentPrize key={prize._id} prize={prize} />;
              })}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
