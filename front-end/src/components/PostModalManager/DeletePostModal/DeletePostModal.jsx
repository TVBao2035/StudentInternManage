import React, { useState, useEffect, useCallback } from "react";
import { HiExclamationTriangle } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const DeletePostModal = ({ isOpen, onClose, postId, postTitle, onConfirm }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm(postId);
      onClose();
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div
              role="dialog"
              aria-labelledby="modal-title"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[95vw] max-w-2xl p-4 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                  <HiExclamationTriangle className="text-4xl text-red-500 dark:text-red-400 animate-pulse" />
                </div>
              </div>
              <h2
                id="modal-title"
                className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-white tracking-tight"
              >
                Xác nhận xóa
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4 max-w-lg mx-auto">
                Bạn có chắc chắn muốn xóa bài đăng "{postTitle}"?
              </p>
              <div className="flex flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleDelete}
                  className="px-8 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 min-w-[120px]"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Đang xóa...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-8 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 min-w-[120px]"
                  disabled={isDeleting}
                >
                  Không
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DeletePostModal;

// import React, { useState, useEffect, useCallback } from "react";
// import { HiExclamationTriangle } from "react-icons/hi2";
// import { motion, AnimatePresence } from "framer-motion";

// const DeletePostModal = ({ isOpen, onClose, postId, postTitle, onConfirm }) => {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleKeyDown = useCallback(
//     (e) => {
//       if (e.key === "Escape") onClose();
//     },
//     [onClose]
//   );

//   useEffect(() => {
//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [handleKeyDown]);

//   const handleDelete = async () => {
//     try {
//       setIsDeleting(true);
//       await onConfirm(postId);
//       onClose();
//     } catch (error) {
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
//             onClick={onClose}
//             aria-hidden="true"
//           />
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.95, opacity: 0 }}
//             className="fixed inset-0 flex items-center justify-center z-50"
//           >
//             <div
//               role="dialog"
//               aria-labelledby="modal-title"
//               className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[90vw] max-w-xl p-5"
//             >
//               <div className="flex items-center justify-center mb-4">
//                 <HiExclamationTriangle className="text-4xl text-red-500 animate-pulse" />
//               </div>
//               <h2
//                 id="modal-title"
//                 className="text-xl font-bold text-center mb-4 text-gray-900 dark:text-white"
//               >
//                 Xác nhận xóa
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
//                 Bạn có chắc chắn muốn xóa bài đăng "{postTitle}"? Hành động này
//                 không thể hoàn tác.
//               </p>
//               <div className="flex flex-row gap-4 justify-center">
//                 <button
//                   onClick={handleDelete}
//                   className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//                   disabled={isDeleting}
//                 >
//                   {isDeleting ? (
//                     <>
//                       <svg
//                         className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         />
//                       </svg>
//                       Đang xóa...
//                     </>
//                   ) : (
//                     "Xác nhận"
//                   )}
//                 </button>
//                 <button
//                   onClick={onClose}
//                   className="px-6 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
//                   disabled={isDeleting}
//                 >
//                   Không
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default DeletePostModal;
