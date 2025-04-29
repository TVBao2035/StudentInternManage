import { useMemo } from "react";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiBriefcase,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

export function useRoleBasedMenus(navigate, onLogoutClick) {
  const getRoleBasedMenuItems = (userRoles = []) => {
    const menuItems = [];

    if (userRoles.includes("admin")) {
      menuItems.push(
        {
          title: "Quản lý nhân viên",
          action: () => navigate("/employees"),
          icon: <FiUsers size={16} />,
        },
        {
          title: "Quản lý tài khoản",
          action: () => navigate("/account"),
          icon: <FiSettings size={16} />,
        }
      );
    }

    if (userRoles.includes("business")) {
      menuItems.push(
        {
          title: "Quản lý bài đăng",
          action: () => navigate("/post-manager"),
          icon: <FiFileText size={16} />,
        },
        {
          title: "Quản lý thực tập",
          action: () => navigate("/interns"),
          icon: <FiBriefcase size={16} />,
        }
      );
    }

    if (userRoles.includes("student")) {
      menuItems.push(
        {
          title: "Quản lý ứng tuyển",
          action: () => navigate("/applications/manage"),
          icon: <FiBriefcase size={16} />,
        },
        {
          title: "Xem danh sách công việc",
          action: () => navigate("/jobs"),
          icon: <FiFileText size={16} />,
        }
      );
    }

    if (userRoles.includes("mentor")) {
      menuItems.push(
        {
          title: "Quản lý thực tập sinh",
          action: () => navigate("/intern-manager"),
          icon: <FiUsers size={16} />,
        },
        {
          title: "Đánh giá thực tập",
          action: () => navigate("/intern-evaluations"),
          icon: <FiFileText size={16} />,
        }
      );
    }

    if (userRoles.includes("manager")) {
      menuItems.push(
        {
          title: "Báo cáo tổng quan",
          action: () => navigate("/reports"),
          icon: <FiFileText size={16} />,
        },
        {
          title: "Quản lý dự án",
          action: () => navigate("/projects"),
          icon: <FiBriefcase size={16} />,
        }
      );
    }

    return menuItems;
  };

  const commonMenuItems = [
    {
      title: "Thông tin cá nhân",
      action: () => navigate("/profile"),
      icon: <FiUser size={16} />,
    },
  ];

  const logoutMenuItem = {
    title: "Đăng xuất",
    action: onLogoutClick,
    icon: <FiLogOut size={16} />,
  };

  return {
    getRoleBasedMenuItems,
    commonMenuItems,
    logoutMenuItem,
    getAllMenuItems: (userRoles) => [
      ...commonMenuItems,
      ...getRoleBasedMenuItems(userRoles),
      logoutMenuItem,
    ],
  };
}
