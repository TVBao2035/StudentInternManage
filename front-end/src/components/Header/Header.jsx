import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
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
    },
    {
      title: "Tìm việc",
      href: "/post-manager",
      type: "link",
      id: "jobs",
    },
    {
      title: "Công việc ứng tuyển",
      href: "/intern-manager",
      type: "link",
      id: "applications",
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
    <header className="fixed w-full top-0 z-50 bg-blue-600 text-white shadow-lg">
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
                    className={`border-b-2 py-4 px-6 font-medium text-base transition-colors duration-200 ${
                      isActive
                        ? "text-white border-white"
                        : "text-blue-100 border-transparent hover:text-white hover:border-blue-300"
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center">
                  <span className="mr-2 text-white font-medium">
                    {userFullName}
                  </span>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="p-1 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    aria-label="Toggle menu"
                  >
                    {isDropdownOpen ? (
                      <FiX size={24} className="text-white" />
                    ) : (
                      <FiMenu size={24} className="text-white" />
                    )}
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg z-50">
                    {mainMenuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={item.action}
                        className="w-full text-left px-6 py-4 text-gray-800 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
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
                className="px-6 py-2 font-medium hover:underline"
              >
                Đăng nhập/Đăng ký
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-1">
            <Navbar
              items={navItems}
              isMobile={true}
              active={getActiveNavItem()}
            />

            {isAuthenticated ? (
              <div className="border-t border-blue-500 pt-2">
                {mainMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full text-left px-3 py-2 text-base font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-blue-700 transition-colors duration-200"
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

// import React, { useState } from "react";
// import { FiMenu, FiX, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
// import PropTypes from "prop-types";

// const Header = ({
//   isAuthenticated,
//   userFullName,
//   onLoginClick,
//   onRegisterClick,
//   onLogoutClick,
// }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const navItems = [
//     { title: "Trang chủ", href: "#" },
//     { title: "Tìm việc", href: "#" },
//     { title: "Công việc ứng tuyển", href: "#" },
//   ];

//   const dropdownItems = [
//     { title: "Thông tin cá nhân", icon: <FiUser />, action: () => {} },
//     { title: "Cài đặt", icon: <FiSettings />, action: () => {} },
//     { title: "Đăng xuất", icon: <FiLogOut />, action: onLogoutClick },
//   ];

//   return (
//     <header className="fixed w-full top-0 z-50 bg-blue-500 text-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <nav className="hidden md:flex flex-1">
//             <div className="flex space-x-1">
//               {navItems.map((item) => (
//                 <a
//                   key={item.title}
//                   href={item.href}
//                   className="text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-blue-600 hover:text-white flex items-center"
//                 >
//                   {item.title}
//                 </a>
//               ))}
//             </div>
//           </nav>

//           <div className="hidden md:flex items-center space-x-4">
//             {isAuthenticated ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
//                   aria-label="User menu"
//                 >
//                   <FiUser className="h-5 w-5" />
//                   <span className="font-medium">{userFullName}</span>
//                 </button>

//                 {isDropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black ring-opacity-5 transform transition-all duration-200">
//                     {dropdownItems.map((item) => (
//                       <button
//                         key={item.title}
//                         onClick={item.action}
//                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150"
//                       >
//                         {item.icon}
//                         <span className="ml-2">{item.title}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <button
//                 onClick={onLoginClick}
//                 className="bg-white text-blue-500 px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors duration-200"
//               >
//                 Đăng nhập / Đăng ký
//               </button>
//             )}
//           </div>

//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="p-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
//               aria-label="Toggle menu"
//             >
//               {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//             </button>
//           </div>
//         </div>

//         {isMenuOpen && (
//           <div className="md:hidden py-2 space-y-1">
//             {navItems.map((item) => (
//               <a
//                 key={item.title}
//                 href={item.href}
//                 className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors duration-200"
//               >
//                 {item.title}
//               </a>
//             ))}
//             {isAuthenticated ? (
//               <div className="border-t border-blue-400 pt-2">
//                 {dropdownItems.map((item) => (
//                   <button
//                     key={item.title}
//                     onClick={item.action}
//                     className="flex items-center w-full px-3 py-2 text-base font-medium hover:bg-blue-600 transition-colors duration-200"
//                   >
//                     {item.icon}
//                     <span className="ml-2">{item.title}</span>
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               <button
//                 onClick={onLoginClick}
//                 className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-blue-600 transition-colors duration-200"
//               >
//                 Đăng nhập / Đăng ký
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// Header.propTypes = {
//   isAuthenticated: PropTypes.bool.isRequired,
//   userFullName: PropTypes.string,
//   onLoginClick: PropTypes.func.isRequired,
//   onRegisterClick: PropTypes.func.isRequired,
//   onLogoutClick: PropTypes.func.isRequired,
// };

// export default Header;
