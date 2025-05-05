import React, { useEffect, useState } from "react";
import { X, Search, Loader } from "lucide-react";
import { getAllEmployee, createEmployeeIntern } from "../../../api/internAPI";
import { getAllUser } from "../../../api/userApi";

const CreateInternshipModal = ({ isOpen, onClose, onSubmit }) => {
  const [usersList, setUsersList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAvailableUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const usersResponse = await getAllUser();
      const employeesResponse = await getAllEmployee();

      if (
        usersResponse?.status === 200 &&
        usersResponse?.data?.isSuccess &&
        employeesResponse?.status === 200 &&
        employeesResponse?.data?.isSuccess
      ) {
        const allUsers = usersResponse.data.data;
        const allEmployees = employeesResponse.data.data;

        // Danh sach userId da duoc gan lam employee
        const employeeUserIds = allEmployees.map((employee) => employee.userId);

        // Loc ra nhung user chua duoc gan lam employee
        const availableUsers = allUsers.filter(
          (user) => !employeeUserIds.includes(user.id)
        );

        setUsersList(availableUsers);
      } else {
        setError("Failed to fetch users or employees data.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAvailableUsers();
    }
  }, [isOpen]);

  const handleToggleUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setLoading(true);
      const createdInterns = [];

      for (const userId of selectedUsers) {
        const internData = { userId: userId, type: 0 };
        const response = await createEmployeeIntern(internData);

        if (
          response?.status === 200 &&
          response?.data?.isSuccess &&
          response?.data?.data
        ) {
          const newIntern = response.data.data;

          createdInterns.push({
            id: newIntern.id,
            name: newIntern.name,
            email: newIntern.email,
            user: newIntern.user,
            type: newIntern.type,
          });
        }
      }
      //console.log("Created interns:", createdInterns.length);
      onSubmit(createdInterns);
      setSelectedUsers([]);
      onClose();
    } catch (err) {
      console.error("Error creating interns:", err);
      setError("An error occurred while creating interns.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = usersList.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl h-[600px] flex flex-col transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-blue-600 tracking-wide">
            Thêm mới thực tập sinh
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex-1 overflow-hidden">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <h3 className="text-base font-semibold mb-4 text-gray-700">
            Danh sách người dùng chưa được thêm
          </h3>

          <div className="border border-gray-200 rounded-xl p-3 h-[360px] overflow-hidden flex flex-col bg-gray-50/50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader size={24} className="animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                {searchTerm
                  ? "Không tìm thấy người dùng phù hợp"
                  : "Không có người dùng nào khả dụng"}
              </div>
            ) : (
              <div className="overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-blue-500">
                <div className="space-y-2.5">
                  {filteredUsers.map((user, index) => (
                    <div
                      key={user.id}
                      className="flex items-center border border-gray-200 rounded-lg bg-white py-3 px-4 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="w-6 text-center text-sm font-medium text-gray-500">
                        {index + 1}
                      </div>
                      <div className="flex-1 flex mx-4">
                        <div className="text-sm font-medium w-32 text-gray-700">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 flex-1">
                          {user.email}
                        </div>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleToggleUser(user.id)}
                          className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all duration-200 accent-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <div className="text-sm text-gray-600 font-medium">
            Đã chọn:{" "}
            <span className="text-blue-600">{selectedUsers.length}</span> người
            dùng
          </div>
          <button
            onClick={handleSubmit}
            disabled={selectedUsers.length === 0 || loading}
            className={`px-8 py-2.5 text-white text-sm font-medium rounded-lg transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              selectedUsers.length === 0 || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500"
            }`}
          >
            {loading ? "Đang xử lý..." : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInternshipModal;

// import React, { useState } from "react";
// import { X } from "lucide-react";

// const CreateInternshipModal = ({ isOpen, onClose, onSubmit }) => {
//   const [selectedInterns, setSelectedInterns] = useState([]);
//   const internsList = [
//     { id: 1, name: "Nguyen Van C", email: "nguyenvanc@gmail.com" },
//     { id: 2, name: "Nguyen Van D", email: "nguyenvand@gmail.com" },
//     { id: 3, name: "Nguyen Van E", email: "nguyenvane@gmail.com" },
//     // { id: 4, name: "Nguyen Van C", email: "nguyenvanc@gmail.com" },
//     // { id: 5, name: "Nguyen Van D", email: "nguyenvand@gmail.com" },
//     // { id: 6, name: "Nguyen Van E", email: "nguyenvane@gmail.com" },
//     // { id: 7, name: "Nguyen Van C", email: "nguyenvanc@gmail.com" },
//     // { id: 8, name: "Nguyen Van D", email: "nguyenvand@gmail.com" },
//     // { id: 9, name: "Nguyen Van E", email: "nguyenvane@gmail.com" },
//   ];

//   const handleToggleIntern = (internId) => {
//     if (selectedInterns.includes(internId)) {
//       setSelectedInterns(selectedInterns.filter((id) => id !== internId));
//     } else {
//       setSelectedInterns([...selectedInterns, internId]);
//     }
//   };

//   const handleSubmit = () => {
//     const selectedInternData = internsList.filter((intern) =>
//       selectedInterns.includes(intern.id)
//     );
//     onSubmit(selectedInternData);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl h-[600px] flex flex-col transform transition-all duration-300 ease-in-out">
//         <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
//           <h2 className="text-xl font-semibold text-blue-600 tracking-wide">
//             Tạo mới
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <div className="px-6 py-5 flex-1 overflow-hidden">
//           <h3 className="text-base font-semibold mb-4 text-gray-700">
//             Danh sách thực tập sinh
//           </h3>
//           <div className="border border-gray-200 rounded-xl p-3 h-[400px] overflow-hidden flex flex-col bg-gray-50/50">
//             <div className="overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-blue-500">
//               <div className="space-y-2.5">
//                 {internsList.map((intern, index) => (
//                   <div
//                     key={intern.id}
//                     className="flex items-center border border-gray-200 rounded-lg bg-white py-3 px-4 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
//                   >
//                     <div className="w-6 text-center text-sm font-medium text-gray-500">
//                       {index + 1}
//                     </div>
//                     <div className="flex-1 flex mx-4">
//                       <div className="text-sm font-medium w-32 text-gray-700">
//                         {intern.name}
//                       </div>
//                       <div className="text-sm text-gray-500 flex-1">
//                         {intern.email}
//                       </div>
//                     </div>
//                     <div>
//                       <input
//                         type="checkbox"
//                         checked={selectedInterns.includes(intern.id)}
//                         onChange={() => handleToggleIntern(intern.id)}
//                         className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all duration-200 accent-blue-500"
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-center px-6 py-4 bg-gray-50/50 border-t border-gray-100">
//           <button
//             onClick={handleSubmit}
//             className="px-8 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Tạo mới
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateInternshipModal;
