import React, { useState } from "react";
import { FiMenu, FiX, FiHome, FiBriefcase, FiSearch } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import UserDropdownMenu from "../UserDropdownMenu/UserDropdownMenu";
import MobileMenu from "../MobileMenu/MobileMenu";

const Header = ({
  isAuthenticated,
  userFullName,
  userRoles,
  onLoginClick,
  onLogoutClick,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      action: () => navigate("/"),
      type: "button",
      id: "home",
      icon: <FiHome size={18} />,
    },
    {
      title: "Tìm việc",
      action: () => navigate("/find-job"),
      type: "button",
      id: "jobs",
      icon: <FiSearch size={18} />,
    },
    {
      title: "Công việc ứng tuyển",
      action: () => navigate("/applyingjobs"),
      type: "button",
      id: "applications",
      icon: <FiBriefcase size={18} />,
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
                  <button
                    key={item.id}
                    onClick={item.action}
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
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <UserDropdownMenu
                userFullName={userFullName}
                userRoles={userRoles || []}
                onLogoutClick={onLogoutClick}
              />
            ) : (
              <button
                onClick={onLoginClick}
                className="px-6 py-2 font-medium text-white bg-blue-600/30 hover:bg-blue-600/70 rounded-full transition-all duration-300 hover:shadow-md"
              >
                Đăng nhập
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full bg-blue-600/40 hover:bg-blue-600/70 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        <MobileMenu
          isOpen={isMenuOpen}
          navItems={navItems}
          activeItem={getActiveNavItem()}
          isAuthenticated={isAuthenticated}
          userRoles={userRoles || []}
          onLoginClick={onLoginClick}
          onLogoutClick={onLogoutClick}
          onItemClick={() => setIsMenuOpen(false)}
        />
      </div>
    </header>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  userFullName: PropTypes.string,
  userRoles: PropTypes.array,
  onLoginClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

export default Header;
