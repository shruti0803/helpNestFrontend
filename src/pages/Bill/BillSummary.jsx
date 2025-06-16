import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import BillContent from "./BillContent";

const BillSummary = () => {
  const location = useLocation();
  const [bill, setBill] = useState(null);

  const printRef = useRef(); // ✅ MAKE SURE this is defined before useReactToPrint

  // Set bill from navigation state
  useEffect(() => {
    if (location.state?.bill) {
      console.log("📥 Setting bill from location.state");
      setBill(location.state.bill);
    }
  }, [location.state]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `HelpNest_Bill_${bill?.bookingId || "Summary"}`,
    removeAfterPrint: true,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-20 flex flex-col items-center">
      {bill ? (
        <>
          <BillContent ref={printRef} bill={bill} />
          <button
            onClick={handlePrint}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded shadow-md"
          >
            Download / Print Summary
          </button>
        </>
      ) : (
        <p className="p-10 text-lg text-gray-600">No bill found</p>
      )}
    </div>
  );
};

export default BillSummary;
