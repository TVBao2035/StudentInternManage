import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getTaskByIntern } from "../api/taskAPI";
import { formatDate } from "../helpers/formatCreatedAt";

export const useInternTask = (assignmentId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = useSelector((state) => state.user);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      if (!userInfo || !userInfo.email) {
        setError("You are not logged in!");
        setLoading(false);
        return;
      }

      const response = await getTaskByIntern();

      if (
        response?.status === 200 &&
        response?.data?.isSuccess
      ) {
        const mappedTasks = response.data.data.map((task) => ({
          id: task.id,
          title: task.name,
          notice: task.note,
          status: mapTaskStatus(task.status),
          assignmentId: task.assignmentId,
          date: formatDate(task.createdAt),
        }));

        setTasks(mappedTasks);
        setError(null);
      } else {
        setError(response?.data?.message || "Unable to load task list!");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Connect error!");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchTasks();
  }, [userInfo.email]);

  return { tasks, loading, error, refreshTasks: fetchTasks, userInfo };
};
