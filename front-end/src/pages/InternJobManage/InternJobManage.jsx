import React, { useState, useEffect } from "react";
import { Pencil, Trash2, ChevronDown, CornerUpLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import CreateInternJobModal from "../../components/InternJobModalManager/CreateInternJobModal";
import UpdateInternJobModal from "../../components/InternJobModalManager/UpdateInternJobModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

const InternJobManage = () => {
  const [loading, setLoading] = useState(true);
  const [intern, setIntern] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const { internId } = useParams();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchInternAndJobs = async () => {
      setLoading(true);
      try {
        const mockIntern = {
          id: internId,
          name: "Nguyen Van B",
          email: "nguyenvanb@gmail.com",
        };

        const mockJobs = [
          {
            id: 1,
            title: "Tìm hiểu về Vue JS",
            notice:
              "cách sử dụng, tạo mới component, truyền dữ liệu giữa các component",
            status: "Hoàn thành",
          },
          {
            id: 2,
            title: "Tìm hiểu router trong Vue JS",
            notice: "tìm hiểu về single page, và tạo router",
            status: "Đã giao",
          },
          {
            id: 3,
            title: "Tìm hiểu thư viện axios",
            notice: "cách dùng axios, customs một axios",
            status: "Chưa hoàn thành",
          },
        ];

        setIntern(mockIntern);
        setJobs(mockJobs);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchInternAndJobs();
  }, [internId]);

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

  const handleUpdateStatus = (jobId, newStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );

    console.log(
      `Đã cập nhật trạng thái công việc ${jobId} thành: ${newStatus}`
    );
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCreateJob = (newJob) => {
    setJobs((prevJobs) => [...prevJobs, newJob]);
    console.log("Đã tạo công việc mới:", newJob);
  };

  const handleOpenUpdateModal = (jobId) => {
    const jobToEdit = jobs.find((job) => job.id === jobId);
    if (jobToEdit) {
      setCurrentJob(jobToEdit);
      setShowUpdateModal(true);
    }
  };

  const handleUpdateJob = (updatedJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
    );
    console.log("Đã cập nhật công việc:", updatedJob);
  };

  const handleOpenDeleteModal = (jobId) => {
    const jobToDelete = jobs.find((job) => job.id === jobId);
    setCurrentJob(jobToDelete);
    setShowDeleteModal(true);
  };

  const handleDeleteJob = (jobId) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);
    console.log("Đã xóa thực tập sinh:", internId);
  };

  const handleBack = () => {
    navigate("/intern-manager");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 shadow-lg"></div>
      </div>
    );
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
      </div>

      <div className="flex justify-between items-center mt-6 mb-8">
        {/* <button className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
          <ArrowLeft size={20} />
        </button> */}

        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
        >
          <CornerUpLeft size={22} />
        </button>

        <button
          onClick={handleOpenCreateModal}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <span>Thêm mới</span>
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className="border border-gray-200 rounded-xl py-4 px-6 hover:shadow-md transition-all duration-200 bg-white"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-medium text-sm">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-medium text-gray-900 ml-3">
                    {job.title}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-gray-600 ml-11">
                  <span className="font-medium text-gray-700">Notice: </span>
                  <span className="italic">{job.notice}</span>
                </p>
              </div>
              <div className="flex items-center space-x-8">
                <div className="relative">
                  <select
                    className={`appearance-none pl-4 pr-10 py-2 rounded-lg text-sm font-medium ${getStatusClass(
                      job.status
                    )} border-0 focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 cursor-pointer w-44 transition-all duration-200`}
                    value={job.status}
                    onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                  >
                    <option
                      value="Hoàn thành"
                      className="bg-white text-gray-800"
                    >
                      Hoàn thành
                    </option>
                    <option value="Đã giao" className="bg-white text-gray-800">
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
                    onClick={() => handleOpenUpdateModal(job.id)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-all duration-200"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(job.id)}
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
      <CreateInternJobModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateJob}
        internId={internId}
      />

      <UpdateInternJobModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={handleUpdateJob}
        job={currentJob}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        itemId={currentJob?.id}
        itemName={currentJob?.title}
        itemType="công việc"
        onConfirm={handleDeleteJob}
      />
    </div>
  );
};

export default InternJobManage;

// import React, { useState, useEffect } from "react";
// import { ArrowLeft, Pencil, Trash2, ChevronDown } from "lucide-react";
// import { useParams, useNavigate } from "react-router-dom";

// const InternJobManage = () => {
//   const { internId } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [intern, setIntern] = useState(null);
//   const [jobs, setJobs] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInternAndJobs = async () => {
//       setLoading(true);
//       try {
//         // Mock data for the intern
//         const mockIntern = {
//           id: internId,
//           name: "Nguyen Van B",
//           email: "nguyenvanb@gmail.com",
//         };

//         // Mock data for jobs
//         const mockJobs = [
//           {
//             id: 1,
//             title: "Tìm hiểu về Vue JS",
//             notice: "cách sử dụng, tạo mới component, truyền dữ liệu giữa các component",
//             status: "Hoàn thành"
//           },
//           {
//             id: 2,
//             title: "Tìm hiểu router trong Vue JS",
//             notice: "tìm hiểu về single page, và tạo router",
//             status: "Đã giao"
//           },
//           {
//             id: 3,
//             title: "Tìm hiểu thư viện axios",
//             notice: "cách dùng axios, customs một axios",
//             status: "Chưa hoàn thành"
//           }
//         ];

//         setIntern(mockIntern);
//         setJobs(mockJobs);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInternAndJobs();
//   }, [internId]);

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "Hoàn thành":
//         return "bg-green-100 text-green-800";
//       case "Đã giao":
//         return "bg-blue-100 text-blue-800";
//       case "Chưa hoàn thành":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const handleUpdateStatus = (jobId, newStatus) => {
//     // Cập nhật trạng thái công việc cục bộ (client-side)
//     setJobs(prevJobs =>
//       prevJobs.map(job =>
//         job.id === jobId ? { ...job, status: newStatus } : job
//       )
//     );

//     // Trong thực tế, bạn sẽ gọi API để cập nhật trạng thái
//     console.log(`Đã cập nhật trạng thái công việc ${jobId} thành: ${newStatus}`);

//     // Mô phỏng API call
//     // try {
//     //   await fetch(`/api/jobs/${jobId}`, {
//     //     method: 'PATCH',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify({ status: newStatus }),
//     //   });
//     // } catch (error) {
//     //   console.error('Error updating job status:', error);
//     //   // Xử lý lỗi nếu cần
//     // }
//   };

//   const handleEdit = (jobId) => {
//     console.log("Edit job", jobId);
//     // Implementation for editing job
//   };

//   const handleDelete = (jobId) => {
//     console.log("Delete job", jobId);
//     // Implementation for deleting job
//   };

//   const handleBack = () => {
//     // Chuyển hướng trực tiếp đến trang InternshipManagement
//     navigate('/interns');
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 flex flex-col items-center justify-center">
//         <div className="text-red-500 text-xl font-semibold mb-4">{error}</div>
//         <button
//           onClick={handleBack}
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Quay lại
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-6">
//       {/* Intern info - với khoảng cách lớn hơn từ header */}
//       <div className="mt-8">
//         <h2 className="text-lg font-medium text-gray-900">{intern.name}</h2>
//         <p className="text-gray-600 text-sm">{intern.email}</p>
//       </div>

//       {/* Back button and Add button */}
//       <div className="flex justify-between items-center mt-6 mb-8">
//         <button
//           onClick={handleBack}
//           className="text-gray-600 hover:text-gray-800"
//         >
//           <ArrowLeft size={20} />
//         </button>

//         <button
//           className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Thêm
//         </button>
//       </div>

//       {/* Job list */}
//       <div className="space-y-4">
//         {jobs.map((job, index) => (
//           <div
//             key={job.id}
//             className="border border-gray-200 rounded-lg py-2.5 px-4 hover:shadow-sm transition-shadow"
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <div className="flex items-center">
//                   <span className="w-6 text-center font-medium text-gray-700">{index + 1}</span>
//                   <h3 className="text-base font-medium text-gray-900 ml-2">{job.title}</h3>
//                 </div>
//                 <p className="mt-1 text-sm text-gray-600 ml-8">
//                   <span className="font-medium">notice: </span>
//                   <span className="italic">{job.notice}</span>
//                 </p>
//               </div>
//               <div className="flex items-center space-x-8">
//                 <div className="relative">
//                   <select
//                     className={`appearance-none pl-3 pr-8 py-1 rounded text-sm font-medium ${getStatusClass(job.status)} border-0 focus:ring-0 cursor-pointer w-40`}
//                     value={job.status}
//                     onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
//                   >
//                     <option value="Hoàn thành" className="bg-white text-gray-800">Hoàn thành</option>
//                     <option value="Đã giao" className="bg-white text-gray-800">Đã giao</option>
//                     <option value="Chưa hoàn thành" className="bg-white text-gray-800">Chưa hoàn thành</option>
//                   </select>
//                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                     <ChevronDown size={14} />
//                   </div>
//                 </div>
//                 <div className="flex space-x-6">
//                   <button
//                     onClick={() => handleEdit(job.id)}
//                     className="text-yellow-500 hover:text-yellow-600"
//                   >
//                     <Pencil size={18} />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(job.id)}
//                     className="text-red-500 hover:text-red-600"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default InternJobManage;
