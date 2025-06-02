import React, { useState } from "react";
import { useAdminJobAPI } from "../../hooks/useAdminJobAPI";
import { JobApplicationsTable, CVDetailModal } from "../../components/Application";
import { showSuccessToast, showErrorToast } from "../../helpers/NotificationToast";
import { updateJobApplication } from "../../api/jobAPI";

const CVReview = () => {
    const { jobApplications, loading, error, fetchJobApplications } = useAdminJobAPI();
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [updating, setUpdating] = useState(false);

    const handleViewDetail = (application) => {
        setSelectedApplication(application);
        setShowDetailModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedApplication(null);
    };

    const handleUpdateStatus = async (id, newStatus) => {
        setUpdating(true);
        try {
            const response = await updateJobApplication(id, { status: newStatus });

            if (response?.status === 200 && response?.data?.isSuccess) {
                await fetchJobApplications();

                if (selectedApplication && selectedApplication.id === id) {
                    setSelectedApplication({...selectedApplication, status: newStatus});
                }

                showSuccessToast("Status update successful!");
                setShowDetailModal(false);
            } else {
                const errorMsg = response?.data?.message || "Error updating status!";
                showErrorToast(errorMsg);
            }
        } catch (error) {
            console.error("Error updating application status:", error);
            showErrorToast("Connection error, please try again later!");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-20 pb-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản lý CV ứng tuyển
                    </h1>
                </div>

                <JobApplicationsTable 
                    applications={jobApplications}
                    onViewDetail={handleViewDetail}
                    loading={loading}
                    error={error}
                />
            </div>

            <CVDetailModal 
                isOpen={showDetailModal}
                application={selectedApplication}
                onClose={handleCloseModal}
                onUpdateStatus={handleUpdateStatus}
                updating={updating}
            />
        </div>
    );
};

export default CVReview;