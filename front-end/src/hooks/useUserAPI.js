import { useState } from "react";
import { getDetailUserById, updateUser } from "../api/userApi";
import { showSuccessToast, showErrorToast } from "../helpers/NotificationToast";

export const useUserAPI = () => {
  const [userDetail, setUserDetail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchUserByID = async (userId) => {
    if (!userId) {
      setError("ID does not exist!");
      return null;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getDetailUserById(userId);

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        const userData = response.data.data;
        setUserDetail(userData);
        return userData;
      } else {
        const errorMsg =
          response?.data?.message || "Unable to load user information!";
        setError(errorMsg);
        showErrorToast(errorMsg);
        return null;
      }
    } catch (error) {
      console.error("Error getting user information:", error);
      const errorMsg = "Connection error while loading user information!";
      setError(errorMsg);
      showErrorToast(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (userData) => {
    setUpdating(true);
    setError(null);

    try {
      const response = await updateUser(userData);

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        showSuccessToast("Update information successfully!");

        if (userData.id === userDetail?.id) {
          setUserDetail({
            ...userDetail,
            ...userData,
          });
        }

        setUpdating(false);
        return true;
      } else {
        const errorMsg =
          response?.data?.message || "Error updating information!";
        setError(errorMsg);
        showErrorToast(errorMsg);
        setUpdating(false);
        return false;
      }
    } catch (error) {
      console.error("Error updating user information:", error);
      const errorMsg = "Connection error updating information!";
      setError(errorMsg);
      showErrorToast(errorMsg);
      setUpdating(false);
      return false;
    }
  };

  return {
    userDetail,
    loading,
    updating,
    error,
    fetchUserByID,
    updateUserInfo,
  };
};
