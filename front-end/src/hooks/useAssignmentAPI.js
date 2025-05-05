import { useState, useEffect, useMemo } from "react";
import {
  getAllAssignment,
  createAssignment,
  deleteAssignment,
  updateScore,
} from "../api/assignmentAPI";
import { getAllEmployee } from "../api/internAPI";
import { showSuccessToast, showErrorToast } from "../helpers/NotificationToast";

export const useAssignmentAPI = () => {
  const [assignments, setAssignments] = useState([]);
  const [allInterns, setAllInterns] = useState([]);
  const [unassignedInterns, setUnassignedInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await getAllAssignment();
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        setAssignments(response.data.data);
        setError(null);
      } else {
        setError(response?.data?.message || "Error loading assignments!");
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError("Connection error!");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllInterns = async () => {
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

        setAllInterns(internData);

        updateUnassignedInterns(internData, assignments);
      }
    } catch (err) {
      console.error("Error fetching interns:", err);
    }
  };

  const updateUnassignedInterns = (interns, currentAssignments) => {
    const assignedInternIds = currentAssignments.map((assignment) =>
      String(assignment.internId)
    );

    const unassigned = interns.filter(
      (intern) => !assignedInternIds.includes(String(intern.id))
    );

    setUnassignedInterns(unassigned);
  };

  const createNewAssignment = async (assignmentData) => {
    try {
      const data = {
        internId: assignmentData.internId,
        mentorId: assignmentData.mentorId,
      };

      const response = await createAssignment(data);

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        showSuccessToast("Assignment created successfully!");
        await fetchAssignments();
        return true;
      } else {
        showErrorToast(response?.data?.message || "Error creating assignment!");
        return false;
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      showErrorToast("Connection error!");
      return false;
    }
  };

  const removeAssignment = async (assignmentId) => {
    try {
      const response = await deleteAssignment(assignmentId);

      if (response?.status === 200 && response?.data?.isSuccess) {
        const updatedAssignments = assignments.filter(
          (a) => a.id !== assignmentId
        );
        setAssignments(updatedAssignments);
        updateUnassignedInterns(allInterns, updatedAssignments);
        showSuccessToast("Assignment deleted successfully!");
        return true;
      } else {
        showErrorToast(response?.data?.message || "Error deleting assignment!");
        await fetchAssignments();
        return false;
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      showErrorToast("Connection error!");
      return false;
    }
  };

  const updateAssignmentScore = async (scoreData) => {
    try {
      const assignment = assignments.find((a) => a.id === scoreData.id);
      if (!assignment) return false;

      const fullData = {
        id: assignment.id,
        internId: assignment.internId,
        mentorId: assignment.mentorId,
        score: scoreData.score,
      };

      const response = await updateScore(fullData);

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        setAssignments((prevAssignments) =>
          prevAssignments.map((a) =>
            a.id === scoreData.id ? { ...a, score: scoreData.score } : a
          )
        );
        showSuccessToast("Score updated successfully!");
        return true;
      } else {
        showErrorToast(response?.data?.message || "Error updating score!");
        return false;
      }
    } catch (error) {
      console.error("Error updating score:", error);
      showErrorToast("Connection error!");
      return false;
    }
  };

  const filteredInterns = useMemo(() => {
    return searchTerm
      ? unassignedInterns.filter(
          (intern) =>
            intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            intern.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : unassignedInterns;
  }, [unassignedInterns, searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAssignments();
      await fetchAllInterns();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (allInterns.length > 0) {
      updateUnassignedInterns(allInterns, assignments);
    }
  }, [assignments, allInterns]);

  return {
    assignments,
    unassignedInterns: filteredInterns,
    allInterns,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    createNewAssignment,
    removeAssignment,
    updateAssignmentScore,
    refreshData: async () => {
      await fetchAssignments();
      await fetchAllInterns();
    },
  };
};
