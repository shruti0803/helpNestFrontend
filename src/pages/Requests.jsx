import React, { useState, useEffect } from "react";
import axios from "axios";
import useGetProfile from "../../hooks/useGetProfile";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const { data: profile, loading, error } = useGetProfile();
   
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
  if (error)
    return (
      <div className="p-4 text-center text-red-600">Error loading profile!</div>
    );

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

  return (
    <div className="flex min-h-screen pt-16  ">
      {/* Sidebar */}
      <div
        className={`bg-gradient-to-r from-fuchsia-50 to-purple-300  transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <button
          className="p-4  focus:outline-none hover:bg-orange-300"
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
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-200">
                {filteredBookings.map((booking) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Requests;
