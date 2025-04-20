import React, { useState } from "react";
import { X } from "lucide-react";

const CreateInternshipModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedInterns, setSelectedInterns] = useState([]);

  const internsList = [
    { id: 1, name: "Nguyen Van C", email: "nguyenvanc@gmail.com" },
    { id: 2, name: "Nguyen Van D", email: "nguyenvand@gmail.com" },
    { id: 3, name: "Nguyen Van E", email: "nguyenvane@gmail.com" },
  ];

  const handleToggleIntern = (internId) => {
    if (selectedInterns.includes(internId)) {
      setSelectedInterns(selectedInterns.filter((id) => id !== internId));
    } else {
      setSelectedInterns([...selectedInterns, internId]);
    }
  };

  const handleSubmit = () => {
    const selectedInternData = internsList.filter((intern) =>
      selectedInterns.includes(intern.id)
    );
    onSubmit(selectedInternData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600">Tạo mới</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Danh sách thực tập sinh</h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {internsList.map((intern, index) => (
              <div
                key={intern.id}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="w-8 text-center font-medium text-gray-700">
                  {index + 1}
                </div>
                <div className="flex-1 ml-4">
                  <div className="font-medium">{intern.name}</div>
                  <div className="text-sm text-gray-500">{intern.email}</div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedInterns.includes(intern.id)}
                    onChange={() => handleToggleIntern(intern.id)}
                    className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInternshipModal;
