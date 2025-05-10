import React from "react";
import PropTypes from "prop-types";

const ErrorMessage = ({
  message,
  fullWidth = false,
  showIcon = true,
  className = "",
}) => {
  if (!message) return null;

  return (
    <div
      className={`${fullWidth ? "max-w-7xl mx-auto px-4" : ""} ${className}`}
    >
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          {showIcon && (
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          <div className={showIcon ? "ml-3" : ""}>
            <p className="text-sm text-red-700">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
  showIcon: PropTypes.bool,
  className: PropTypes.string,
};

export default ErrorMessage;
