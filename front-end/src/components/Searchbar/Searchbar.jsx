import React from "react";
import { Search } from "lucide-react";
import PropTypes from "prop-types";

const Searchbar = ({ value, onChange, onSubmit, placeholder }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto p-4 backdrop-blur-sm"
    >
      <div className="relative group bg-white/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-4 pl-6 pr-12 text-gray-700 bg-white/70 backdrop-blur-md border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 ease-in-out placeholder-gray-400 hover:border-blue-200 shadow-inner"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-all duration-300 ease-in-out p-2.5 hover:bg-blue-50/80 rounded-full backdrop-blur-sm hover:shadow-md active:scale-95"
        >
          <Search size={24} />
        </button>
      </div>
    </form>
  );
};

Searchbar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  placeholder: PropTypes.string,
};

Searchbar.defaultProps = {
  placeholder: "Tìm kiếm công việc...",
};

export default Searchbar;
