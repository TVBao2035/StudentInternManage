import React, { useState } from "react";
import { FaInfoCircle, FaCalendarAlt, FaSyncAlt } from "react-icons/fa";
import {
  IoCheckmarkCircle,
  IoAlertCircle,
  IoTimeOutline,
} from "react-icons/io5";
import { useInternTask } from "../../hooks/useInternTask";
import LoadingSpinner from "../../components/LoadingSpinner";

const TaskList = () => {
  const [assignmentId, setAssignmentId] = useState(null);
  const { tasks, loading, error, refreshTasks, userInfo } =
    useInternTask(assignmentId);

  const getStatusStyles = (status) => {
    switch (status) {
      case "Hoàn thành":
        return {
          textColor: "text-emerald-600",
          bgColor: "bg-gradient-to-r from-emerald-50 to-green-50",
          text: "Hoàn thành",
          icon: IoCheckmarkCircle,
        };
      case "Đã giao":
        return {
          textColor: "text-amber-600",
          bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
          text: "Đã giao",
          icon: IoTimeOutline,
        };
      case "Chưa hoàn thành":
        return {
          textColor: "text-rose-600",
          bgColor: "bg-gradient-to-r from-rose-50 to-red-50",
          text: "Chưa hoàn thành",
          icon: IoAlertCircle,
        };
      default:
        return {
          textColor: "text-slate-600",
          bgColor: "bg-gradient-to-r from-slate-50 to-gray-50",
          text: status,
          icon: FaInfoCircle,
        };
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 mt-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 shadow-sm rounded-r-lg">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={refreshTasks}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all flex items-center"
        >
          <FaSyncAlt className="mr-2" />
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 mt-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Danh sách công việc
          </h1>
          {userInfo && userInfo.name && (
            <p className="text-gray-600 mt-1">Xin chào, {userInfo.name}</p>
          )}
        </div>
        <button
          onClick={refreshTasks}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-all flex items-center"
        >
          <FaSyncAlt className="mr-2" />
          Làm mới
        </button>
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task, index) => {
            const statusStyle = getStatusStyles(task.status);
            const StatusIcon = statusStyle.icon;
            return (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium text-lg mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {task.title}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1 italic">
                          <span className="font-medium not-italic">
                            Notice:
                          </span>{" "}
                          {task.notice}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div
                        className={`px-4 py-1.5 rounded-full ${statusStyle.bgColor} ${statusStyle.textColor} text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-200/10 flex items-center gap-2`}
                      >
                        <StatusIcon className="text-base" />
                        {statusStyle.text}
                      </div>
                      <div className="text-gray-400 text-sm mt-2 font-medium flex items-center gap-2">
                        <FaCalendarAlt />
                        {task.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg shadow-sm">
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
            Chưa có công việc nào
          </p>
          <p className="text-gray-500 mt-2 mb-6">
            Hiện tại bạn chưa được giao công việc nào
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;

// import React from "react";
// import { FaInfoCircle, FaCalendarAlt } from "react-icons/fa";
// import { IoCheckmarkCircle, IoAlertCircle, IoTimeOutline } from "react-icons/io5";

// const TaskList = () => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const mockJobs = [
//       {
//         id: 1,
//         title: "Tìm hiểu về Vue JS",
//         notice:
//           "cách sử dụng, tạo một component, truyền dữ liệu giữa các component",
//         status: "Hoàn thành",
//         date: "01/03/2025",
//       },
//       {
//         id: 2,
//         title: "Tìm hiểu router trong Vue JS",
//         notice: "tìm hiểu về single page, và tạo router",
//         status: "Đã giao",
//         date: "01/03/2025",
//       },
//       {
//         id: 3,
//         title: "Tìm hiểu thư viện axios",
//         notice: "cách dụng axios, customs một axios",
//         status: "Chưa hoàn thành",
//         date: "01/03/2025",
//       },
//     ];

//     setJobs(mockJobs);
//     setLoading(false);
//   }, []);

//   const getStatusStyles = (status) => {
//     switch (status) {
//       case "Hoàn thành":
//         return {
//           textColor: "text-emerald-600",
//           bgColor: "bg-gradient-to-r from-emerald-50 to-green-50",
//           text: "Hoàn thành",
//           icon: IoCheckmarkCircle,
//         };
//       case "Đã giao":
//         return {
//           textColor: "text-amber-600",
//           bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
//           text: "Đã giao",
//           icon: IoTimeOutline,
//         };
//       case "Chưa hoàn thành":
//         return {
//           textColor: "text-rose-600",
//           bgColor: "bg-gradient-to-r from-rose-50 to-red-50",
//           text: "Chưa hoàn thành",
//           icon: IoAlertCircle,
//         };
//       default:
//         return {
//           textColor: "text-slate-600",
//           bgColor: "bg-gradient-to-r from-slate-50 to-gray-50",
//           text: status,
//           icon: FaInfoCircle,
//         };
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6 mt-12">
//       <div className="space-y-4">
//         {jobs.map((job) => {
//           const statusStyle = getStatusStyles(job.status);
//           const StatusIcon = statusStyle.icon;
//           return (
//             <div
//               key={job.id}
//               className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-300"
//             >
//               <div className="p-5">
//                 <div className="flex justify-between items-start">
//                   <div className="flex items-center">
//                     <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium text-lg mr-4">
//                       {job.id}
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-900">
//                         {job.title}
//                       </h3>
//                       <div className="text-sm text-gray-600 mt-1 italic">
//                         notice: {job.notice}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-end">
//                     <div
//                       className={`px-4 py-1.5 rounded-full ${statusStyle.bgColor} ${statusStyle.textColor} text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-200/10 flex items-center gap-2`}
//                     >
//                       <StatusIcon className="text-base" />
//                       {statusStyle.text}
//                     </div>
//                     <div className="text-gray-400 text-sm mt-2 font-medium flex items-center gap-2">
//                       <FaCalendarAlt />
//                       {job.date}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default TaskList;
