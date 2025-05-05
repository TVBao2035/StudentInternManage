import { useState, useEffect } from "react";
import {
  getAllJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from "../api/jobAPI";
import { showSuccessToast, showErrorToast } from "../helpers/NotificationToast";
import { useSelector } from "react-redux";

export const useJobAPI = (postId = null) => {
  const [jobApplications, setJobApplications] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.email;

  const fetchJobApplications = async () => {
    if (!isAuthenticated) return null;

    setLoading(true);
    setError(null);
    try {
      const response = await getAllJobApplications();
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        const applications = response.data.data || [];
        setJobApplications(applications);

        if (postId) {
          const application = applications.find((job) => job.postId === postId);
          if (application) {
            setApplicationStatus(application.status);
            setApplicationId(application.id);
          } else {
            setApplicationStatus(null);
            setApplicationId(null);
          }
        }

        return applications;
      } else {
        const errorMsg = "Error loading application list!";
        setError(errorMsg);
        showErrorToast(errorMsg);
        return null;
      }
    } catch (error) {
      console.error("Error when getting application list:", error);
      setError("Connect error!");
      showErrorToast("Connect error!");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async () => {
    if (!isAuthenticated || !postId) {
      showErrorToast("You need to login to apply!");
      return { success: false, error: "Unauthorized" };
    }

    setIsSubmitting(true);
    try {
      const response = await createJobApplication(postId);
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        showSuccessToast("Application successful!");
        setApplicationStatus(0);
        setApplicationId(response.data.data.id);
        await fetchJobApplications();
        return { success: true, data: response.data.data };
      } else {
        const errorMsg = response?.data?.message || "Error when applying!";
        showErrorToast(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("Error while applying for job:", error);
      showErrorToast("Connect error!");
      return { success: false, error: "Connect error" };
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelApplication = async () => {
    if (!isAuthenticated || !applicationId) {
      return { success: false, error: "No application or permission required" };
    }

    setIsSubmitting(true);
    try {
      const response = await deleteJobApplication(applicationId);
      if (response?.status === 200 && response?.data?.isSuccess) {
        showSuccessToast("Application successfully cancelled!");
        setApplicationStatus(null);
        setApplicationId(null);

        setJobApplications((prevApplications) =>
          prevApplications.filter((app) => app.id !== applicationId)
        );

        return { success: true };
      } else {
        const errorMsg =
          response?.data?.message || "Error canceling application!";
        showErrorToast(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("Error canceling application:", error);
      showErrorToast("Connection error!");
      return { success: false, error: "Connect error" };
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobApplications();
    }
  }, [isAuthenticated, postId]);

  return {
    jobApplications,
    applicationStatus,
    applicationId,
    loading,
    error,
    isSubmitting,
    isAuthenticated,
    fetchJobApplications,
    applyForJob,
    cancelApplication,
  };
};
