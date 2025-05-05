export const formatDateToDisplay = (dateString) => {
  if (!dateString) return "";

  try {
    if (
      dateString.includes("-") &&
      (dateString.includes(":") || dateString.includes("T"))
    ) {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
      }
    }

    if (dateString.includes("/") && dateString.split("/").length === 3) {
      if (isValidDateFormat(dateString)) {
        return dateString;
      }
    }

    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`;
    }

    return dateString;
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

export const isValidDateFormat = (dateString) => {
  if (!dateString) return true;

  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateString)) return false;

  const [, day, month, year] = dateString.match(regex);

  const date = new Date(year, month - 1, day);
  return (
    date.getDate() === parseInt(day, 10) &&
    date.getMonth() + 1 === parseInt(month, 10) &&
    date.getFullYear() === parseInt(year, 10)
  );
};

export const formatDateForInput = (dateString) => {
  if (!dateString || !isValidDateFormat(dateString)) return "";

  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

export const formatDateFromInput = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

export const createDateChangeHandler = (setter, fieldName = null) => {
  return (e) => {
    const { name, value } = e.target;

    if (value) {
      const formattedDate = formatDateFromInput(value);

      if (fieldName) {
        setter((prev) => ({
          ...prev,
          [fieldName]: formattedDate,
        }));
      } else {
        setter(formattedDate);
      }
    } else {
      if (fieldName) {
        setter((prev) => ({
          ...prev,
          [fieldName]: "",
        }));
      } else {
        setter("");
      }
    }
  };
};
