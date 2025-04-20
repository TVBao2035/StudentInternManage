import React, { useState, useEffect } from "react";
import { FaInfoCircle, FaCalendarAlt } from "react-icons/fa";
import { IoCheckmarkCircle, IoAlertCircle, IoTimeOutline } from "react-icons/io5";

const TaskList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockJobs = [
      {
        id: 1,
        title: "Tìm hiểu về Vue JS",
        notice:
          "cách sử dụng, tạo một component, truyền dữ liệu giữa các component",
        status: "Hoàn thành",
        date: "01/03/2025",
      },
      {
        id: 2,
        title: "Tìm hiểu router trong Vue JS",
        notice: "tìm hiểu về single page, và tạo router",
        status: "Đã giao",
        date: "01/03/2025",
      },
      {
        id: 3,
        title: "Tìm hiểu thư viện axios",
        notice: "cách dụng axios, customs một axios",
        status: "Chưa hoàn thành",
        date: "01/03/2025",
      },
    ];

    setJobs(mockJobs);
    setLoading(false);
  }, []);

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 mt-12">
      <div className="space-y-4">
        {jobs.map((job) => {
          const statusStyle = getStatusStyles(job.status);
          const StatusIcon = statusStyle.icon;
          return (
            <div
              key={job.id}
              className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium text-lg mr-4">
                      {job.id}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {job.title}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1 italic">
                        notice: {job.notice}
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
                      {job.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskList;
