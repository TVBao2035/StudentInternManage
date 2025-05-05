export const formatDate = (dateString, options = {}) => {
  if (!dateString) return "N/A";

  const defaultOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  };
  try {
    if (
      typeof dateString === "string" &&
      dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)
    ) {
      return dateString;
    }

    if (typeof dateString === "string" && dateString.includes("/Date(")) {
      const match = dateString.match(/\/Date\((\d+)\)\//);
      if (match && match[1]) {
        const timestamp = parseInt(match[1]);
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("vi-VN", defaultOptions);
        }
      }
      return "N/A";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.warn("Invalid date format:", dateString);
      return "N/A";
    }

    if (date.getFullYear() <= 1) {
      return "N/A";
    }

    return date.toLocaleDateString("vi-VN", defaultOptions);
  } catch (error) {
    console.error("Error formatting date:", error, dateString);
    return "N/A";
  }
};

export const isValidDate = (value) => {
  if (!value) return false;

  try {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.getFullYear() > 1;
  } catch (error) {
    return false;
  }
};

export const getCurrentDate = (options = {}) => {
  const today = new Date();
  return formatDate(today, options);
};

export const getDateDifference = (dateA, dateB = new Date(), unit = "days") => {
  const firstDate = new Date(dateA);
  const secondDate = new Date(dateB);

  if (isNaN(firstDate.getTime()) || isNaN(secondDate.getTime())) {
    return null;
  }

  const diffTime = Math.abs(secondDate - firstDate);

  switch (unit.toLowerCase()) {
    case "days":
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    case "months":
      return (
        (secondDate.getFullYear() - firstDate.getFullYear()) * 12 +
        (secondDate.getMonth() - firstDate.getMonth())
      );
    case "years":
      return secondDate.getFullYear() - firstDate.getFullYear();
    default:
      return diffTime;
  }
};
