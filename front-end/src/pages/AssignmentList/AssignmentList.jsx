import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  AssignmentCard,
  AssignmentStepperModal,
  UpdateScoreModal,
} from "../../components/AssignmentManagement";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { useAssignmentContext } from "../../context/AssignmentContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import { showSuccessToast } from "../../helpers/NotificationToast";

const AssignmentList = () => {
  const {
    assignments,
    unassignedInterns,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    createNewAssignment,
    removeAssignment,
    updateAssignmentScore,
  } = useAssignmentContext();

  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState(null);

  const handleOpenCreateAssignment = () => {
    if (unassignedInterns.length === 0) {
      showSuccessToast("All interns have been assigned!");
      return;
    }
    setSelectedIntern(null);
    setShowAssignmentModal(true);
  };

  const handleAssignmentForIntern = (intern) => {
    setSelectedIntern(intern);
    setShowAssignmentModal(true);
  };

  const handleAssignmentSubmit = async (assignmentData) => {
    await createNewAssignment(assignmentData);
    setShowAssignmentModal(false);
    setSelectedIntern(null);
  };

  const handleDeleteAssignment = (assignmentId) => {
    const assignment = assignments.find((a) => a.id === assignmentId);
    setCurrentAssignment(assignment);
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteAssignment = async (assignmentId) => {
    await removeAssignment(assignmentId);
    setShowDeleteModal(false);
    setCurrentAssignment(null);
  };

  const handleUpdateScore = (assignment) => {
    setCurrentAssignment(assignment);
    setShowScoreModal(true);
  };

  const handleScoreSubmit = async (scoreData) => {
    await updateAssignmentScore(scoreData);
    setShowScoreModal(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 shadow-sm rounded-r-lg">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-700">
          {assignments.length > 0
            ? `Danh sách phân công (${assignments.length})`
            : "Danh sách phân công"}
        </h2>
        <button
          onClick={handleOpenCreateAssignment}
          className="flex items-center px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
        >
          <Plus className="h-5 w-5 mr-1.5" />
          Thêm mới
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`${
            assignments.length > 0 ? "lg:col-span-2" : "lg:col-span-3"
          }`}
        >
          {assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onDelete={handleDeleteAssignment}
                  onUpdateScore={handleUpdateScore}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p className="text-gray-700 text-xl font-semibold mt-4">
                  Không có phân công
                </p>
                <p className="text-gray-500 mt-2 mb-6 px-4">
                  Hãy nhấn nút "Thêm mới" để thêm phân công
                </p>
              </div>
            </div>
          )}
        </div>

        {unassignedInterns.length > 0 && assignments.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">
                  Thực tập sinh chưa phân công
                </h3>
                <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                  {unassignedInterns.length}
                </span>
              </div>

              <div className="mb-3 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                <div className="space-y-2">
                  {unassignedInterns.length > 0 ? (
                    unassignedInterns.map((intern, index) => (
                      <div
                        key={intern.id}
                        className="p-3 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                        onClick={() => handleAssignmentForIntern(intern)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                            {index + 1}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="font-medium">{intern.name}</p>
                            <p className="text-sm text-gray-600">
                              {intern.email}
                            </p>
                          </div>
                          <div className="text-blue-500 hover:text-blue-700">
                            <Plus className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : searchTerm ? (
                    <div className="text-center py-4 text-gray-500">
                      Không tìm thấy thực tập sinh phù hợp
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Tất cả thực tập sinh đã được phân công
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {assignments.length === 0 && unassignedInterns.length > 0 && (
        <div className="mt-8">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-700">
                Thực tập sinh chưa phân công
              </h3>
              <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                {unassignedInterns.length}
              </span>
            </div>

            <div className="mb-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {unassignedInterns.length > 0 ? (
                unassignedInterns.map((intern, index) => (
                  <div
                    key={intern.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 cursor-pointer transition-all duration-200 flex items-center"
                    onClick={() => handleAssignmentForIntern(intern)}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      {index + 1}
                    </div>
                    <div className="ml-3 flex-1 truncate">
                      <p className="font-medium">{intern.name}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {intern.email}
                      </p>
                    </div>
                    <div className="text-blue-500 hover:text-blue-700">
                      <Plus className="h-5 w-5" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-4 text-gray-500">
                  Không tìm thấy thực tập sinh phù hợp
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AssignmentStepperModal
        isOpen={showAssignmentModal}
        onClose={() => {
          setShowAssignmentModal(false);
          setSelectedIntern(null);
        }}
        onSubmit={handleAssignmentSubmit}
        unassignedInterns={
          selectedIntern ? [selectedIntern] : unassignedInterns
        }
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={currentAssignment?.id}
        itemName={`${currentAssignment?.intern?.user?.name || ""} - ${
          currentAssignment?.mentor?.user?.name || ""
        }`}
        itemType="phân công"
        onConfirm={handleConfirmDeleteAssignment}
      />

      <UpdateScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        assignment={currentAssignment}
        onSubmit={handleScoreSubmit}
      />
    </div>
  );
};

export default AssignmentList;