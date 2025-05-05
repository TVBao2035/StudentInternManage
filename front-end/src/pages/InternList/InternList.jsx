import React, { useState } from "react";
import { Pencil, Trash2, FileText, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CreateInternshipModal,
  UpdateInternshipModal,
} from "../../components/InternshipModalManager";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import { useInternContext } from "../../context/InternContext";
import LoadingSpinner from "../../components/LoadingSpinner";

const InternList = () => {
  const { interns, loading, error, createIntern, updateIntern, deleteIntern } =
    useInternContext();

  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentIntern, setCurrentIntern] = useState(null);

  const handleViewJobDetail = (internId) => {
    navigate(`/intern-job-manage/${internId}`);
  };

  const handleCreateIntern = () => {
    setShowCreateModal(true);
  };

  const handleSubmitCreateForm = (createdInterns) => {
    createIntern(createdInterns);
    setShowCreateModal(false);
  };

  const handleUpdateIntern = (internId) => {
    const intern = interns.find((intern) => intern.id === internId);
    setCurrentIntern(intern);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (updatedIntern) => {
    await updateIntern(updatedIntern);
    setShowUpdateModal(false);
  };

  const handleDeleteIntern = (internId) => {
    const internToDelete = interns.find((intern) => intern.id === internId);
    setCurrentIntern(internToDelete);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (internId) => {
    await deleteIntern(internId);
    setShowDeleteModal(false);
    setCurrentIntern(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-8">
        <button
          onClick={handleCreateIntern}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
        >
          Thêm mới
        </button>
      </div>

      {interns.length > 0 ? (
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
        </div>
      )}

      <CreateInternshipModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleSubmitCreateForm}
      />

      <UpdateInternshipModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={handleUpdateSubmit}
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
    </>
  );
};

export default InternList;
