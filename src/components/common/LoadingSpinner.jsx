import React from "react";

// 로딩 중일 때 보여주는 스피너 컴포넌트
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-5 w-5 border-4 border-blue-500 border-t-transparent" />
  </div>
);

export default LoadingSpinner;
