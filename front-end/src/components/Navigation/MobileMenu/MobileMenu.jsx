import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import { useRoleBasedMenus } from "../../../hooks/useRoleBasedMenus";

const MobileMenu = ({
  isOpen,
  navItems,
  activeItem,
  isAuthenticated,
  userRoles,
  onLoginClick,
  onLogoutClick,
  onItemClick,
}) => {
  const navigate = useNavigate();
  const { commonMenuItems, getRoleBasedMenuItems, logoutMenuItem } =
    useRoleBasedMenus(navigate, onLogoutClick);

  if (!isOpen) return null;

  return (
    <div className="md:hidden py-2 space-y-1 animate-slide-down absolute left-0 right-0 bg-gradient-to-r from-blue-700/95 to-blue-500/95 max-h-[80vh] overflow-y-auto z-40 shadow-lg">
      <Navbar items={navItems} isMobile={true} active={activeItem} />

      {isAuthenticated ? (
        <div className="border-t border-blue-400/50 pt-2">
          {commonMenuItems.map((item, index) => (
            <button
              key={`common-${index}`}
              onClick={() => {
                item.action();
                onItemClick();
              }}
              className="w-full text-left px-3 py-2.5 text-base font-medium hover:bg-blue-600/40 transition-all duration-200 rounded-md my-0.5"
            >
              {item.title}
            </button>
          ))}

          {getRoleBasedMenuItems(userRoles).map((item, index) => (
            <button
              key={`role-${index}`}
              onClick={() => {
                item.action();
                onItemClick();
              }}
              className="w-full text-left px-3 py-2.5 text-base font-medium hover:bg-blue-600/40 transition-all duration-200 rounded-md my-0.5"
            >
              {item.title}
            </button>
          ))}

          <button
            onClick={() => {
              logoutMenuItem.action();
              onItemClick();
            }}
            className="w-full text-left px-3 py-2.5 text-base font-medium hover:bg-blue-600/40 transition-all duration-200 rounded-md my-0.5"
          >
            {logoutMenuItem.title}
          </button>
        </div>
      ) : (
        <button
          onClick={onLoginClick}
          className="block w-full text-left px-3 py-2.5 text-base font-medium hover:bg-blue-600/40 transition-all duration-200 rounded-md my-0.5"
        >
          Đăng nhập
        </button>
      )}
    </div>
  );
};

MobileMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  navItems: PropTypes.array.isRequired,
  activeItem: PropTypes.string,
  isAuthenticated: PropTypes.bool.isRequired,
  userRoles: PropTypes.array,
  onLoginClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default MobileMenu;
