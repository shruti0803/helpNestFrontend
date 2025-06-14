import { useState, useEffect } from "react";
import axios from "axios";
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
        setTasks(response.data.bookings);
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
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-r from-fuchsia-50 to-purple-300 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <button
          className="p-4 hover:bg-orange-300 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
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
        <td className="p-2">{formattedDate}</td> {/* Only date shown */}
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
  <td className="p-2">
    {task.isCompleted && (
      <button
        className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
        onClick={() => {
          setShowBillModal(true);
          setSelectedBooking(task); // Track which task was clicked
        }}
      >
        Generate Bill
      </button>
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
      </main>
    </div>
  );
};

export default TasksPage;
