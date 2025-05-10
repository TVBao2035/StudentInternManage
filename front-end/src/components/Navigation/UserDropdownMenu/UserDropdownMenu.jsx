import React, { useState, useRef, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useRoleBasedMenus } from "../../../hooks/useRoleBasedMenus";

const UserDropdownMenu = ({ userFullName, userRoles = [], onLogoutClick }) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { getAllMenuItems } = useRoleBasedMenus(navigate, onLogoutClick);

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

  if (!getAllMenuItems) {
    console.error("useRoleBasedMenus hook not available");
    return null;
  }

  const allMenuItems = getAllMenuItems(userRoles);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center">
        <span className="mr-3 text-white font-medium">{userFullName}</span>
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
          {allMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.action();
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-6 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 hover:text-blue-700 flex items-center"
            >
              {item.icon && (
                <span className="mr-3 text-blue-600">{item.icon}</span>
              )}
              {item.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

UserDropdownMenu.propTypes = {
  userFullName: PropTypes.string.isRequired,
  userRoles: PropTypes.arrayOf(PropTypes.string),
  onLogoutClick: PropTypes.func.isRequired,
};

export default UserDropdownMenu;
