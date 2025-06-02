import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  School,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUserAPI } from "../../../hooks/useUserAPI";
import { LoadingSpinner, ErrorMessage } from "../../../components/Common";

const InformationPersonalUpdate = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const {
    userDetail,
    loading,
    updating,
    error,
    fetchUserByID,
    updateUserInfo,
  } = useUserAPI();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
    schoolName: "",
  });

  useEffect(() => {
    if (user && user.id) {
      fetchUserByID(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (userDetail) {
      setFormData({
        id: userDetail.id,
        name: userDetail.name || "",
        email: userDetail.email || "",
        phoneNumber: userDetail.phoneNumber || "",
        gender: userDetail.gender,
        birthDate: userDetail.birthDate || "",
        schoolName: userDetail.schoolName || "",
      });
    }
  }, [userDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "gender") {
      let genderValue;
      if (value === "Nam") {
        genderValue = true;
      } else if (value === "Nữ") {
        genderValue = false;
      } else {
        genderValue = null;
      }

      setFormData((prevState) => ({
        ...prevState,
        [name]: genderValue,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userDataToUpdate = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
      birthDate: formData.birthDate,
      schoolName: formData.schoolName,
    };

    const success = await updateUserInfo(userDataToUpdate);
    if (success) {
      navigate("/profile");
    } 
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !updating) {
    return (
      <ErrorMessage message={error} fullWidth={true} className="py-12 mt-4" />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 mt-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 ease-in-out">
        {error && updating && <ErrorMessage message={error} className="mb-4" />}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2.5 rounded-full">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Chỉnh sửa thông tin
            </h1>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              disabled={updating}
              className={`px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center space-x-2 ${
                updating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {updating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu lại</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={updating}
              className={`px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center space-x-2 ${
                updating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <X className="w-4 h-4" />
              <span>Hủy bỏ</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <FormRow
              icon={<User className="w-5 h-5 text-blue-500" />}
              label="Họ tên"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <FormRow
              icon={<Mail className="w-5 h-5 text-blue-500" />}
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={true}
              required
            />

            <FormRow
              icon={<Phone className="w-5 h-5 text-blue-500" />}
              label="Số điện thoại"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />

            <GenderFormRow
              icon={<Users className="w-5 h-5 text-blue-500" />}
              label="Giới tính"
              name="gender"
              value={
                formData.gender === true
                  ? "Nam"
                  : formData.gender === false
                  ? "Nữ"
                  : "Không xác định"
              }
              onChange={handleChange}
            />

            <FormRow
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              label="Năm Sinh"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />

            <FormRow
              icon={<School className="w-5 h-5 text-blue-500" />}
              label="Tên Trường"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const FormRow = ({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
  required = false,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 items-center p-3 hover:bg-gray-50 rounded-xl transition-all duration-300 group hover:shadow-md">
    <div className="font-semibold text-gray-700 flex items-center space-x-3">
      <div className="group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </div>
    <div className="col-span-2 md:ml-4 mt-1 md:mt-0">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
          disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
        }`}
      />
    </div>
  </div>
);

const GenderFormRow = ({ icon, label, name, value, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 items-center p-3 hover:bg-gray-50 rounded-xl transition-all duration-300 group hover:shadow-md">
    <div className="font-semibold text-gray-700 flex items-center space-x-3">
      <div className="group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span>{label}</span>
    </div>
    <div className="col-span-2 md:ml-4 mt-1 md:mt-0">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      >
        <option value="Không xác định">Không xác định</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
      </select>
    </div>
  </div>
);

export default InformationPersonalUpdate;
