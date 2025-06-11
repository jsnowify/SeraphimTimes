import React from "react";

const ArticleSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-none border border-black mb-6 animate-pulse">
      <div className="h-7 bg-gray-300 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>

      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>

      <div className="mt-6 flex space-x-4">
        <div className="h-10 w-20 bg-gray-300 rounded"></div>
        <div className="h-10 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default ArticleSkeleton;
