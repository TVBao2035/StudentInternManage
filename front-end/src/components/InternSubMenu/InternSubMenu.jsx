import React from "react";
import { Link, useLocation } from "react-router-dom";

const InternSubMenu = () => {
  const location = useLocation();
  const isInternManagementActive =
    location.pathname === "/intern-manager" ||
    (location.pathname.includes("/intern-manager") &&
      !location.pathname.includes("/assign"));

  const isAssignmentActive = location.pathname.includes(
    "/intern-manager/assign"
  );

  return (
    <div className="w-full bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex">
          <Link
            to="/intern-manager"
            className={`py-4 px-8 font-medium text-base border-b-2 ${
              isInternManagementActive
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300"
            } transition-colors duration-200`}
          >
            Quản lý thực tập sinh
          </Link>
          <Link
            to="/intern-manager/assign"
            className={`py-4 px-8 font-medium text-base border-b-2 ${
              isAssignmentActive
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-blue-600 hover:border-blue-300"
            } transition-colors duration-200`}
          >
            Phân công
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InternSubMenu;
