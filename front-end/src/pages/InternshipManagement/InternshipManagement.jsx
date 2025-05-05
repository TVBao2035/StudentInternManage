import React, { useState } from "react";
import AssignmentList from "../AssignmentList";
import InternList from "../InternList";
import { AssignmentProvider } from "../../context/AssignmentContext";
import { InternProvider } from "../../context/InternContext";

const InternshipManagement = () => {
  const [activeTab, setActiveTab] = useState("interns");

  return (
    <div className="bg-white min-h-screen">
      <div className="sticky top-16 bg-white z-40 pb-6">
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
          <InternProvider>
            <InternList />
          </InternProvider>
        ) : (
          <AssignmentProvider>
            <AssignmentList />
          </AssignmentProvider>
        )}
      </div>
    </div>
  );
};

export default InternshipManagement;

// import React, { useState, useEffect } from "react";
// import { Pencil, Trash2, FileText, Mail } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import CreateInternshipModal from "../../components/InternshipModalManager/CreateInternshipModal";
// import UpdateInternshipModal from "../../components/InternshipModalManager/UpdateInternshipModal/UpdateInternshipModal";
// import DeleteConfirmModal from "../../components/DeleteConfirmModal";
// import Assignments from "../Assignments";
// import { getAllEmployee, deleteEmployee } from "../../api/internAPI";
// import {
//   showErrorToast,
//   showSuccessToast,
// } from "../../helpers/NotificationToast";

// const InternManagement = () => {
//   const [interns, setInterns] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("interns");
//   const navigate = useNavigate();

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [currentIntern, setCurrentIntern] = useState(null);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);

//   const fetchInterns = async () => {
//     setLoading(true);
//     try {
//       const response = await getAllEmployee();
//       if (
//         response?.status === 200 &&
//         response?.data?.isSuccess &&
//         response?.data?.data
//       ) {
//         const internData = response.data.data
//           .filter((employee) => employee.type === 0)
//           .map((intern) => ({
//             id: intern.id,
//             name: intern.user.name,
//             email: intern.user.email,
//             user: intern.user,
//           }));

//         //console.log("Intern data:", internData);
//         setInterns(internData);
//         setError(null);
//       } else {
//         setError(response?.data?.message || "Error loading intern list!");
//       }
//     } catch (err) {
//       console.error("Error fetching interns:", err);
//       setError("Connection error!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInterns();
//   }, []);

//   const handleViewJobDetail = (internId) => {
//     navigate(`/intern-job-manage/${internId}`);
//   };

//   const handleCreateIntern = () => {
//     setShowCreateModal(true);
//   };

//   const handleSubmitCreateForm = (createdInterns) => {
//     if (Array.isArray(createdInterns) && createdInterns.length > 0) {
//       fetchInterns();
//       showSuccessToast("Create intern successfully!");
//     }
//   };

//   const handleUpdateIntern = (internId) => {
//     const intern = interns.find((intern) => intern.id === internId);

//     setCurrentIntern(intern);
//     setShowUpdateModal(true);
//   };

//   const handleUpdateSubmit = async (updatedIntern) => {
//     try {
//       setInterns(
//         interns.map((intern) =>
//           intern.id === updatedIntern.id ? updatedIntern : intern
//         )
//       );
//       //showSuccessToast("Update intern successfully!");
//       setShowUpdateModal(false);
//     } catch (err) {
//       console.log("Error updating intern:", err);
//       fetchInterns();
//     }
//   };

//   const handleDeleteIntern = (internId) => {
//     const internToDelete = interns.find((intern) => intern.id === internId);
//     setCurrentIntern(internToDelete);
//     setShowDeleteModal(true);
//   };

//   const handleConfirmDelete = async (internId) => {
//     try {
//       const response = await deleteEmployee(internId);

//       if (response?.status === 200 && response?.data?.isSuccess) {
//         const updatedInterns = interns.filter(
//           (intern) => intern.id !== internId
//         );
//         setInterns(updatedInterns);
//         showSuccessToast("Delete intern successfully!");
//       } else {
//         showErrorToast("Delete intern failed!");
//         fetchInterns();
//       }
//     } catch (err) {
//       console.error("Error deleting intern:", err);
//       showErrorToast("Connection error!");
//       fetchInterns();
//     } finally {
//       setShowDeleteModal(false);
//       setCurrentIntern(null);
//     }
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       <div className="sticky top-16 bg-white z-40 pb-6">
//         {/* <div className="sticky top-16 bg-white z-40 border-b border-gray-200 pb-6"> */}
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex">
//             <button
//               className={`py-4 px-8 font-medium text-base ${
//                 activeTab === "interns"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-300"
//               } transition-colors duration-200`}
//               onClick={() => setActiveTab("interns")}
//             >
//               Quản lý thực tập sinh
//             </button>
//             <button
//               className={`py-4 px-8 font-medium text-base ${
//                 activeTab === "assignments"
//                   ? "text-blue-600 border-b-2 border-blue-600"
//                   : "text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-300"
//               } transition-colors duration-200`}
//               onClick={() => setActiveTab("assignments")}
//             >
//               Phân công
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {activeTab === "interns" ? (
//           <>
//             <div className="flex justify-end mb-8">
//               <button
//                 onClick={handleCreateIntern}
//                 className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
//               >
//                 Thêm mới
//               </button>
//             </div>

//             {loading ? (
//               <div className="flex justify-center items-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//               </div>
//             ) : error ? (
//               <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//                 <div className="flex">
//                   <div className="ml-3">
//                     <p className="text-sm text-red-700">{error}</p>
//                   </div>
//                 </div>
//               </div>
//             ) : interns.length > 0 ? (
//               <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
//                 <table className="min-w-full">
//                   <tbody>
//                     {interns.map((intern, index) => (
//                       <tr
//                         key={intern.id}
//                         className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200"
//                       >
//                         <td className="py-5 px-6 text-gray-900 font-medium w-16 text-center">
//                           {index + 1}
//                         </td>
//                         <td className="py-5 px-4">
//                           <div className="font-medium text-gray-900 text-base">
//                             {intern.name}
//                           </div>
//                           <div className="text-sm text-gray-500 mt-1 flex items-center">
//                             <Mail className="h-4 w-4 mr-1.5 text-gray-400" />
//                             {intern.email}
//                           </div>
//                         </td>
//                         <td className="py-5 px-6 text-right">
//                           <div className="flex justify-end space-x-6">
//                             <button
//                               onClick={() => handleViewJobDetail(intern.id)}
//                               className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200"
//                               title="Xem chi tiết"
//                             >
//                               <FileText className="h-5 w-5" />
//                             </button>
//                             <button
//                               onClick={() => handleUpdateIntern(intern.id)}
//                               className="text-yellow-500 hover:text-yellow-600 hover:scale-110 transition-all duration-200"
//                               title="Chỉnh sửa"
//                             >
//                               <Pencil className="h-5 w-5" />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteIntern(intern.id)}
//                               className="text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200"
//                               title="Xóa"
//                             >
//                               <Trash2 className="h-5 w-5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-sm">
//                 <p className="text-gray-600 text-lg font-medium">
//                   Chưa có thực tập sinh nào
//                 </p>
//                 <p className="text-gray-500 mt-2">
//                   Hãy thêm thực tập sinh để quản lý
//                 </p>
//                 <button
//                   onClick={handleCreateIntern}
//                   className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow"
//                 >
//                   Thêm thực tập sinh
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           // Tab Phân công
//           <Assignments />
//         )}
//       </div>

//       <CreateInternshipModal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         onSubmit={handleSubmitCreateForm}
//       />

//       <UpdateInternshipModal
//         isOpen={showUpdateModal}
//         onClose={() => setShowUpdateModal(false)}
//         onSubmit={handleUpdateSubmit}
//         intern={currentIntern}
//       />

//       <DeleteConfirmModal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         itemId={currentIntern?.id}
//         itemName={currentIntern?.name}
//         itemType="thực tập sinh"
//         onConfirm={handleConfirmDelete}
//       />
//     </div>
//   );
// };

// export default InternManagement;
