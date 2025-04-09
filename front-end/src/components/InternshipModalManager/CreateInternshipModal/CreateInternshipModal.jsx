import React, { useState } from "react";
import { X } from "lucide-react";

const CreateInternshipModal = ({ isOpen, onClose, onSubmit }) => {
  const [selectedInterns, setSelectedInterns] = useState([]);
  const internsList = [
    { id: 1, name: "Nguyen Van C", email: "nguyenvanc@gmail.com" },
    { id: 2, name: "Nguyen Van D", email: "nguyenvand@gmail.com" },
    { id: 3, name: "Nguyen Van E", email: "nguyenvane@gmail.com" },
    // { id: 4, name: "Nguyen Van C", email: "nguyenvanc@gmail.com" },
    // { id: 5, name: "Nguyen Van D", email: "nguyenvand@gmail.com" },
    // { id: 6, name: "Nguyen Van E", email: "nguyenvane@gmail.com" },
    // { id: 7, name: "Nguyen Van C", email: "nguyenvanc@gmail.com" },
    // { id: 8, name: "Nguyen Van D", email: "nguyenvand@gmail.com" },
    // { id: 9, name: "Nguyen Van E", email: "nguyenvane@gmail.com" },
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl h-[600px] flex flex-col transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-blue-600 tracking-wide">
            Tạo mới
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5 flex-1 overflow-hidden">
          <h3 className="text-base font-semibold mb-4 text-gray-700">
            Danh sách thực tập sinh
          </h3>
          <div className="border border-gray-200 rounded-xl p-3 h-[400px] overflow-hidden flex flex-col bg-gray-50/50">
            <div className="overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-blue-500">
              <div className="space-y-2.5">
                {internsList.map((intern, index) => (
                  <div
                    key={intern.id}
                    className="flex items-center border border-gray-200 rounded-lg bg-white py-3 px-4 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="w-6 text-center text-sm font-medium text-gray-500">
                      {index + 1}
                    </div>
                    <div className="flex-1 flex mx-4">
                      <div className="text-sm font-medium w-32 text-gray-700">
                        {intern.name}
                      </div>
                      <div className="text-sm text-gray-500 flex-1">
                        {intern.email}
                      </div>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedInterns.includes(intern.id)}
                        onChange={() => handleToggleIntern(intern.id)}
                        className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all duration-200 accent-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInternshipModal;
