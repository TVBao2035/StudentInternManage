import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  School,
  EditIcon,
} from "lucide-react";
import { useUserAPI } from "../../../hooks/useUserAPI";
import { LoadingSpinner, ErrorMessage } from "../../../components/Common";
import { useSelector } from "react-redux";

const InformationPersonal = () => {
  const user = useSelector((state) => state.user);
  const [userInfo, setUserInfo] = useState(null);
  const { userDetail, loading, error, fetchUserByID } = useUserAPI();

  useEffect(() => {
    if (user && user.id) {
      fetchUserByID(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (userDetail) {
      setUserInfo({
        fullName: userDetail.name || "",
        email: userDetail.email || "",
        phone: userDetail.phoneNumber || "",
        gender: formatGender(userDetail.gender),
        dob: userDetail.birthDate || "",
        school: userDetail.schoolName || "",
      });
    }
  }, [userDetail]);

  const formatGender = (gender) => {
    if (gender === null || gender === undefined) return "Chưa cập nhật";
    return gender === true ? "Nam" : "Nữ";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} fullWidth={true} className="py-12 mt-4" />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 mt-1 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-500 ease-in-out">
        <div className="flex justify-between items-center mb-10 border-b pb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Thông tin cá nhân
            </h1>
          </div>
          <Link to="/profile-update" className="inline-block">
            <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center space-x-2">
              <EditIcon className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
          </Link>
        </div>

        <div className="grid gap-y-6 mt-8">
          <InfoRow
            icon={<User className="w-5 h-5 text-blue-500" />}
            label="Họ tên"
            value={userInfo?.fullName}
          />
          <InfoRow
            icon={<Mail className="w-5 h-5 text-blue-500" />}
            label="Email"
            value={userInfo?.email}
          />
          <InfoRow
            icon={<Phone className="w-5 h-5 text-blue-500" />}
            label="Số điện thoại"
            value={userInfo?.phone}
          />
          <InfoRow
            icon={<Users className="w-5 h-5 text-blue-500" />}
            label="Giới tính"
            value={userInfo?.gender || "Chưa cập nhật"}
          />
          <InfoRow
            icon={<Calendar className="w-5 h-5 text-blue-500" />}
            label="Năm Sinh"
            value={userInfo?.dob || "Chưa cập nhật"}
          />
          <InfoRow
            icon={<School className="w-5 h-5 text-blue-500" />}
            label="Tên Trường"
            value={userInfo?.school || "Chưa cập nhật"}
          />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 items-center p-5 hover:bg-gray-50 rounded-xl transition-all duration-300 group hover:shadow-md">
    <div className="font-semibold text-gray-700 flex items-center space-x-3">
      <div className="group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <span>{label}</span>
    </div>
    <div className="col-span-2 text-gray-800 md:ml-6 mt-1 md:mt-0 group-hover:translate-x-2 transition-transform duration-300 italic">
      {value}
    </div>
  </div>
);

export default InformationPersonal;
