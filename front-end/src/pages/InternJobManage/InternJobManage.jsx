import React, { useState } from "react";
import { Pencil, Trash2, ChevronDown, CornerUpLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CreateInternJobModal,
  UpdateInternJobModal,
} from "../../components/InternJobModalManager";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { useTaskAPI } from "../../hooks/useTaskAPI";
import LoadingSpinner from "../../components/LoadingSpinner";

const InternJobManage = () => {
  const { internId } = useParams();
  const navigate = useNavigate();
  const {
    loading,
    error,
    intern,
    assignment,
    tasks,
    createNewTask,
    updateExistingTask,
    updateTaskStatusChange,
    removeTask,
  } = useTaskAPI(internId);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "bg-green-100 text-green-800 ring-1 ring-green-300";
      case "Đã giao":
        return "bg-blue-100 text-blue-800 ring-1 ring-blue-300";
      case "Chưa hoàn thành":
        return "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 ring-1 ring-gray-300";
    }
  };

  const handleOpenCreateModal = () => {
    if (!assignment) {
      return;
    }
    setShowCreateModal(true);
  };

  const handleCreateTask = async (formData) => {
    const success = await createNewTask(formData);
    if (success) {
      setShowCreateModal(false);
    }
  };

  const handleOpenUpdateModal = (taskId) => {
    const taskToEdit = tasks.find((t) => t.id === taskId);
    if (taskToEdit) {
      setCurrentTask(taskToEdit);
      setShowUpdateModal(true);
    }
  };

  const handleUpdateTask = async (formData) => {
    const success = await updateExistingTask(formData);
    if (success) {
      setShowUpdateModal(false);
    }
  };

  const handleOpenDeleteModal = (taskId) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setCurrentTask(taskToDelete);
    setShowDeleteModal(true);
  };

  const handleConfrimDeleteTask = async (taskId) => {
    try {
      await removeTask(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setShowDeleteModal(false);
      setCurrentTask(null);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl font-semibold mb-4 bg-red-50 px-6 py-3 rounded-lg shadow-sm">
          {error}
        </div>
        <button
          onClick={handleBack}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">{intern.name}</h2>
        <p className="text-gray-600 text-sm mt-1">{intern.email}</p>
        {assignment && assignment.mentor && (
          <p className="text-blue-600 text-sm mt-2">
            Mentor: {assignment.mentor.user?.name || "Chưa xác định"}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mt-6 mb-8">
        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <CornerUpLeft size={22} />
        </button>

        <button
          onClick={handleOpenCreateModal}
          className={`px-6 py-2.5 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 ${
            !assignment
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={!assignment}
        >
          <span>Thêm mới</span>
        </button>
      </div>

      {!assignment ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-gray-700 text-xl font-semibold">
            Thực tập sinh chưa được phân công mentor
          </p>
          <p className="text-gray-500 mt-2 mb-6">
            Vui lòng phân công mentor trước khi tạo công việc
          </p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((t, index) => (
            <div
              key={t.id}
              className="border border-gray-200 rounded-xl py-4 px-6 hover:shadow-md transition-all duration-200 bg-white"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-medium text-sm">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-medium text-gray-900 ml-3">
                      {t.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 ml-11">
                    <span className="font-medium text-gray-700">Notice: </span>
                    <span className="italic">{t.notice}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="relative">
                    <select
                      className={`appearance-none pl-4 pr-10 py-2 rounded-lg text-sm font-medium ${getStatusClass(
                        t.status
                      )} border-0 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer w-44 transition-all duration-200`}
                      value={t.status}
                      onChange={(e) =>
                        updateTaskStatusChange(t.id, e.target.value)
                      }
                    >
                      <option
                        value="Hoàn thành"
                        className="bg-white text-gray-800"
                      >
                        Hoàn thành
                      </option>
                      <option
                        value="Đã giao"
                        className="bg-white text-gray-800"
                      >
                        Đã giao
                      </option>
                      <option
                        value="Chưa hoàn thành"
                        className="bg-white text-gray-800"
                      >
                        Chưa hoàn thành
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleOpenUpdateModal(t.id)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-all duration-200"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(t.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-gray-500 text-lg">Chưa có công việc nào</p>
          <p className="text-gray-400 mt-2 mb-6">
            Hãy thêm công việc mới cho thực tập sinh này
          </p>
        </div>
      )}

      <CreateInternJobModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        assignmentId={assignment?.id}
      />

      <UpdateInternJobModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={handleUpdateTask}
        job={currentTask}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={currentTask?.id}
        itemName={currentTask?.title}
        itemType="công việc"
        onConfirm={handleConfrimDeleteTask}
      />
    </div>
  );
};

export default InternJobManage;
