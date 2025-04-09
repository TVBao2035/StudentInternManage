import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const AssigmentLeaderModal = ({ isOpen, onClose, intern, onSubmit }) => {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [availableMentors, setAvailableMentors] = useState([]);
  const [internName, setInternName] = useState("");
  const [internEmail, setInternEmail] = useState("");

  useEffect(() => {
    if (intern) {
      setInternName(intern.name || "");
      setInternEmail(intern.email || "");
      if (intern.mentor) {
        setSelectedMentor(intern.mentor);
      }
    }

    const mockMentors = [
      {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
      },
      {
        id: 2,
        name: "Trần Thị B",
        email: "tranthib@gmail.com",
      },
      {
        id: 3,
        name: "Lê Văn C",
        email: "levanc@gmail.com",
      },
    ];
    setAvailableMentors(mockMentors);
    if (!selectedMentor && mockMentors.length > 0) {
      setSelectedMentor(mockMentors[0]);
    }
  }, [intern]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const assigmentData = {
      internId: intern.id,
      internName: internName,
      internEmail: internEmail,
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      mentorEmail: selectedMentor.email,
    };
    onSubmit(assigmentData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-blue-600 tracking-wide">Phân công</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-full hover:bg-gray-100 p-1"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-8 pb-8 pt-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 tracking-wide">
                Họ tên
              </label>
              <input
                type="text"
                value={internName}
                readOnly
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={internEmail}
                readOnly
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2 tracking-wide">
                Người hướng dẫn
              </label>
              <div className="relative">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden hover:border-blue-200 transition-colors duration-200">
                  <div className="flex-grow px-4 py-2.5">
                    {selectedMentor ? (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{selectedMentor.name}</span>
                        <span className="text-sm text-blue-600">
                          {selectedMentor.email}
                        </span>
                      </div>
                    ) : (
                      "Chọn người hướng dẫn"
                    )}
                  </div>
                  <div className="px-4">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <select
                  value={selectedMentor ? `${selectedMentor.id}` : ""}
                  onChange={(e) => {
                    const mentorId = parseInt(e.target.value);
                    const mentor = availableMentors.find(
                      (m) => m.id === mentorId
                    );
                    setSelectedMentor(mentor);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                >
                  {availableMentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.name} - {mentor.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-12 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-200"
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssigmentLeaderModal;

// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";

// const AssigmentLeaderModal = ({ isOpen, onClose, intern, onSubmit }) => {
//   const [selectedMentor, setSelectedMentor] = useState(null);
//   const [availableMentors, setAvailableMentors] = useState([]);
//   const [internName, setInternName] = useState("");
//   const [internEmail, setInternEmail] = useState("");
//   useEffect(() => {
//     if (intern) {
//       setInternName(intern.name || "");
//       setInternEmail(intern.email || "");
//       if (intern.mentor) {
//         setSelectedMentor(intern.mentor);
//       }
//     }

//     const mockMentors = [
//       {
//         id: 1,
//         name: "Nguyễn Văn A",
//         email: "nguyenvana@gmail.com",
//       },
//       {
//         id: 2,
//         name: "Trần Thị B",
//         email: "tranthib@gmail.com",
//       },
//       {
//         id: 3,
//         name: "Lê Văn C",
//         email: "levanc@gmail.com",
//       },
//     ];
//     setAvailableMentors(mockMentors);
//     if (!selectedMentor && mockMentors.length > 0) {
//       setSelectedMentor(mockMentors[0]);
//     }
//   }, [intern]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const assigmentData = {
//       internId: intern.id,
//       internName: internName,
//       internEmail: internEmail,
//       mentorId: selectedMentor.id,
//       mentorName: selectedMentor.name,
//       mentorEmail: selectedMentor.email,
//     };
//     onSubmit(assigmentData);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
//         <div className="flex justify-between items-center px-6 py-4">
//           <h2 className="text-xl font-medium text-blue-600">Phân công</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="px-6 pb-8 pt-2">
//           <div className="grid grid-cols-2 gap-x-4 gap-y-6">
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Họ tên
//               </label>
//               <input
//                 type="text"
//                 value={internName}
//                 readOnly
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={internEmail}
//                 readOnly
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none"
//               />
//             </div>

//             <div className="col-span-2">
//               <label className="block text-gray-700 font-medium mb-2">
//                 Người hướng dẫn
//               </label>
//               <div className="relative">
//                 <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
//                   <div className="flex-grow px-3 py-2">
//                     {selectedMentor ? (
//                       <div className="flex justify-between items-center">
//                         <span>{selectedMentor.name}</span>
//                         <span className="text-sm text-red-500">
//                           {selectedMentor.email}
//                         </span>
//                       </div>
//                     ) : (
//                       "Chọn người hướng dẫn"
//                     )}
//                   </div>
//                   <div className="px-3">
//                     <svg
//                       className="h-5 w-5 text-gray-400"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//                 <select
//                   value={selectedMentor ? `${selectedMentor.id}` : ""}
//                   onChange={(e) => {
//                     const mentorId = parseInt(e.target.value);
//                     const mentor = availableMentors.find(
//                       (m) => m.id === mentorId
//                     );
//                     setSelectedMentor(mentor);
//                   }}
//                   className="absolute inset-0 opacity-0 cursor-pointer w-full"
//                 >
//                   {availableMentors.map((mentor) => (
//                     <option key={mentor.id} value={mentor.id}>
//                       {mentor.name} - {mentor.email}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-center mt-8">
//             <button
//               onClick={handleSubmit}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-10 rounded-md transition-colors duration-200 focus:outline-none"
//             >
//               Lưu
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssigmentLeaderModal;
