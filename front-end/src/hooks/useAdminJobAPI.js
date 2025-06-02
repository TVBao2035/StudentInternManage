import { useState, useEffect } from "react";
import { getAllJobApplications } from "../api/jobAPI";
import { showErrorToast } from "../helpers/NotificationToast";
import { useSelector } from "react-redux";

export const useAdminJobAPI = () => {
    const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const user = useSelector((state) => state.user);
    const isAuthenticated = !!user.email;

    const fetchJobApplications = async () => {
        if (!isAuthenticated) {
            setError("Please login first");
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await getAllJobApplications();

            if (response?.status === 200 && response?.data?.isSuccess) {
                const applications = response.data.data || [];
                setJobApplications(applications);
                return applications;
            } else {
                const errorMsg = response?.data?.message || "Error loading all applications!";
                setError(errorMsg);
                showErrorToast(errorMsg);
                return null;
            }
        } catch (error) {
            console.error("Error fetching all applications:", error); 
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchJobApplications();
        }
    }, [isAuthenticated]);

    return {
        jobApplications,
        loading,
        error,
        fetchJobApplications
    };

};