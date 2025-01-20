import React, { useState, useEffect } from "react";

interface DeletePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName: string;
}

const DeletePopup: React.FC<DeletePopupProps> = ({
  isOpen,
  onClose,
  onDelete,
  itemName,
}) => {
  const [confirmationText, setConfirmationText] = useState("");

  useEffect(() => {
    if (isOpen) {
      setConfirmationText("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Confirm Delete
        </h2>
        <p className="mb-4 text-white">
          Are you sure you want to delete{" "}
          <span className="font-bold">{itemName}</span>?
        </p>
        <p className="text-sm text-gray-400 mb-2">
          Please type <span className="font-bold">{itemName}</span> to confirm
          deletion
        </p>
        <input
          type="text"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          placeholder="Type the name to confirm"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={confirmationText !== itemName}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
