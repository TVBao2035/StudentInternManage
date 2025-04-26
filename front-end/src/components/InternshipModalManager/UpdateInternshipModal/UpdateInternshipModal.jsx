import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const UpdateInternshipModal = ({ isOpen, onClose, onSubmit, intern }) => {
  const [internData, setInternData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    school: "",
    position: "Intern",
  });

  useEffect(() => {
    if (intern) {
      setInternData({
        name: intern.name || "",
        email: intern.email || "",
        phone: intern.phone || "",
        gender: intern.gender || "",
        birthDate: intern.birthDate || "",
        school: intern.school || "",
        position: intern.position || "Intern",
      });
    }
  }, [intern]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInternData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...intern,
      ...internData,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl flex flex-col transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-blue-600 tracking-wide">
            Chỉnh sửa
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="space-y-4">
            <div className="flex items-center">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 w-28"
              >
                Họ tên
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={internData.name}
                onChange={handleChange}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 w-28"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={internData.email}
                onChange={handleChange}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 w-28"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={internData.phone}
                onChange={handleChange}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 w-28"
              >
                Giới tính
              </label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={internData.gender}
                onChange={handleChange}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 w-28"
              >
                Năm sinh
              </label>
              <input
                type="text"
                id="birthDate"
                name="birthDate"
                value={internData.birthDate}
                onChange={handleChange}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="school"
                className="block text-sm font-medium text-gray-700 w-28"
              >
                Tên trường
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={internData.school}
                onChange={handleChange}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 w-28"
              >
                Vị trí
              </label>
              <div className="relative flex-1">
                <select
                  id="position"
                  name="position"
                  value={internData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Intern">Intern</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Junior">Junior</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transform hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInternshipModal;
