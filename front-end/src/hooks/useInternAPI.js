import { useState, useEffect } from "react";
import { getAllEmployee, deleteEmployee } from "../api/internAPI";
import { showSuccessToast, showErrorToast } from "../helpers/NotificationToast";

export const useInternAPI = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const response = await getAllEmployee();
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        const internData = response.data.data
          .filter((employee) => employee.type === 0)
          .map((intern) => ({
            id: intern.id,
            name: intern.user.name,
            email: intern.user.email,
            user: intern.user,
          }));

        //console.log("Intern data:", internData);
        setInterns(internData);
        setError(null);
      } else {
        setError(response?.data?.message || "Error loading intern list!");
      }
    } catch (err) {
      console.error("Error fetching interns:", err);
      setError("Connection error!");
    } finally {
      setLoading(false);
    }
  };

  const createIntern = async (createdInterns) => {
    if (Array.isArray(createdInterns) && createdInterns.length > 0) {
      await fetchInterns();
      showSuccessToast("Create intern successfully!");
      return true;
    }

    return false;
  };

  const updateIntern = async (updatedIntern) => {
    try {
      setInterns(
        interns.map((intern) =>
          intern.id === updatedIntern.id ? updatedIntern : intern
        )
      );
      return true;
    } catch (err) {
      console.log("Error updating intern:", err);
      await fetchInterns();
      return false;
    }
  };

  const deleteIntern = async (internId) => {
    try {
      const response = await deleteEmployee(internId);

      if (response?.status === 200 && response?.data?.isSuccess) {
        const updatedInterns = interns.filter(
          (intern) => intern.id !== internId
        );
        setInterns(updatedInterns);
        showSuccessToast("Delete intern successfully!");
        return true;
      } else {
        showErrorToast("Delete intern failed!");
        await fetchInterns();
        return false;
      }
    } catch (err) {
      console.error("Error deleting intern:", err);
      showErrorToast("Connection error!");
      await fetchInterns();
      return false;
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  return {
    interns,
    loading,
    error,
    createIntern,
    updateIntern,
    deleteIntern,
    refreshData: fetchInterns,
  };
};
