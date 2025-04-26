import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
<<<<<<< HEAD
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { setLoading } from "../../redux/loadingSlice";
=======
import { useDispatch, useSelector } from "react-redux";
//import { setLoading } from "../../redux/loadingSlice";
import { login } from "../../api/userAPI";
import { setDataMain } from "../../redux/userSlice";
import {
  showErrorToast,
  showSuccessToast,
} from "../../helpers/NotificationToast";
import "react-toastify/dist/ReactToastify.css";
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
<<<<<<< HEAD

  const initInfor = {
    email: "",
    password: "",
=======
  const user = useSelector((state) => state.user);
  const initInfor = {
    email: "milo00@gmail.com",
    password: "M02231103@",
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd
  };

  const initMessage = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(initInfor);
  const [errors, setErrors] = useState(initMessage);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = "Email cannot be blank.";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "EInvalid email.";
        } else delete newErrors.email;
        break;

      case "password":
        if (!value) {
          newErrors.password = "Password cannot be blank.";
        } else if (value.length < 3) {
          newErrors.password = "Invalid password.";
        } else delete newErrors.password;
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    let isValid = true;

    if (!validateField("email", formData.email)) {
      isValid = false;
    }

    if (!validateField("password", formData.password)) {
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
<<<<<<< HEAD
      const res = await formData;

      if (res.status === 404) {
        setErrors({
          ...errors,
          [res.data]: res.message,
        });

        toast.error(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      if (res.status === 200) {
        //const userData = res.data;

        dispatch();
        // setDataMain({
        //   id: userData.id,
        //   token: userData.accessToken,
        //   name: userData.name,
        // })

        toast.success(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        localStorage.setItem();
        navigate("/");
        dispatch(setLoading(true));
        dispatch(setLoading(false));
=======
      const response = await login(formData);

      // Case 1: Login successfully
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        // ---------------------------------------------------- //
        // store refresh token
        document.cookie = `${process.env.REACT_APP_COOKIE_NAME}=${response.data?.data?.refreshToken}; SameSite=None; Secure`;

        // store access tokentoken
        dispatch(
          setDataMain({
            email: response.data.data.email,
            name: response.data.data.name,
            roles: response.data.data.roles,
            accessToken: response.data.data.accessToken,
          })
          // ---------------------------------------------------- //
        );

        showSuccessToast("Login successful!");

        console.log(response.data.data.roles);

        const redirectUrl = localStorage.getItem("redirectAfterLogin");

        // Check URL redirect
        if (
          redirectUrl &&
          typeof redirectUrl === "string" &&
          redirectUrl.startsWith("/")
        ) {
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectUrl);
        }

        // Default route based on user role
        // else if (
        //   response.data.data.roles &&
        //   response.data.data.roles.includes("admin")
        // ) {
        //   navigate("/admin-dashboard");
        // } 
        
        else {
          navigate("/");
        }
      }

      // Case 2: Login failed
      else {
        const errorMessage = response?.data?.message || "Login failed";
        showErrorToast(errorMessage);

        if (errorMessage.toLowerCase().includes("email")) {
          setErrors((prev) => ({ ...prev, email: errorMessage }));
        } else if (errorMessage.toLowerCase().includes("password")) {
          setErrors((prev) => ({ ...prev, password: errorMessage }));
        } else {
          setErrors({
            email: "Invalid credentials",
            password: "Invalid credentials",
          });
        }
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd
      }
    } catch (error) {
      // Case 3: Connection error or server error
      console.error("Login error:", error);

      if (error.response) {
        if (error.response.status === 401) {
          showErrorToast("Incorrect email or password");
        } else {
          showErrorToast("An error occurred during login. Please try again.");
        }
      } else if (error.request) {
        showErrorToast(
          "Cannot connect to server. Please check your connection."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      Object.keys(errors).length === 0 &&
      Object.values(formData).every((value) => Boolean(value))
    );
  };

<<<<<<< HEAD
=======
  useEffect(() => {
    // if (user.email) {
    //   console.log("User email updated, but redirect is disabled for testing");
    // }
  }, [user.email, navigate]);
>>>>>>> 60b50e783261d2ad655d5f95bdc012bab142f4cd
  return (
    //<div className="h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 p-4 flex items-center justify-center">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
        <div className="text-center space-y-3">
          <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Student Intern Login
          </div>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full pl-10 pr-3 py-2.5 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`appearance-none block w-full pl-10 pr-10 py-2.5 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 border-b border-blue-600 hover:border-blue-500"
              >
                Đăng ký
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${
              isFormValid()
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
