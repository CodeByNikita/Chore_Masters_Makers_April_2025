import { useState } from "react";
import { PrizeType } from "../types/types";
import DeletePrizeModal from "./DeletePrizeModal";

interface PrizeTypeProps {
  prize: PrizeType;
}

export default function ParentPrize({ prize }: PrizeTypeProps) {
  const [isPrizeDeleteModalOpen, setIsPrizeDeleteModalOpen] = useState(false);

  const handlePrizeDeleteClick = () => {
    setIsPrizeDeleteModalOpen(true);
  };

  const handleClosePrizeDeleteModal = () => {
    setIsPrizeDeleteModalOpen(false);
  };

  return (
    <div
      key={prize._id}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative h-48">
        <img
          src={prize.imageURL}
          alt={prize.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full">
          {prize.value} points
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl text-gray-500 mb-2">{prize.name}</h3>
        <div className="flex justify-end">
          {/* <button className="text-blue-500 hover:text-blue-800 px-3 py-1  rounded-md hover:bg-blue-50 hover:cursor-pointer">
            Edit
          </button> */}
          <button
            onClick={handlePrizeDeleteClick}
            className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 hover:cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
      <DeletePrizeModal
        isOpen={isPrizeDeleteModalOpen}
        onClose={handleClosePrizeDeleteModal}
        prizeId={prize._id}
        prizeName={prize.name}
      />
    </div>
  );
}
