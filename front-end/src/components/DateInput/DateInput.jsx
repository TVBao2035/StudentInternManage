import React, { useState, useEffect } from "react";
import { Calendar, AlertCircle } from "lucide-react";
import {
  formatDateToDisplay,
  isValidDateFormat,
} from "../../helpers/dateUtils";

const DateInput = ({
  value,
  onChange,
  name,
  label,
  id,
  required = false,
  className = "",
  disabled = false,
  labelClassName = "w-28",
  ...restProps
}) => {
  const [localValue, setLocalValue] = useState("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLocalValue(formatDateToDisplay(value || ""));
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    if (newValue && !isValidDateFormat(newValue)) {
      setHasError(true);
    } else {
      setHasError(false);
      onChange({
        target: {
          name,
          value: newValue,
        },
      });
    }
  };

  const handleBlur = () => {
    if (localValue && !isValidDateFormat(localValue)) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  };

  return (
    <div className={`flex items-start ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className={`block text-sm font-medium text-gray-700 mt-2 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            id={id || name}
            name={name}
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="DD/MM/YYYY"
            disabled={disabled}
            className={`w-full pl-10 pr-4 py-2 text-gray-700 ${
              disabled ? "bg-gray-100" : "bg-white"
            } border ${
              hasError ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:outline-none focus:ring-2 ${
              hasError
                ? "focus:ring-red-500 focus:border-red-500"
                : "focus:ring-blue-500 focus:border-blue-500"
            }`}
            {...restProps}
          />
          <Calendar
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              hasError ? "text-red-400" : "text-gray-400"
            }`}
            size={18}
          />
        </div>

        {hasError && (
          <div className="mt-1 text-red-500 text-sm flex items-center">
            <AlertCircle size={14} className="mr-1" />
            Định dạng ngày phải là DD/MM/YYYY
          </div>
        )}

        <div className="mt-1 text-gray-500 text-xs">
          Định dạng: Ngày/Tháng/Năm (VD: 30/04/2000)
        </div>
      </div>
    </div>
  );
};

export default DateInput;
