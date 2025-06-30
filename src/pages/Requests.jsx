import React, { useState, useEffect } from "react";
import axios from "axios";
import useGetProfile from "../../hooks/useGetProfile";
import { Dialog } from "@headlessui/react";
import { launchRazorpay } from "./Bill/RazorpayPayment";
import { useNavigate } from "react-router-dom";

import { FaRupeeSign, FaMoneyBillWave, FaClock, FaCheckCircle } from 'react-icons/fa';
import { MdDescription, MdPayment, MdClose } from 'react-icons/md';
import {
  FiCheckCircle,
  FiClock,
  FiClipboard,
  FiHome,
  FiMenu,
  FiX,
} from "react-icons/fi";
const razorpayKey = "rzp_test_8DZW71KgzJGwuY";




const STATUS_FILTERS = [
  { label: "Overview", value: "all", icon: FiHome },
  { label: "Pending", value: "Pending", icon: FiClock },
  { label: "Scheduled", value: "Scheduled", icon: FiClipboard },
  { label: "Completed", value: "Completed", icon: FiCheckCircle },
];

const Requests = () => {


  const [otpModalOpen, setOtpModalOpen] = useState(false);
const [currentOtp, setCurrentOtp] = useState(null);




  const [billsMap, setBillsMap] = useState({});
const navigate = useNavigate();

  const [selectedBill, setSelectedBill] = useState(null);
const [billModalOpen, setBillModalOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const { data: profile, loading, error } = useGetProfile();
const handleGetBill = async (bookingId) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/bills/getbill/${bookingId}`);
    setSelectedBill(res.data);
    setBillModalOpen(true);
  } catch (error) {
    console.error("Error fetching bill:", error);
  }
};

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings/requests", {
        withCredentials: true,
      });
     setBookings(
  res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
);

    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchBills = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bills/allBills", {
        withCredentials: true,
      });

      const billsArray = res.data;
      const billMap = {};

      billsArray.forEach((bill) => {
        billMap[bill.bookingId] = bill;
      });

      setBillsMap(billMap);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  fetchBookings();
  fetchBills(); // <- new call
}, []);


  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <div className="p-4 text-center">Loading profile...</div>;
  if (error) return <div className="p-4 text-center text-red-600">Error loading profile!</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-orange-500 font-semibold";
      case "Scheduled":
        return "text-green-600 font-semibold";
      case "Completed":
        return "text-blue-600 font-semibold";
      default:
        return "text-gray-700";
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      await axios.put(
        "http://localhost:5000/api/bookings/mark-completed",
        { bookingId: id },
        { withCredentials: true }
      );
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, isCompleted: true } : b))
      );
    } catch (error) {
      console.error("Error marking booking complete:", error);
    }
  };

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-r from-fuchsia-50 to-purple-300 transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <button
          className="p-4 focus:outline-none hover:bg-orange-300"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <FiX className="h-6 w-6 mx-auto text-orange-100" />
          ) : (
            <FiMenu className="h-6 w-6 mx-auto" />
          )}
        </button>

        {sidebarOpen && (
          <nav className="flex flex-col mt-6 space-y-2 px-4 text-sm font-semibold">
            {STATUS_FILTERS.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`flex items-center space-x-3 px-3 py-2 rounded hover:bg-purple-300 focus:outline-none ${
                  filter === value ? "bg-purple-500" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-x-auto">
        {filteredBookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="overflow-x-auto shadow rounded bg-white">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-purple-100 text-purple-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    Person Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    Helper Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    Service
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    City
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    Date
                  </th>
                  {filter === "Scheduled" && (
                    <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                      Mark Completed
                    </th>
                    
                  )}
                  {filter === "Completed" && (
  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
    Bill
  </th>
)}

                </tr>
              </thead>

              <tbody className="divide-y divide-purple-200">
                {filteredBookings.map((booking) => {
                  const now = new Date();
                  const bookingDateTime = new Date(booking.date);
                  if (booking.time) {
                    const [hours, minutes] = booking.time.split(":").map(Number);
                    bookingDateTime.setHours(hours, minutes, 0, 0);
                  }

                  const isEligibleToMarkComplete =
                    booking.status === "Scheduled" &&
                    bookingDateTime <= now &&
                    !booking.isCompleted;

                  return (
                    <tr
                      key={booking._id}
                      className="hover:bg-purple-50 transition-colors"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">{booking.personName}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {typeof booking.helper === "object" && booking.helper !== null
                          ? booking.helper.name || "N/A"
                          : booking.helper || "N/A"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{booking.service}</td>
                      <td className={`px-4 py-2 whitespace-nowrap ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{booking.city}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
{filter === "Completed" && (
  <td className="px-4 py-2 whitespace-nowrap">
    {billsMap[booking._id]?.paymentStatus === "Paid" ? (
      <span className="text-green-600 font-semibold p-2">Paid</span>
    ) : (
      <button
        onClick={() => handleGetBill(booking._id)}
        className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded shadow"
      >
        Get Bill
      </button>
    )}
  </td>
)}


                      {filter === "Scheduled" && (
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                  {isEligibleToMarkComplete ? (
  <button
   onClick={async () => {
  try {
    const res = await axios.put(
      "http://localhost:5000/api/bookings/mark-completed",
      { bookingId: booking._id },
      { withCredentials: true }
    );

    setCurrentOtp(res.data.otp); // <-- set actual OTP
    setOtpModalOpen(true);

    setBookings((prev) =>
      prev.map((b) =>
        b._id === booking._id ? { ...b, isCompleted: true } : b
      )
    );
  } catch (error) {
    console.error("Error marking booking complete:", error);
    alert("Failed to mark as completed.");
  }
}}

    className="bg-purple-500 hover:bg-purple-600 text-white text-sm px-3 py-1 rounded shadow"
  >
    Mark as Completed
  </button>
) : booking.isCompleted ? (
  <div className="relative w-6 h-6 mx-auto">
    <input
      type="checkbox"
      checked={true}
      disabled
      className="absolute w-6 h-6 opacity-0 cursor-default"
    />
    <div className="w-6 h-6 rounded border-2 border-green-500 flex items-center justify-center bg-green-100">
      <svg
        className="w-5 h-5 text-green-600 animate-ping-once"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  </div>
) : (
  "-"
)}

                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
<Dialog open={billModalOpen} onClose={() => setBillModalOpen(false)} className="relative z-50">
  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-gradient-to-br from-white to-purple-50 p-6 shadow-2xl space-y-5">
      <Dialog.Title className="text-xl font-bold text-purple-800 flex items-center gap-2">
        <FaMoneyBillWave className="text-purple-600" /> Bill Details
      </Dialog.Title>

    {selectedBill ? (
  <div className="space-y-6 text-[15px] text-gray-800">
    {/* Section 1: Work Info */}
    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
      <h3 className="text-purple-700 font-semibold mb-2">🛠️ Work Summary</h3>
      <p className="flex items-center gap-2"><MdDescription className="text-purple-600" /><strong>Description:</strong> {selectedBill.description}</p>
      <p className="flex items-center gap-2"><FaClock className="text-purple-600" /><strong>Total Hours:</strong> {selectedBill.totalHours}</p>
      <p className="flex items-center gap-2"><FaRupeeSign className="text-purple-600" /><strong>Rate per Hour:</strong> ₹{selectedBill.ratePerHour}</p>
    </div>

    {/* Section 2: Payment Breakdown */}
    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
      <h3 className="text-purple-700 font-semibold mb-2">💸 Billing Breakdown</h3>
      <p className="flex items-center gap-2"><FaRupeeSign className="text-purple-600" /><strong>Base Amount:</strong> ₹{selectedBill.baseAmount}</p>
      <p className="flex items-center gap-2"><FaRupeeSign className="text-purple-600" /><strong>Platform Fee:</strong> ₹{selectedBill.userPlatformFee}</p>
      <p className="flex items-center gap-2"><FaCheckCircle className="text-green-600" /><strong>Total:</strong> ₹{selectedBill.totalAmountPaid}</p>
    </div>

    {/* Section 3: Payment Details */}
    <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
      <h3 className="text-purple-700 font-semibold mb-2">🧾 Payment Info</h3>
      <p className="flex items-center gap-2"><MdPayment className="text-purple-600" /><strong>Payment Mode:</strong> {selectedBill.paymentMode}</p>
      <p className="flex items-center gap-2"><MdPayment className="text-purple-600" /><strong>Status:</strong> {selectedBill.paymentStatus}</p>
    </div>
  </div>
) : (
  <p className="text-gray-500">Loading bill...</p>
)}


      <div className="pt-4 flex justify-end space-x-3">
        <button
          onClick={() => setBillModalOpen(false)}
          className="flex items-center gap-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          <MdClose /> Close
        </button>

        <button
          onClick={async () => {
            try {
              const res = await axios.post("http://localhost:5000/api/payment/create-order", {
                bookingId: selectedBill.bookingId,
              });

              const { order } = res.data;

              launchRazorpay({
                order_id: order.id,
                amount: order.amount,
                currency: order.currency,
                bookingId: selectedBill.bookingId,
                name: profile?.name || "HelpNest User",
                description: selectedBill.description || "HelpNest Service",
                onSuccess: (updatedBill) => {
                  console.log("✅ Payment succeeded, navigating to summary with bill:", updatedBill);
                  navigate("/bill-summary", { state: { bill: updatedBill } });
                },
              });
            } catch (err) {
              console.error("Payment failed", err);
              alert("Could not start Razorpay");
            }
          }}
          className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          💸 Pay
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>



<Dialog open={otpModalOpen} onClose={() => setOtpModalOpen(false)} className="relative z-50">
  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl space-y-4 border border-purple-300">
      <Dialog.Title className="text-lg font-bold text-purple-700 text-center">
        Share this OTP with the Helper
      </Dialog.Title>
      <p className="text-3xl text-center font-mono text-purple-800 tracking-widest">
        {currentOtp}
      </p>
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setOtpModalOpen(false)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition"
        >
          OK
        </button>
      </div>
    </Dialog.Panel>
  </div>
</Dialog>

      </main>
    </div>
  );
};

export default Requests;
