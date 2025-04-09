import React, { useState, useEffect } from "react";
import { Pencil, Trash2, FileText, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CreateInternshipModal from "../../components/InternshipModalManager/CreateInternshipModal";
import UpdateInternshipModal from "../../components/InternshipModalManager/UpdateInternshipModal/UpdateInternshipModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import AssigmentLeaderModal from "../../components/AssigmentLeaderModal";

const InternManagement = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("interns");
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentIntern, setCurrentIntern] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [showAssigmentModal, setShowAssigmentModal] = useState(false);
  const [internToAssign, setInternToAssign] = useState(null);

  useEffect(() => {
    const fetchInterns = async () => {
      setLoading(true);
      try {
        const mockInterns = [
          {
            id: 1,
            name: "Nguyen Van B",
            email: "nguyenvanb@gmail.com",
          },
          {
            id: 2,
            name: "Truong Van Bao",
            email: "tvb012@gmail.com",
          },
          {
            id: 3,
            name: "Tran Huu Minh",
            email: "thm015@gmail.com",
          },
          {
            id: 4,
            name: "Le Tan Dat",
            email: "ltd017@gmail.com",
          },
        ];

        setInterns(mockInterns);
      } catch (error) {
        console.error("Error fetching interns:", error);
        setError("An error occurred while loading the trainee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, []);

  const handleViewJobDetail = (internId) => {
    navigate(`/intern-job-manage/${internId}`);
  };

  const handleCreateIntern = () => {
    setShowCreateModal(true);
  };

  const handleUpdateIntern = (internId) => {
    const intern = interns.find((intern) => intern.id === internId);

    setCurrentIntern(intern);
    setShowUpdateModal(true);
  };

  const handleDeleteIntern = (internId) => {
    const internToDelete = interns.find((intern) => intern.id === internId);
    setCurrentIntern(internToDelete);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (internId) => {
    const updatedInterns = interns.filter((intern) => intern.id !== internId);
    setInterns(updatedInterns);
    console.log("Đã xóa thực tập sinh:", internId);
  };

  const handleSubmitCreateForm = (selectedInterns) => {
    const newInterns = selectedInterns.map((intern) => ({
      ...intern,
    }));

    setInterns([...interns, ...newInterns]);
  };

  const handleAssigment = (intern) => {
    setInternToAssign(intern);
    setShowAssigmentModal(true);
  };

  const handleAssigmentSubmit = (assigmentData) => {
    console.log("Phân công:", assigmentData);

    setInterns(
      interns.map((intern) =>
        intern.id === assigmentData.internId
          ? {
              ...intern,
              mentor: {
                id: assigmentData.mentorId,
                name: assigmentData.mentorName,
                email: assigmentData.mentorEmail,
              },
            }
          : intern
      )
    );

    setShowAssigmentModal(false);
  };

  const renderAssignmentContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 shadow-lg"></div>
        </div>
      );
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

    if (interns.length === 0) {
      return (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <p className="text-gray-700 text-xl font-semibold px-4">
            Chưa có thực tập sinh nào để phân công
          </p>
          <p className="text-gray-500 mt-3 font-medium px-4">
            Hãy thêm thực tập sinh để quản lý phân công
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {interns.map((intern, index) => (
          <div
            key={intern.id}
            className="border border-gray-200 rounded-lg py-4 px-4 md:px-6 hover:shadow-md transition-all duration-300 bg-white hover:border-blue-200 cursor-pointer"
            onClick={() => handleAssigment(intern)}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
              <div className="flex items-center">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {index + 1}
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900 text-lg">
                    {intern.name}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {intern.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center bg-gray-50 py-2 px-4 rounded-lg w-full md:w-auto">
                <div className="text-right mr-4 font-medium text-gray-700">
                  Người hướng dẫn:
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    Nguyễn Văn A
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    nguyenvana@gmail.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Sửa đổi phần return chính để hiển thị nội dung dựa trên activeTab
  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-16 bg-white z-40 pb-6">
        {/* <div className="sticky top-16 bg-white z-40 border-b border-gray-200 pb-6"> */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              className={`py-4 px-8 font-medium text-base ${
                activeTab === "interns"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-300"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("interns")}
            >
              Quản lý thực tập sinh
            </button>
            <button
              className={`py-4 px-8 font-medium text-base ${
                activeTab === "assignments"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-300"
              } transition-colors duration-200`}
              onClick={() => setActiveTab("assignments")}
            >
              Phân công
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "interns" ? (
          <>
            <div className="flex justify-end mb-8">
              <button
                onClick={handleCreateIntern}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
              >
                Thêm mới
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : interns.length > 0 ? (
              <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full">
                  <tbody>
                    {interns.map((intern, index) => (
                      <tr
                        key={intern.id}
                        className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td className="py-5 px-6 text-gray-900 font-medium w-16 text-center">
                          {index + 1}
                        </td>
                        <td className="py-5 px-4">
                          <div className="font-medium text-gray-900 text-base">
                            {intern.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 flex items-center">
                            <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
                            {intern.email}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex justify-end space-x-6">
                            <button
                              onClick={() => handleViewJobDetail(intern.id)}
                              className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200"
                              title="Xem chi tiết"
                            >
                              <FileText className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleUpdateIntern(intern.id)}
                              className="text-yellow-500 hover:text-yellow-600 hover:scale-110 transition-all duration-200"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteIntern(intern.id)}
                              className="text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200"
                              title="Xóa"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-sm">
                <p className="text-gray-600 text-lg font-medium">
                  Chưa có thực tập sinh nào
                </p>
                <p className="text-gray-500 mt-2">
                  Hãy thêm thực tập sinh để quản lý
                </p>
                <button
                  onClick={handleCreateIntern}
                  className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
                >
                  Thêm thực tập sinh
                </button>
              </div>
            )}
          </>
        ) : (
          // Tab Phân công
          renderAssignmentContent()
        )}
      </div>

      <CreateInternshipModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitCreateForm}
      />

      <UpdateInternshipModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={(updatedIntern) => {
          setInterns(
            interns.map((intern) =>
              intern.id === updatedIntern.id ? updatedIntern : intern
            )
          );
          setShowUpdateModal(false);
        }}
        intern={currentIntern}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={currentIntern?.id}
        itemName={currentIntern?.name}
        itemType="thực tập sinh"
        onConfirm={handleConfirmDelete}
      />

      <AssigmentLeaderModal
      isOpen={showAssigmentModal}
      onClose={() => setShowAssigmentModal(false)}
      intern={internToAssign}
      onSubmit={handleAssigmentSubmit}
      />
    </div>
  );
};

export default InternManagement;
