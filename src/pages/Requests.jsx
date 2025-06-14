import React, { useState, useEffect } from "react";
import axios from "axios";
import useGetProfile from "../../hooks/useGetProfile";
import { Dialog } from "@headlessui/react";

import {
  FiCheckCircle,
  FiClock,
  FiClipboard,
  FiHome,
  FiMenu,
  FiX,
} from "react-icons/fi";

const STATUS_FILTERS = [
  { label: "Overview", value: "all", icon: FiHome },
  { label: "Pending", value: "Pending", icon: FiClock },
  { label: "Scheduled", value: "Scheduled", icon: FiClipboard },
  { label: "Completed", value: "Completed", icon: FiCheckCircle },
];

const Requests = () => {
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
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
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
    <button
      onClick={() => handleGetBill(booking._id)}
      className="text-sm bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded shadow"
    >
      Get Bill
    </button>
  </td>
)}

                      {filter === "Scheduled" && (
                        <td className="px-4 py-2 whitespace-nowrap text-center">
                          {isEligibleToMarkComplete ? (
                            <input
                              type="checkbox"
                              className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500 transition-transform transform hover:scale-110"
                              onChange={() => handleMarkComplete(booking._id)}
                              title="Mark as complete"
                            />
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
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
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
    <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-xl space-y-4">
      <Dialog.Title className="text-lg font-bold text-purple-800">Bill Details</Dialog.Title>
      {selectedBill ? (
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>Description:</strong> {selectedBill.description}</p>
          <p><strong>Total Hours:</strong> {selectedBill.totalHours}</p>
          <p><strong>Rate per Hour:</strong> ₹{selectedBill.ratePerHour}</p>
          <p><strong>Base Amount:</strong> ₹{selectedBill.baseAmount}</p>
          <p><strong>Platform Fee:</strong> ₹{selectedBill.userPlatformFee}</p>
          <p><strong>Total Paid:</strong> ₹{selectedBill.totalAmountPaid}</p>
          <p><strong>Payment Mode:</strong> {selectedBill.paymentMode}</p>
          <p><strong>Payment Status:</strong> {selectedBill.paymentStatus}</p>
        </div>
      ) : (
        <p className="text-gray-500">Loading bill...</p>
      )}
      <div className="pt-4 text-right">
        <button
          onClick={() => setBillModalOpen(false)}
          className="bg-purple-500 text-white px-4 py-1 rounded hover:bg-purple-600"
        >
          Close
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
