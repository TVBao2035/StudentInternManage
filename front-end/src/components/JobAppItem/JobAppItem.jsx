import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const JobAppItem = ({ application, onViewDetails }) => {
  const getStatusColorClass = (status) => {
    switch (status) {
      case "PENDING":
        return "text-blue-500";
      case "VIEWED":
        return "text-orange-500";
      case "REJECTED":
        return "text-red-500";
      case "ACCEPTED":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang gửi cho nhà tuyển dụng";
      case "VIEWED":
        return "Nhà tuyển dụng đã xem hồ sơ của bạn";
      case "REJECTED":
        return "Hồ sơ của bạn chưa phù hợp";
      case "ACCEPTED":
        return "Hồ sơ của bạn đã được chấp nhận";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4">
          <h3 className="text-lg font-semibold text-blue-600">
            {application.jobTitle}
          </h3>
          <p className="text-sm text-gray-600 mt-2 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Ngày ứng tuyển: {formatDate(application.appliedDate)}
          </p>
        </div>

        <div className="md:col-span-1 text-right md:text-left">
          <span className="text-sm text-gray-700 font-medium">Trạng thái:</span>
        </div>

        <div className="md:col-span-5">
          <span
            className={`text-sm font-medium ${getStatusColorClass(
              application.status
            )}`}
          >
            {getStatusText(application.status)}
          </span>
        </div>

        <div className="md:col-span-2 text-right">
          <button
            onClick={() => onViewDetails(application.id)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobAppItem;

// import React from "react";
// import { format } from "date-fns";
// import { vi } from "date-fns/locale";

// const JobAppItem = ({ application, onViewDetails }) => {
//   const getStatusColorClass = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "text-blue-500 bg-blue-50";
//       case "VIEWED":
//         return "text-orange-500 bg-orange-50";
//       case "REJECTED":
//         return "text-red-500 bg-red-50";
//       case "ACCEPTED":
//         return "text-green-500 bg-green-50";
//       default:
//         return "text-gray-500 bg-gray-50";
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case "PENDING":
//         return "Đang gửi cho nhà tuyển dụng";
//       case "VIEWED":
//         return "Nhà tuyển dụng đã xem hồ sơ của bạn";
//       case "REJECTED":
//         return "Hồ sơ của bạn chưa phù hợp";
//       case "ACCEPTED":
//         return "Hồ sơ của bạn đã được chấp nhận";
//       default:
//         return "Không xác định";
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return format(date, "dd/MM/yyyy", { locale: vi });
//     } catch (error) {
//       console.error("Error formatting date:", error);
//       return dateString;
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
//       <div className="p-5">
//         <div className="md:flex md:justify-between md:items-center">
//           <div className="mb-3 md:mb-0">
//             <h3 className="text-lg font-semibold text-blue-600">
//               {application.jobTitle}
//             </h3>
//             <p className="text-sm text-gray-500">
//               Ngày ứng tuyển: {formatDate(application.appliedDate)}
//             </p>
//           </div>

//           <div className="flex items-center justify-between md:justify-end space-x-4">
//             <div className="flex-shrink-0">
//               <span
//                 className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClass(
//                   application.status
//                 )}`}
//               >
//                 {getStatusText(application.status)}
//               </span>
//             </div>

//             <button
//               onClick={() => onViewDetails(application.id)}
//               className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
//             >
//               Xem chi tiết
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobAppItem;
