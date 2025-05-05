import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const UpdateScoreModal = ({ isOpen, onClose, assignment, onSubmit }) => {
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (assignment && isOpen) {
      setScore(assignment.score || 0);
    }
  }, [assignment, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const scoreValue = parseFloat(score);
    if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 10) {
      setError("Score must be between 0 and 10!");
      return;
    }

    onSubmit({
      id: assignment.id,
      score: scoreValue,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Cập nhật điểm</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Thực tập sinh:</span>{" "}
                {assignment?.intern?.user?.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Người hướng dẫn:</span>{" "}
                {assignment?.mentor?.user?.name}
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="score"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Điểm (0-10)
              </label>
              <input
                type="number"
                id="score"
                min="0"
                max="10"
                step="1"
                value={score}
                onChange={(e) => {
                  const parsedValue = parseFloat(e.target.value);
                  setScore(isNaN(parsedValue) ? 0 : parsedValue);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
          </div>

          <div className="px-6 py-4 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateScoreModal;
