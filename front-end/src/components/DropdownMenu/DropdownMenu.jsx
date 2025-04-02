import React from "react";
import PropTypes from "prop-types";

const DropdownMenu = ({ listItems = [], isMobile = false }) => {
  if (!listItems.length) return null;

  return (
    <div
      className={`${
        isMobile
          ? "border-t border-blue-400 pt-2"
          : "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 ring-1 ring-black ring-opacity-5 transform transition-all duration-200"
      }`}
    >
      {listItems.map((item, index) => (
        <button
          key={index}
          onClick={item.action || (() => {})}
          className={`${
            isMobile
              ? "flex items-center w-full px-3 py-2 text-base font-medium hover:bg-blue-600 transition-colors duration-200"
              : "flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-150"
          }`}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
};

DropdownMenu.propTypes = {
  listItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      action: PropTypes.func,
      icon: PropTypes.element,
    })
  ).isRequired,
  isMobile: PropTypes.bool,
};

export default DropdownMenu;
