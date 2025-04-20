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

const InformationPersonalUpdate = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    school: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockUserInfo = {
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      phone: "0987654123",
      gender: "Nam",
      dob: "12/08/2012",
      school: "Trường đại học Tiền Giang",
    };
    setTimeout(() => {
      setFormData(mockUserInfo);
      setLoading(false);
    }, 300);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đã lưu thông tin:", formData);
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 border-opacity-80 shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 mt-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 ease-in-out">
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
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu lại</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center space-x-2"
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
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

            <FormRow
              icon={<Mail className="w-5 h-5 text-blue-500" />}
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormRow
              icon={<Phone className="w-5 h-5 text-blue-500" />}
              label="Số điện thoại"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />

            <FormRow
              icon={<Users className="w-5 h-5 text-blue-500" />}
              label="Giới tính"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            />

            <FormRow
              icon={<Calendar className="w-5 h-5 text-blue-500" />}
              label="Năm Sinh"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />

            <FormRow
              icon={<School className="w-5 h-5 text-blue-500" />}
              label="Tên Trường"
              name="school"
              value={formData.school}
              onChange={handleChange}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const FormRow = ({ icon, label, name, type = "text", value, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 items-center p-3 hover:bg-gray-50 rounded-xl transition-all duration-300 group hover:shadow-md">
    <div className="font-semibold text-gray-700 flex items-center space-x-3">
      <div className="group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span>{label}</span>
    </div>
    <div className="col-span-2 md:ml-4 mt-1 md:mt-0">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
      />
    </div>
  </div>
);

export default InformationPersonalUpdate;
