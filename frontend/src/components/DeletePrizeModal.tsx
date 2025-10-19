import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePrize } from "../services/parent";

interface DeletePrizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizeId: string;
  prizeName?: string;
}

export default function DeletePrizeModal({
  isOpen,
  onClose,
  prizeId,
  prizeName,
}: DeletePrizeModalProps) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const deletePrizeMutation = useMutation({
    mutationFn: async () => {
      return deletePrize(prizeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parentData"] });
      onClose();
    },
    onError: () => {
      setErrorMessage("Unable to delete prize assigned to a child!");
    },
  });

  if (!isOpen) return null;

  const handleConfirmDelete = () => {
    setErrorMessage(null);
    deletePrizeMutation.mutate();
  };

  const handleClickResetError = () => {
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent backdrop-blur-3xl">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
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

        {errorMessage ? (
          <>
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p>{errorMessage}</p>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleClickResetError}
                className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-700">
                Are you sure you want to delete{" "}
                {prizeName ? `"${prizeName}"` : "this prize"}?
              </p>
              <p className="text-gray-500 text-sm mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                disabled={deletePrizeMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                disabled={deletePrizeMutation.isPending}
              >
                {deletePrizeMutation.isPending ? "Deleting..." : "Delete Prize"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
