import React, { forwardRef } from "react";

const BillContent = forwardRef(({ bill }, ref) => {
  if (!bill) return null;

  return (
    <div
      ref={ref}
      className="bg-white w-full max-w-2xl shadow-xl p-8 rounded-lg border mx-auto"
    >
      <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">
        HelpNest Bill Summary
      </h1>

      <div className="space-y-4 text-gray-800">
        <p><strong>Booking ID:</strong> {bill.bookingId}</p>
        <p><strong>Description:</strong> {bill.description}</p>
        <p><strong>Total Hours:</strong> {bill.totalHours}</p>
        <p><strong>Rate/hour:</strong> ₹{bill.ratePerHour}</p>
        <p><strong>Base Amount:</strong> ₹{bill.baseAmount}</p>
        <p><strong>Platform Fee:</strong> ₹{bill.userPlatformFee}</p>
        <p className="text-xl font-bold text-purple-800">
          Total Paid: ₹{bill.totalAmountPaid}
        </p>
        <p><strong>Payment Mode:</strong> {bill.paymentMode}</p>
        <p>
          <strong>Payment Status:</strong>
          <span
            className={`ml-2 px-2 py-1 rounded text-white text-sm ${
              bill.paymentStatus === "Paid" ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {bill.paymentStatus}
          </span>
        </p>
      </div>

      <div className="mt-6 border-t pt-4 text-center text-gray-500 text-xs">
        Thank you for using HelpNest ❤️<br />
        Generated on: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
});

export default BillContent;
