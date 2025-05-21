import React from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center text-center space-y-4 bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
        {/* Green Circle with Checkmark */}
        <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg 
          animate-pulse">
          <Check className="text-white" size={28} strokeWidth={3} />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>

        {/* Subtext */}
        <p className="text-gray-700 text-sm">
          Your transaction has been completed successfully.
        </p>

        {/* Homepage Button - Changed text color to black */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-green-600 hover:bg-green-700 text-black font-bold px-8 py-2.5 rounded-full text-base leading-6 shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center min-w-[160px]"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;