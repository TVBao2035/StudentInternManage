import { useState, useEffect } from "react";
import { getAllAssignment } from "../api/assignmentAPI";
import { getAllEmployee } from "../api/internAPI";
import {
  getTaskByAssignment,
  createTask,
  updateTask,
  updateStatusTask,
  deleteTask,
} from "../api/taskAPI";
import { showSuccessToast, showErrorToast } from "../helpers/NotificationToast";

export const useTaskAPI = (internId) => {
  const [loading, setLoading] = useState(true);
  const [intern, setIntern] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const internResponse = await getAllEmployee();
      if (
        internResponse?.status === 200 &&
        internResponse?.data?.isSuccess &&
        internResponse?.data?.data
      ) {
        const internData = internResponse.data.data
          .filter((employee) => employee.type === 0 && employee.id === internId)
          .map((intern) => ({
            id: intern.id,
            name: intern.user.name,
            email: intern.user.email,
            user: intern.user,
          }))[0];

        if (internData) {
          setIntern(internData);
        } else {
          showErrorToast("No intern information found!");
        }
      } else {
        showErrorToast(
          internResponse?.data?.message || "Unable to load trainee information!"
        );
      }

      const assignmentResponse = await getAllAssignment();
      if (
        assignmentResponse?.status === 200 &&
        assignmentResponse?.data?.isSuccess &&
        assignmentResponse?.data?.data
      ) {
        const assignmentData = assignmentResponse.data.data.find(
          (assignment) => assignment.internId === internId
        );

        if (assignmentData) {
          setAssignment(assignmentData);

          const tasksResponse = await getTaskByAssignment(assignmentData.id);
          if (
            tasksResponse?.status === 200 &&
            tasksResponse?.data?.isSuccess &&
            tasksResponse?.data?.data
          ) {
            const mappedTasks = tasksResponse.data.data.map((task) => ({
              id: task.id,
              title: task.name,
              notice: task.note,
              status: mapTaskStatus(task.status),
              assignmentId: task.assignmentId,
            }));

            setTasks(mappedTasks);
          } else {
            console.log("Unable to load tasks:", tasksResponse?.data?.message);
          }
        } else {
          console.log("Intern not assigned yet!");
        }
      } else {
        showErrorToast(
          assignmentResponse?.data?.message ||
            "Unable to load assignment information!"
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message || "Connect error!");
    } finally {
      setLoading(false);
    }
  };

  // backend => frontend
  const mapTaskStatus = (status) => {
    switch (status) {
      case 1:
        return "Hoàn thành";
      case 0:
        return "Đã giao";
      default:
        return "Chưa hoàn thành";
    }
  };

  // frontend => backend
  const mapStatusToBackend = (status) => {
    switch (status) {
      case "Hoàn thành":
        return 1;
      case "Đã giao":
      case "Chưa hoàn thành":
      default:
        return 0;
    }
  };

  const createNewTask = async (formData) => {
    try {
      const taskData = {
        name: formData.title,
        note: formData.notice,
        assignmentId: assignment.id,
      };

      const response = await createTask(taskData);

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        const createdTask = response.data.data;

        const newTask = {
          id: createdTask.id,
          title: createdTask.name,
          notice: createdTask.note,
          status: "Đã giao",
          assignmentId: createdTask.assignmentId,
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);
        showSuccessToast("Create new task successfully!");
        return true;
      } else {
        showErrorToast(response?.data?.message || "Create failed task!");
        return false;
      }
    } catch (error) {
      console.log("Error creating job:", error);
      showErrorToast("Connect error!");
      return false;
    }
  };

  const updateExistingTask = async (formData) => {
    try {
      const taskData = {
        id: formData.id,
        name: formData.title,
        note: formData.notice,
        assignmentId: formData.assignmentId,
      };

      const response = await updateTask(taskData);
      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === formData.id
              ? { ...t, title: formData.title, notice: formData.notice }
              : t
          )
        );

        showSuccessToast("Task update successful!");
        return true;
      } else {
        showErrorToast(response?.data?.message || "Task update failed!");
        return false;
      }
    } catch (error) {
      console.error("Error updating task:", error);
      showErrorToast("Connect error!");
      return false;
    }
  };

  const updateTaskStatusChange = async (taskId, newStatus) => {
    try {
      const t = tasks.find((tk) => tk.id === taskId);
      if (!t) return false;

      const backendStatus = mapStatusToBackend(newStatus);

      const taskData = {
        id: taskId,
        name: t.title,
        note: t.notice,
        assignmentId: t.assignmentId,
        status: backendStatus,
      };

      const response = await updateStatusTask(taskData);

      if (
        response?.status === 200 &&
        response?.data?.isSuccess &&
        response?.data?.data
      ) {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
          )
        );
        showSuccessToast("Status update successful!");
        return true;
      } else {
        showErrorToast(response?.data?.message || "Update status failed!");
        return false;
      }
    } catch (error) {
      console.log("Error updatting status:", error);
      showErrorToast("Connect error!");
      return false;
    }
  };

  const removeTask = async (taskId) => {
    try {
      const response = await deleteTask(taskId);

      if (
        response?.status === 200 &&
        response?.data?.isSuccess
      ) {
        const newTasks = tasks.filter(t => t.id !== taskId);
        setTasks([...newTasks]);
        showSuccessToast("Task deleted successfully!");
        return true;
      } else {
        showErrorToast(response?.data?.message || "Task deleted failed!");
        return false;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showErrorToast("Connect error!");
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, [internId]);

  return {
    loading,
    error,
    intern,
    assignment,
    tasks,
    createNewTask,
    updateExistingTask,
    updateTaskStatusChange,
    removeTask,
    refreshData: fetchData,
    mapTaskStatus,
    mapStatusToBackend,
  };
};
