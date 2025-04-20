import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiSettings,
  FiLogOut,
  FiHome,
  FiBriefcase,
  FiSearch,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Navbar from "../Navbar/Navbar";
import DropdownMenu from "../DropdownMenu/DropdownMenu";

const Header = ({
  isAuthenticated,
  userFullName,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getActiveNavItem = () => {
    const path = location.pathname;
    if (path === "/" || path === "") return "home";
    if (path.includes("post-manager")) return "jobs";
    if (path.includes("intern-manager")) return "applications";

    return null;
  };

  const navItems = [
    {
      title: "Trang chủ",
      href: "/",
      type: "link",
      id: "home",
      icon: <FiHome size={18} />,
    },
    {
      title: "Tìm việc",
      href: "/post-manager",
      type: "link",
      id: "jobs",
      icon: <FiSearch size={18} />,
    },
    {
      title: "Công việc ứng tuyển",
      href: "/intern-manager",
      type: "link",
      id: "applications",
      icon: <FiBriefcase size={18} />,
    },
  ];

  const mainMenuItems = [
    {
      title: "Thông tin cá nhân",
      action: () => (window.location.href = "/profile"),
    },
    {
      title: "Quản lý ứng tuyển",
      action: () => (window.location.href = "/applications/manage"),
    },
    {
      title: "Quản lý nhân viên",
      action: () => (window.location.href = "/employees"),
    },
    {
      title: "Quản lý bài đăng",
      action: () => (window.location.href = "/posts/manage"),
    },
    {
      title: "Quản lý thực tập",
      action: () => (window.location.href = "/interns"),
    },
    {
      title: "Quản lý tài khoản",
      action: () => (window.location.href = "/account"),
    },
    {
      title: "Xem danh sách công việc",
      action: () => (window.location.href = "/jobs"),
    },
    {
      title: "Đăng xuất",
      action: onLogoutClick,
    },
  ];

  return (
    // <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg">
    <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-blue-700/90 to-blue-500/90 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <nav className="hidden md:flex flex-1">
            <div className="flex">
              {navItems.map((item) => {
                const isActive = getActiveNavItem() === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`py-2 px-6 font-medium text-base transition-all duration-300 mx-1 ${
                      isActive
                        ? "bg-blue-100 text-blue-700 rounded-full font-semibold shadow-sm"
                        : "text-blue-50 hover:bg-blue-600/20 hover:text-white rounded-full"
                    }`}
                  >
                    <div className="flex items-center">
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.title}
                    </div>
                  </Link>

                  // <Link
                  //   key={item.id}
                  //   to={item.href}
                  //   className={`py-2 px-6 font-medium text-base transition-all duration-300 mx-1 ${
                  //     isActive
                  //       ? "bg-white text-blue-600 rounded-full font-semibold"
                  //       : "text-blue-50 hover:bg-blue-600/30 hover:text-white rounded-full"
                  //   }`}
                  //   // className={`border-b-2 py-4 px-6 font-medium text-base transition-all duration-300 ease-in-out hover:bg-blue-600/30 ${
                  //   //   isActive
                  //   //     ? "text-white border-white font-semibold"
                  //   //     : "text-blue-50 border-transparent hover:text-white hover:border-blue-300"
                  //   // }`}
                  // >
                  //   <div className="flex items-center">
                  //     {item.icon && <span className="mr-2">{item.icon}</span>}
                  //     {item.title}
                  //   </div>
                  // </Link>
                );
              })}
            </div>
          </nav>

          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center">
                  <span className="mr-3 text-white font-medium">
                    {userFullName}
                  </span>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-2 rounded-full bg-blue-600/40 hover:bg-blue-600/70 transition-colors duration-300 ease-in-out"
                    aria-label="Toggle menu"
                  >
                    {isDropdownOpen ? (
                      <FiX size={20} className="text-white" />
                    ) : (
                      <FiMenu size={20} className="text-white" />
                    )}
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100 animate-fade-in">
                    {mainMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={item.action}
                        className="w-full text-left px-6 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 hover:text-blue-700"
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-6 py-2 font-medium text-white bg-blue-600/30 hover:bg-blue-600/70 rounded-full transition-all duration-300 hover:shadow-md"
              >
                Đăng nhập/Đăng ký
              </button>
            )}
          </div>

          {/* <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full bg-blue-600/40 hover:bg-blue-600/70 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div> */}
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-1 animate-slide-down">
            <Navbar
              items={navItems} // Navbar component sẽ tự xử lý icon từ items
              isMobile={true}
              active={getActiveNavItem()}
            />

            {isAuthenticated  ? (
              <div className="border-t border-blue-400/50 pt-2">
                {mainMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full text-left px-3 py-2.5 text-base font-medium hover:bg-blue-600/40 transition-all duration-200 rounded-md my-0.5"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="block w-full text-left px-3 py-2.5 text-base font-medium hover:bg-blue-600/40 transition-all duration-200 rounded-md my-0.5"
              >
                Đăng nhập/Đăng ký
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  userFullName: PropTypes.string,
  onLoginClick: PropTypes.func.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

export default Header;
