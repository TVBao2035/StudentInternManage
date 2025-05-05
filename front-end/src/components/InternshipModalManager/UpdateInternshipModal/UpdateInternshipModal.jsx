import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateEmployee } from "../../../api/internAPI";
import {
  showSuccessToast,
  showErrorToast,
} from "../../../helpers/NotificationToast";
import DateInput from "../../DateInput/DateInput";
import {
  formatDateToDisplay,
  isValidDateFormat,
} from "../../../helpers/dateUtils";

const UpdateInternshipModal = ({ isOpen, onClose, onSubmit, intern }) => {
  const [dateError, setDateError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [internData, setInternData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    schoolName: "",
    type: 0,
  });

  useEffect(() => {
    if (intern && intern.user) {
      setInternData({
        id: intern.id,
        userId: intern.user.id,
        name: intern.user.name || "",
        email: intern.user.email || "",
        phoneNumber: intern.user.phoneNumber || "",
        gender: intern.user.gender,
        birthDate: intern.user.birthDate
          ? formatDateToDisplay(intern.user.birthDate)
          : "",
        schoolName: intern.user.schoolName || "",
        type: 0,
      });
    }
  }, [intern]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "gender") {
      if (value === "") {
        setInternData((prev) => ({
          ...prev,
          [name]: null,
        }));
      } else {
        const genderValue = value === "true";
        setInternData((prev) => ({
          ...prev,
          [name]: genderValue,
        }));
      }
    } else if (name === "birthDate") {
      setInternData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setDateError(value && !isValidDateFormat(value));
    } else {
      setInternData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!internData.name?.trim()) {
      showErrorToast("Full name is required!");
      return;
    }

    if (internData.birthDate && !isValidDateFormat(internData.birthDate)) {
      setDateError(true);
      showErrorToast("Date format is invalid! Please use dd/MM/yyyy.");
      return;
    }

    try {
      setLoading(true);
      const updateData = {
        id: internData.id,
        userId: internData.userId,
        type: 0,
        user: {
          id: internData.userId,
          name: internData.name,
          email: internData.email,
          phoneNumber: internData.phoneNumber,
          gender: internData.gender,
          birthDate: internData.birthDate || null,
          schoolName: internData.schoolName || null,
        },
      };

      //if (!updateData.user.birthDate) {
      //delete updateData.user.birthDate;
      //}

      const response = await updateEmployee(updateData);
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        showSuccessToast("Update intern successfully!");
        onSubmit({
          ...intern,
          ...updateData,
          name: updateData.user.name,
          email: updateData.user.email,
          user: {
            ...intern.user,
            ...updateData.user,
          },
        });

        onClose();
      } else {
        showErrorToast(response?.data?.message || "Update intern failed!");
      }
    } catch (err) {
      console.error("Error updating intern:", err);
      showErrorToast("An error occurred while updating the intern.");
    } finally {
      setLoading(false);
    }
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
                readOnly
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                title="Email không thể chỉnh sửa"
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 w-28"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={internData.phoneNumber}
                readOnly
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                title="Số điện thoại không thể chỉnh sửa"
              />
            </div>

            <div className="flex items-center">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 w-28"
              >
                Giới tính
              </label>
              <div className="relative flex-1">
                {internData.gender === null ? (
                  <div className="flex items-center">
                    <select
                      id="gender"
                      name="gender"
                      onChange={handleChange}
                      defaultValue=""
                      className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="" disabled>
                        Chọn giới tính
                      </option>
                      <option value="true">Nam</option>
                      <option value="false">Nữ</option>
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
                ) : (
                  <select
                    id="gender"
                    name="gender"
                    value={
                      internData.gender === null
                        ? ""
                        : internData.gender.toString()
                    }
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="true">Nam</option>
                    <option value="false">Nữ</option>
                    <option value="">Không chọn</option>
                  </select>
                )}
              </div>
            </div>

            <DateInput
              label="Ngày sinh"
              name="birthDate"
              value={internData.birthDate}
              onChange={handleChange}
              required={false}
            />

            <div className="flex items-center">
              <label
                htmlFor="schoolName"
                className="block text-sm font-medium text-gray-700 w-28"
              >
                Tên trường
              </label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={internData.schoolName}
                onChange={handleChange}
                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-2.5 text-white text-sm font-medium rounded-lg transform hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang lưu...
              </>
            ) : (
              "Lưu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInternshipModal;
