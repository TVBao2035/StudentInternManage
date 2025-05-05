import React, { useState } from "react";
import { ArrowUpRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";
import { useJobAPI } from "../../../hooks/useJobAPI";
import DeleteConfirmModal from "../../DeleteConfirmModal";

const ApplicationButton = ({ postId, onApply }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const {
    applicationStatus,
    applicationId,
    loading,
    isSubmitting,
    isAuthenticated,
    cancelApplication,
  } = useJobAPI(postId);

  const handleCancelClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    await cancelApplication();
    setShowDeleteModal(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      onApply();
      return;
    }
    onApply();
  };

  const renderButton = () => {
    if (loading) {
      return (
        <button className="w-full md:w-auto px-10 py-4 bg-gray-300 text-gray-700 font-semibold rounded-xl cursor-wait flex items-center justify-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-600 rounded-full border-t-transparent"></div>
          <span>Đang tải...</span>
        </button>
      );
    }

    if (isSubmitting) {
      return (
        <button className="w-full md:w-auto px-10 py-4 bg-blue-400 text-white font-semibold rounded-xl flex items-center justify-center cursor-wait">
          <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
          <span>Đang xử lý...</span>
        </button>
      );
    }

    if (applicationStatus === null) {
      return (
        <button
          onClick={handleApply}
          className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-200/50 hover:shadow-2xl active:scale-95 transform flex items-center justify-center"
        >
          <span>Ứng tuyển</span>
          <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </button>
      );
    }

    if (applicationStatus === 0) {
      return (
        <div className="flex space-x-2">
          <button className="w-full md:w-auto px-10 py-4 bg-gray-200 text-gray-800 font-semibold rounded-xl flex items-center justify-center cursor-default">
            <Clock className="h-4 w-4 mr-2 text-gray-600" />
            <span>Đã ứng tuyển</span>
          </button>
          <button
            onClick={handleCancelClick}
            className="px-4 py-4 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
            title="Hủy đơn ứng tuyển"
          >
            <AlertCircle className="h-4 w-4" />
          </button>
        </div>
      );
    }

    if (applicationStatus === 1) {
      return (
        <button className="w-full md:w-auto px-10 py-4 bg-blue-100 text-blue-800 font-semibold rounded-xl flex items-center justify-center cursor-default">
          <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
          <span>Đã xem</span>
        </button>
      );
    }

    if (applicationStatus === 2) {
      return (
        <button className="w-full md:w-auto px-10 py-4 bg-green-100 text-green-800 font-semibold rounded-xl flex items-center justify-center cursor-default">
          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
          <span>Đã chấp nhận</span>
        </button>
      );
    }

    if (applicationStatus === -1) {
      return (
        <button className="w-full md:w-auto px-10 py-4 bg-red-100 text-red-800 font-semibold rounded-xl flex items-center justify-center cursor-default">
          <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
          <span>Đã từ chối</span>
        </button>
      );
    }

    return (
      <button
        onClick={handleApply}
        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-200/50 hover:shadow-2xl active:scale-95 transform"
      >
        <span>Ứng tuyển</span>
      </button>
    );
  };

  return (
    <>
      {renderButton()}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        itemId={applicationId}
        itemName="đơn ứng tuyển này"
        itemType="đơn ứng tuyển"
        onConfirm={handleConfirmDelete}
        confirmText="Xác nhận hủy"
        cancelText="Không"
      />
    </>
  );
};

ApplicationButton.propTypes = {
  postId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]).isRequired,
  onApply: PropTypes.func.isRequired,
};

export default ApplicationButton;
