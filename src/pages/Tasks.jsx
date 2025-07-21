import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import useGetHelperProfile from "../../hooks/useGetHelperProfile";
import BillModal from "./Bill/BillModal";
import {
  FiCheckCircle,
  FiClock,
  FiClipboard,
  FiHome,
  FiMenu,
  FiX,
} from "react-icons/fi";

const STATUS_FILTERS = [
 
  { label: "Pending", value: "pending", icon: FiClock },
  { label: "Scheduled", value: "scheduled", icon: FiClipboard },
  { label: "Completed", value: "completed", icon: FiCheckCircle },
];

const TasksPage = () => {
  const [otpModalOpen, setOtpModalOpen] = useState(false);
const [enteredOtp, setEnteredOtp] = useState("");
const [otpError, setOtpError] = useState("");

   const [showBillModal, setShowBillModal] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);

  const { helper } = useGetHelperProfile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  const fetchTasks = async () => {
    try {
      const endpoint =
        activeTab === "pending"
          ? "http://localhost:5000/api/bookings/tasks"
          : activeTab === "scheduled"
          ? "http://localhost:5000/api/bookings/scheduled"
          : "http://localhost:5000/api/bookings/completed";

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      if (Array.isArray(response.data.bookings)) {
       setTasks(
  response.data.bookings.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
);

      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    if (helper) {
      fetchTasks();
    }
  }, [activeTab, helper]);

  const handleAccept = async (id) => {
    try {
      await axios.put(
        "http://localhost:5000/api/bookings/schedule",
        { bookingId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      fetchTasks();
    } catch (error) {
      console.error("Error updating schedule:", error);
    }
  };

  return (
    <div className="flex font-inter min-h-screen pt-16">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-r from-fuchsia-50 to-purple-300 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <button
          className="p-4 hover:bg-purple-300 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
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
                onClick={() => setActiveTab(value)}
                className={`flex items-center space-x-3 px-3 py-2 rounded hover:bg-purple-300 focus:outline-none ${
                  activeTab === value ? "bg-purple-500 text-white" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-6 text-purple-800">Task List</h1>

        {tasks.length === 0 ? (
          <p className="text-gray-600">No tasks available.</p>
        ) : (
          <div className="overflow-x-auto shadow rounded bg-white">
            <table className="min-w-full divide-y divide-purple-200 text-sm text-left">
             <thead className="bg-purple-100 text-purple-900">
  <tr>
    <th className="p-2">Work</th>
    <th className="p-2">Person Name</th>
    <th className="p-2">Phone</th>
    <th className="p-2">Address</th>
    <th className="p-2">City</th>
    <th className="p-2">Date</th> {/* Only date shown */}
    <th className="p-2">Time</th>
    <th className="p-2">Status</th>
    {activeTab === "pending" && <th className="p-2">Actions</th>}
    {activeTab === "scheduled" && <th className="p-2">Actions</th>}
  </tr>
</thead>

             <tbody className="divide-y divide-gray-200">
  {tasks.map((task) => {
   const dateOnly = task.date.split("T")[0]; // "2025-06-10"
const bookingDateTime = new Date(`${dateOnly}T${task.time}`);
const now = new Date();



    const formattedDate = new Date(task.date).toLocaleDateString("en-IN");

    return (
      <tr key={task._id} className="hover:bg-purple-50">
        <td className="p-2">{task.service}</td>
        <td className="p-2">{task.personName || "N/A"}</td>
        <td className="p-2">{task.phone || "N/A"}</td>
        <td className="p-2">{task.address || "N/A"}</td>
        <td className="p-2">{task.city || "N/A"}</td>
        <td className="p-2">{formattedDate}</td> 
        <td className="p-2">{task.time} </td>
        
        <td
          className={`p-2 font-medium ${
            task.status === "Pending"
              ? "text-orange-500"
              : task.status === "Scheduled"
              ? "text-green-600"
              : task.status === "Completed"
              ? "text-blue-600"
              : "text-gray-700"
          }`}
        >
          {task.status}
        </td>

        {activeTab === "pending" && (
          <td className="p-2 space-x-2">
            <button
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => handleAccept(task._id)}
            >
              Accept
            </button>
          </td>
        )}
{activeTab === "scheduled" && (
  <td className="p-2 flex items-center justify-center">
    {task.isCompleted ? (
      task.otpVerified ? (
        <button
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
          onClick={() => {
            setShowBillModal(true);
            setSelectedBooking(task);
          }}
        >
          Generate Bill
        </button>
      ) : (
       <button
  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 "

          onClick={() => {
            setSelectedBooking(task);
            setOtpModalOpen(true);
            setEnteredOtp("");
            setOtpError("");
          }}
        >
          Verify OTP
        </button>
      )
    ) : (
     task.hasArrived ? (
  <span className="px-3 py-1 text-blue-700 font-semibold">Reached</span>
) : (
  <button
    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
    onClick={() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              await axios.put(
                `http://localhost:5000/api/bookings/update-helper-location/${task._id}`,
                { lat: latitude, lng: longitude },
                { withCredentials: true }
              );

              const res = await axios.post(
                `http://localhost:5000/api/bookings/check-arrival/${task._id}`,
                {},
                { withCredentials: true }
              );

              if (res.data.arrived) {
                Swal.fire({
                  icon: "success",
                  title: "You’ve arrived at the location!",
                  showConfirmButton: false,
                  timer: 1500,
                });

                setTasks((prev) =>
                  prev.map((b) =>
                    b._id === task._id ? { ...b, hasarrived: true } : b
                  )
                );
              } else {
                alert(`🛣 You are still ${Math.round(res.data.distance)}m away.`);
              }
            } catch (err) {
              console.error(err);
              alert("❌ Failed to share or verify location.");
            }
          },
          () => {
            alert("❌ Location permission denied.");
          }
        );
      } else {
        alert("❌ Geolocation not supported.");
      }
    }}
  >
    Verify Location
  </button>
)

    )}
  </td>
)}


      </tr>
    );
  })}
</tbody>

            </table>

            {showBillModal && selectedBooking && (
<BillModal
  isOpen={showBillModal}
  booking={selectedBooking} // ✅ pass as booking
  onClose={() => {
    setShowBillModal(false);
    setSelectedBooking(null);
  }}
/>


)}

          </div>
        )}
        {otpModalOpen && selectedBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
      <h2 className="text-lg font-bold mb-4 text-purple-700 text-center">
        Enter OTP Provided by User
      </h2>
      <input
        type="text"
        value={enteredOtp}
        onChange={(e) => setEnteredOtp(e.target.value)}
        maxLength={6}
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-xl tracking-widest"
        placeholder="Enter OTP"
      />
      {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setOtpModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
         onClick={async () => {
  try {
    const res = await axios.put(
      "http://localhost:5000/api/bookings/verify-otp",
      {
        bookingId: selectedBooking._id,
        enteredOtp,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      }
    );

    // ✅ Update task list with verified OTP
    const updatedTasks = tasks.map((task) =>
      task._id === selectedBooking._id
        ? { ...task, otpVerified: true }
        : task
    );
    setTasks(updatedTasks);
    setOtpModalOpen(false);
    Swal.fire({
  icon: "success",
  title: "OTP Verified ✅",
  showConfirmButton: false,
  timer: 1500,
});
  } catch (err) {
    console.error("OTP verification failed:", err);
    setOtpError("❌ Invalid OTP. Please try again.");
  }
}}

        >
          Verify
        </button>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
};

export default TasksPage;
