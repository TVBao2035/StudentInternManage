import React from "react";
import PropTypes from "prop-types";

const SkillItem = ({ title, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm ${
        isSelected
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200 hover:shadow-md hover:from-blue-600 hover:to-blue-700"
          : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md hover:bg-gray-50"
      }`}
    >
      {title}
    </button>
  );
};

SkillItem.propTypes = {
  title: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

SkillItem.defaultProps = {
  isSelected: false,
};

export default SkillItem;
