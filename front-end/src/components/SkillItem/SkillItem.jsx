import React from "react";
import PropTypes from "prop-types";

const SkillItem = ({ title, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm ${
        isSelected
          ? "bg-green-500 text-white shadow-green-200 hover:shadow-md hover:bg-green-600"
          : "bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:text-green-600 hover:shadow-md hover:bg-gray-50"
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