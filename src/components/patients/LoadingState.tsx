
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-medical" />
      <p className="mt-4 text-lg">جاري تحميل البيانات...</p>
    </div>
  );
};

export default LoadingState;
