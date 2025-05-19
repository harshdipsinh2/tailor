import React from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";


const SimplePaymentDone = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="text-white" size={32} strokeWidth={3} />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800">Payment Done!</h2>

        {/* Subtext */}
        <p className="text-gray-600 text-sm">
          Thank you for completing your secure online payment.
        </p>
        <p className="text-gray-600 text-sm">Have a great day!</p>

        {/* Go Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold text-sm"
        >
          GO BACK
        </button>
      </div>
    </div>
  );
};

export default SimplePaymentDone;
