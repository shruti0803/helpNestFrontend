import React, { useState, useEffect } from "react";
import axios from "axios";
import useGetProfile from "../../hooks/useGetProfile";
import { Dialog } from "@headlessui/react";
import { launchRazorpay } from "./Bill/RazorpayPayment";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify"; // if you're using toast
import { FaRupeeSign, FaMoneyBillWave, FaClock, FaCheckCircle } from 'react-icons/fa';
import { MdDescription, MdPayment, MdClose } from 'react-icons/md';
import Swal from "sweetalert2";

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


const submitReport = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/reports/create",
      {
        bookingId: reportDetails.bookingId,
        reason: reportDetails.reason,
        details: reportDetails.details,
      },
      { withCredentials: true }
    );

    setShowReportModal(false);
    Swal.fire("Report Submitted", "Your report has been submitted.", "success");
  } catch (err) {
    console.error(err);
    toast.error(err.response?.data?.message || "Failed to submit report");
  }
};

  const [billsMap, setBillsMap] = useState({});
const navigate = useNavigate();

  const [selectedBill, setSelectedBill] = useState(null);
const [billModalOpen, setBillModalOpen] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const { data: profile, loading, error } = useGetProfile();
const moodEmojis = ["😠", "😢", "😐", "🙂", "😄"];
const [openActionMenu, setOpenActionMenu] = useState(null);

const [showReportModal, setShowReportModal] = useState(false);
const [reportDetails, setReportDetails] = useState({ reason: "", details: "", bookingId: null });

const openReportModal = (booking) => {
  const existingReport = reportedBookings.get(String(booking._id));
  if (existingReport) {
    // Set with existing values so modal shows correct content
    setReportDetails({
      reason: existingReport.reason,
      details: existingReport.details,
      bookingId: booking._id,
    });
  } else {
    setReportDetails({
      reason: "",
      details: "",
      bookingId: booking._id,
    });
  }
  setShowReportModal(true);
};


const [existingRating, setExistingRating] = useState(false);
const [showRatingModal, setShowRatingModal] = useState(false);
const [selectedBookingId, setSelectedBookingId] = useState(null);
const [rating, setRating] = useState(1);
const [comment, setComment] = useState("");
const [reviewedBookings, setReviewedBookings] = useState(new Map());
const [reportedBookings, setReportedBookings] = useState(new Map());




const openRatingModal = (bookingId) => {
  setSelectedBookingId(bookingId);

  const existingReview = reviewedBookings.get(bookingId);
  if (existingReview) {
    setRating(existingReview.rating);
    setComment(existingReview.comment);
    setExistingRating(true);
  } else {
    setRating(0);
    setComment("");
    setExistingRating(false);
  }

  setShowRatingModal(true);
};

const handleSubmitRating = async () => {
  try {
    console.log("Sending Review:", {
  bookingId: selectedBookingId,
  rating,
  comment,
});
    await axios.post(
      "http://localhost:5000/api/reviews",
      {
        bookingId: selectedBookingId,
        rating,
        comment,
      },
      { withCredentials: true }
    );
   setReviewedBookings((prev) => {
  const updated = new Map(prev);
  updated.set(selectedBookingId, { rating, comment });
  return updated;
});

    setShowRatingModal(false);
    await Swal.fire({
      icon: 'success',
      title: 'Thank you!',
      text: 'Your rating has been submitted successfully.',
      confirmButtonColor: '#6B46C1',
    });
  } catch (err) {
    toast.error(err.response?.data?.message || "Review submission failed");
  }
};
const fetchReportedBookings = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/reports/by-user", {
      withCredentials: true,
    });
console.log(res);
    const reportMap = new Map();
    res.data.forEach((r) => {
  console.log("bookingId in report:", r.booking, typeof r.booking);
reportMap.set(String(r.booking), {
  reason: r.reason,
  details: r.details,
  status: r.status,
  adminNote: r.adminNote,
});

    });

    setReportedBookings(reportMap); // store full report object instead of Set
  } catch (err) {
    console.error("Failed to fetch reported bookings", err);
  }
};



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
  const fetchReviewedBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reviews/by-user", {
        withCredentials: true,
      });

     const reviewMap = new Map();
res.data.forEach((r) => {
  console.log("Fetched Review:", r); // should show bookingId
  reviewMap.set(String(r.bookingId), {
    rating: r.rating,
    comment: r.comment,
  });
});
console.log("Review Map Keys:", [...reviewMap.keys()]);
setReviewedBookings(reviewMap);

    } catch (err) {
      console.error("Failed to fetch reviewed bookings", err);
    }
  };

  fetchReviewedBookings();
  fetchReportedBookings();
}, []);


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
const report = reportedBookings.get(String(reportDetails.bookingId));

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
    <div className="flex font-inter min-h-screen pt-16">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-r from-fuchsia-50 to-purple-300 transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <button
          className="p-4 focus:outline-none hover:bg-purple-300"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <FiX className="h-6 w-6 mx-auto text-purple-100" />
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
               {filter === "Completed" && (
  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
    Actions
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
                    !booking.isCompleted && booking.hasArrived;

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
  <>
    {/* Bill column */}
    <td className="px-4 py-2 whitespace-nowrap relative">
      {billsMap[booking._id]?.paymentStatus === "Paid" ? (
        <span className="text-green-600 font-semibold">Paid</span>
      ) : (
        <button
          onClick={() => handleGetBill(booking._id)}
          className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded shadow"
        >
          Get Bill
        </button>
      )}
    </td>

    {/* Three dots column */}
    {/* Three dots column */}
<td className="px-4 py-2 whitespace-nowrap text-center relative">
  <button
    onClick={() =>
      setOpenActionMenu(openActionMenu === booking._id ? null : booking._id)
    }
    disabled={
      booking.status !== "Completed" ||
      billsMap[booking._id]?.paymentStatus !== "Paid"
    }
    className={`text-xl px-2 py-1 rounded-full ${
      booking.status !== "Completed" ||
      billsMap[booking._id]?.paymentStatus !== "Paid"
        ? "text-gray-400 cursor-not-allowed"
        : "text-gray-700 hover:text-purple-600"
    }`}
    title="More actions"
  >
    ⋮
  </button>

 {openActionMenu === booking._id &&
  booking.status === "Completed" &&
  billsMap[booking._id]?.paymentStatus === "Paid" && (
   <div className="absolute left-1/2 -translate-x-1/2 top-8 w-20 bg-white border rounded shadow z-50 flex flex-col">

      <button
        className="w-full px-4 py-2 text-left text-sm hover:bg-purple-100"
        onClick={() => {
          openRatingModal(booking._id);
          setOpenActionMenu(null);
        }}
      >
        Rate
      </button>
    <button
  className={`w-full px-4 py-2 text-left text-sm ${
    reportedBookings.has(String(booking._id))
      ? "text-gray-500 cursor-pointer hover:bg-gray-100"
      : "hover:bg-red-100"
  }`}
  onClick={() => {
    openReportModal(booking);
    setOpenActionMenu(null);
  }}
>
  {reportedBookings.has(String(booking._id)) ? "View Report" : "Report"}
</button>


    </div>
)}

</td>

  </>
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
{showRatingModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
      <h2 className="text-xl font-semibold mb-4 text-purple-700">
        {existingRating ? "Your Review" : "Rate the Service"}
      </h2>

    <div className="text-6xl text-center mb-4 transition-all">
  {rating > 0 ? moodEmojis[rating - 1] : "🤔"}
</div>

<div className="flex justify-center gap-2 mb-4">
  {[1, 2, 3, 4, 5].map((star) => (
  <button
  key={star}
  onClick={() => !existingRating && setRating(star)}
  onMouseEnter={() => !existingRating && setRating(star)}
  disabled={existingRating}
  className={`text-3xl transition-transform ${
    rating >= star ? "text-yellow-500" : "text-gray-300"
  } ${!existingRating ? "hover:scale-125" : ""}`}
>
  <FaStar />
</button>

  ))}
</div>


      <textarea
        placeholder="Write your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-gray-300 rounded p-2 mb-4"
        rows={4}
        readOnly={existingRating}
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowRatingModal(false)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Close
        </button>
        {!existingRating && (
          <button
            onClick={handleSubmitRating}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Submit
          </button>
        )}


      </div>
    </div>
  </div>
)}
{showReportModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
      {reportedBookings.has(String(reportDetails.bookingId)) ? (
       <>
  <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800 gap-2">
    <FiClipboard className="text-purple-600" /> Already Reported
  </h2>

  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-2 text-sm">
    <p className="flex items-start gap-2">
      <MdDescription className="text-gray-600 mt-1" />
      <span><strong>Reason:</strong> {report.reason}</span>
    </p>

    <p className="flex items-start gap-2">
      <MdDescription className="text-gray-600 mt-1" />
      <span><strong>Details:</strong> {report.details || "No additional details"}</span>
    </p>

    <p className="flex items-start gap-2">
      <FiClock className="text-gray-600 mt-1" />
   <span className={`px-2 py-1 rounded-full text-xs font-medium
  ${report.status === 'resolved' ? 'bg-green-100 text-green-700' :
    report.status === 'rejected' ? 'bg-red-100 text-red-700' :
    'bg-yellow-100 text-yellow-700'}
`}>
  {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
</span>


    </p>

    {report.status !== "pending" && (
      <p className="flex items-start gap-2">
        <FiCheckCircle className="text-green-600 mt-1" />
        <span><strong>Admin Note:</strong> {report.adminNote || "No note provided"}</span>
      </p>
    )}
  </div>

  <div className="flex justify-end">
    <button
      onClick={() => setShowReportModal(false)}
      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
    >
      Close
    </button>
  </div>
</>

      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4 text-red-600">Report the Helper</h2>

          <label className="block mb-2 text-sm font-medium">Reason</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded p-2 mb-4"
            placeholder="Short reason"
            value={reportDetails.reason}
            onChange={(e) =>
              setReportDetails({ ...reportDetails, reason: e.target.value })
            }
          />

          <label className="block mb-2 text-sm font-medium">Details</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2 mb-4"
            rows={4}
            placeholder="Additional details (optional)"
            value={reportDetails.details}
            onChange={(e) =>
              setReportDetails({ ...reportDetails, details: e.target.value })
            }
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowReportModal(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={submitReport}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Submit Report
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

      </main>


    </div>
  );
};

export default Requests;
