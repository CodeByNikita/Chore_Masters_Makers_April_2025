import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAddChild } from "../services/child";
import { TaskType, PrizeType, ChildData } from "../types/types";
import { convertToBase64 } from "../utils/utils";

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskType[];
  prizes: PrizeType[];
}

export default function AddChildModal({
  isOpen,
  onClose,
  tasks,
  prizes,
}: AddChildModalProps) {
  const [childData, setChildData] = useState<ChildData>({
    name: "",
    password: "",
    profilePic: null,
    selectedTasks: [],
    selectedPrize: null,
  });

  const queryClient = useQueryClient();

  const addChildMutation = useMutation({
    mutationFn: (childData: ChildData) => postAddChild(childData),
    onSuccess: () => {
      // Invalidate parent fetch query and refetch
      queryClient.invalidateQueries({ queryKey: ["parentData"] });
      onClose();
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let base64ProfilePic = null;
    if (childData.profilePic) {
      base64ProfilePic = await convertToBase64(childData.profilePic);
    }

    const finalChildData = {
      ...childData,
      profilePic: base64ProfilePic,
    };

    addChildMutation.mutate(finalChildData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-3xl">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Child</h2>
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

        {/* Name Input */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Child's Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              value={childData.name}
              onChange={(e) =>
                setChildData({ ...childData, name: e.target.value })
              }
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Set Password
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              value={childData.password}
              onChange={(e) =>
                setChildData({ ...childData, password: e.target.value })
              }
            />
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              {childData.profilePic && (
                <img
                  src={URL.createObjectURL(childData.profilePic)}
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="border rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:text-sm
                            file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-200"
                onChange={(e) =>
                  setChildData({
                    ...childData,
                    profilePic: e.target.files?.[0] || null,
                  })
                }
              />
            </div>
          </div>

          {/* Task Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Assign Tasks
            </label>
            <div className="grid grid-cols-2 gap-4 max-h-40 overflow-y-auto">
              {tasks.map((task) => (
                <label
                  key={task._id}
                  className="flex items-center space-x-2 p-2 border rounded-lg"
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-500"
                    checked={childData.selectedTasks.some(
                      (t) => t._id === task._id
                    )}
                    onChange={(e) => {
                      const newTasks = e.target.checked
                        ? [...childData.selectedTasks, task]
                        : childData.selectedTasks.filter(
                            (t) => t._id !== task._id
                          );
                      setChildData({ ...childData, selectedTasks: newTasks });
                    }}
                  />
                  <span>{task.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Prize Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Select Prize
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={childData.selectedPrize?._id || ""}
              onChange={(e) =>
                setChildData({
                  ...childData,
                  selectedPrize:
                    prizes.find((p) => p._id === e.target.value) || null,
                })
              }
            >
              <option value="">Select a prize</option>
              {prizes.map((prize) => (
                <option key={prize._id} value={prize._id}>
                  {prize.name} - {prize.value} points
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
              disabled={addChildMutation.isPending}
            >
              {addChildMutation.isPending ? "Adding..." : "Add Child"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
