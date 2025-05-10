import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 border-opacity-90 shadow-xl"></div>
    </div>
  );

  // return (
  //   <div className="flex justify-center items-center py-12">
  //     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 shadow-lg"></div>
  //   </div>
  // );
};

export default LoadingSpinner;
