import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PrizeInputData, PrizePayload } from "../types/types";
import { convertToBase64 } from "../utils/utils";
import { postAddPrize } from "../services/parent";

interface AddPrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPrizeModal({ isOpen, onClose }: AddPrizeModalProps) {
  const [prizeData, setPrizeData] = useState<PrizeInputData>({
    name: "",
    value: 0,
    image: null,
  });

  const queryClient = useQueryClient();

  const addPrizeMutation = useMutation({
    mutationFn: (prizeData: PrizePayload) => postAddPrize(prizeData),
    onSuccess: () => {
      // Invalidate parent fetch query and refetch
      queryClient.invalidateQueries({ queryKey: ["parentData"] });
      onClose();
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let base64PrizePic = null;
    if (prizeData.image) {
      base64PrizePic = await convertToBase64(prizeData.image);
    }

    const finalPrizeData = {
      ...prizeData,
      image: base64PrizePic,
    };

    addPrizeMutation.mutate(finalPrizeData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-3xl">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Prize</h2>
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
              Prize Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter name"
              value={prizeData.name}
              onChange={(e) =>
                setPrizeData({ ...prizeData, name: e.target.value })
              }
            />
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Set Value
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Value"
              value={prizeData.value}
              onChange={(e) =>
                setPrizeData({ ...prizeData, value: Number(e.target.value) })
              }
              min="0"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Prize Picture
            </label>
            <div className="flex items-center space-x-4">
              {prizeData.image && (
                <img
                  src={URL.createObjectURL(prizeData.image)}
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="border rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:text-sm
                            file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-200"
                onChange={(e) =>
                  setPrizeData({
                    ...prizeData,
                    image: e.target.files?.[0] || null,
                  })
                }
              />
            </div>
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
              disabled={addPrizeMutation.isPending}
            >
              {addPrizeMutation.isPending ? "Adding..." : "Add Prize"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
