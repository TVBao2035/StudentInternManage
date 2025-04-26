import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/userApi";
import {
  showErrorToast,
  showSuccessToast,
} from "../../helpers/NotificationToast";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const checkPasswordStrength = (password) => {
    if (!password) return { isValid: false, strength: 0 };

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    let strength = 0;
    if (password.length >= 3) strength += 1;
    if (isLongEnough) strength += 1;
    if (hasUppercase) strength += 1;
    if (hasLowercase) strength += 1;
    if (hasNumber) strength += 0.5;
    if (hasSpecial) strength += 0.5;

    const isValid = Math.floor(strength) >= 3 && hasSpecial;

    return { isValid, strength: Math.min(Math.floor(strength), 4) };
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "fullName":
        if (!value) {
          newErrors.fullName = "Full name is required.";
        } else if (value.length < 2) {
          newErrors.fullName = "Full name must be at least 2 characters.";
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value)) {
          newErrors.fullName =
            "Full name should only contain letters and spaces.";
        } else delete newErrors.fullName;
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email is required.";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Email is invalid.";
        } else delete newErrors.email;
        break;

      case "phone":
        const phoneNumberRegex = /^0\d{9}$/;
        if (!value) {
          newErrors.phone = "Phone number is required.";
        } else if (!phoneNumberRegex.test(value)) {
          newErrors.phone =
            "Phone number must start with 0 and be 10 digits long.";
        } else delete newErrors.phone;
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password is required.";
        } else {
          const { isValid } = checkPasswordStrength(value);
          if (!isValid) {
            newErrors.password =
              "Password must be at least 8 characters and include uppercase, lowercase, and numbers or special characters.";
          } else {
            delete newErrors.password;
          }
        }

        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match.";
        } else if (formData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password.";
        } else if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match.";
        } else delete newErrors.confirmPassword;
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      showErrorToast("Please wait before submitting again");
      return;
    }

    setLastSubmitTime(now);

    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    if (isValid) {
      try {
        setIsSubmitting(true);

        const userData = {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        };

        const response = await register(userData);
        // console.log("Registration response:", response);
        // console.log("Registration successful:", response.data);
        if (response?.status === 200 && response?.data?.isSuccess && response?.data?.data) {
          showSuccessToast("Registration successful!");
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          showErrorToast(response.data.message);

          if (response.data.message.includes("Email")) {
            setErrors((prev) => ({ ...prev, email: response.data.message }));
          } else if (response.data.message.includes("Phone")) {
            setErrors((prev) => ({ ...prev, phone: response.data.message }));
          } else {
            setErrors((prev) => ({
              ...prev,
              email: "Account has already been registered",
              phone: "Account has already been registered",
            }));
          }
        }
      } catch (error) {
        console.error("Registration failed:", error);

        if (error.response) {
          const errorMsg = error.response.data.message;
          showErrorToast(errorMsg || "Registration failed! Please try again!");

          if (errorMsg.includes("Email")) {
            setErrors((prev) => ({ ...prev, email: errorMsg }));
          } else if (errorMsg.includes("Phone")) {
            setErrors((prev) => ({ ...prev, phone: errorMsg }));
          }
        } else if (error.request) {
          showErrorToast("Server not responding!");
        } else {
          showErrorToast("Please try again later!");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { width: "0%", color: "bg-gray-200" };

    const { strength } = checkPasswordStrength(password);

    const strengthMap = {
      0: { width: "0%", color: "bg-gray-200" },
      1: { width: "25%", color: "bg-red-500" },
      2: { width: "50%", color: "bg-orange-500" },
      3: { width: "75%", color: "bg-yellow-500" },
      4: { width: "100%", color: "bg-green-500" },
    };

    return strengthMap[strength];
  };

  const isFormValid = () => {
    return (
      Object.keys(errors).length === 0 &&
      Object.values(formData).every((value) =>
        typeof value === "boolean" ? true : Boolean(value)
      )
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-2xl backdrop-blur-sm bg-opacity-90">
        <div>
          <h2 className="text-center text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Student Intern Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="flex items-center justify-center my-4">
          <div className="border-t-2 border-indigo-100 flex-grow"></div>
          <span className="px-4 text-gray-500 text-sm font-medium">
            or continue with
          </span>
          <div className="border-t-2 border-indigo-100 flex-grow"></div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <div className="relative group">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-indigo-200"
                placeholder="Full Name"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-indigo-200"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-indigo-200"
                placeholder="Phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="relative group">
              <div className="flex items-center">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-indigo-200"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.password}
                </p>
              )}
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    getPasswordStrength().color
                  } transition-all duration-300`}
                  style={{ width: getPasswordStrength().width }}
                ></div>
              </div>
            </div>

            <div className="relative group">
              <div className="flex items-center">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border-2 border-gray-200 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-indigo-200"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200 ease-in-out ${
                isFormValid() && !isSubmitting
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  : "bg-gray-300 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-[1.02]`}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
