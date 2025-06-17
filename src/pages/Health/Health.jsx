import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPills,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaUserMd,
} from "react-icons/fa";
import AddMedicineModal from "./AddMedicineModal";
import AddAppointmentModal from "./AddAppointmentModal";

export default function Health() {
  const [open, setOpen] = useState(false);
  const [openA, setOpenA] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const getDateRange = () => {
    const range = [];
    const today = new Date();
    for (let i = -5; i <= 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      range.push(d);
    }
    return range;
  };

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  const formatDate = (date) => date.toISOString().split("T")[0];

  const fetchMedicines = async (date) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/health/meds-for-date?date=${formatDate(date)}`,
        { withCredentials: true }
      );
      setMedicines(res.data.tasks || []);
    } catch (err) {
      console.error("❌ Error fetching medicines for date:", err);
      setMedicines([]);
    }
  };

  const fetchAppointments = async (date) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/health/appts-for-date?date=${formatDate(date)}`,
        { withCredentials: true }
      );
      setAppointments(res.data.tasks || []);
    } catch (err) {
      console.error("❌ Error fetching appointments for date:", err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchMedicines(selectedDate);
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  return (
    <div className="p-6 md:p-12">
      <h2 className="text-2xl font-bold text-center mb-8">🩺 Health Schedule</h2>

      {/* Date timeline */}
      <div className="flex overflow-x-auto items-center gap-6 justify-start mb-10 relative pb-6 border-b border-purple-300">
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 transform -translate-y-1/2 z-0 rounded-full"></div>

        {getDateRange().map((date, index) => {
          const isToday = isSameDay(date, new Date());
          const isSelected = isSameDay(date, selectedDate);

          return (
            <div
              key={index}
              onClick={() => setSelectedDate(date)}
              className="relative z-10 pt-2 flex flex-col items-center min-w-[80px] cursor-pointer"
            >
              <div
                className={`rounded-full w-12 h-12 flex items-center justify-center text-sm font-semibold shadow-md border transition ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-700 scale-110"
                    : isToday
                    ? "bg-white text-purple-800 border-purple-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {date.getDate()}
              </div>
              <div className="text-xs mt-1 text-purple-600 font-medium">
                {date.toLocaleDateString("en-US", { month: "short" })}
              </div>
              {isToday && (
                <div className="text-[10px] mt-1 text-green-600 font-bold">Today</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Medicines Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-purple-700">💊 Medicines</h3>
        {medicines.length === 0 ? (
          <p className="text-gray-500">No medicines scheduled for this day.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {medicines.map((med, idx) => (
              <div
                key={idx}
                className="bg-white border border-purple-200 shadow-md rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold text-lg">
                  <FaPills /> {med.name}
                </div>
                <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <FaClock className="text-purple-500" /> Time:{" "}
                  <span className="font-medium text-purple-700">{med.timeSlot}</span>
                </div>
                <div className="text-sm text-gray-600 mb-1">Dosage: {med.dosage}</div>
                <div className="text-sm mt-2 font-medium">
                  Status:{" "}
                  {med.status === "taken" ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <FaCheckCircle /> Taken
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <FaTimesCircle /> Missed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ➕ Add Medicine Button */}
        <button
          onClick={() => setOpen(true)}
          className="mt-6 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 shadow-md"
        >
          ➕ Add Medicine
        </button>
      </div>

      {/* Appointments Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4 text-purple-700 flex items-center gap-2">
          <FaCalendarAlt /> Appointments
        </h3>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments scheduled for this day.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {appointments.map((appt, idx) => (
              <div
                key={idx}
                className="bg-white border border-purple-200 shadow-md rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-2 text-purple-700 font-bold text-lg">
                  <FaUserMd /> {appt.title}
                </div>
                <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <FaClock className="text-purple-500" /> Time:{" "}
                  <span className="font-medium text-purple-700">{appt.timeSlot}</span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Location: {appt.location}
                </div>
                <div className="text-sm mt-2 font-medium">
                  Status:{" "}
                  {appt.status === "done" ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <FaCheckCircle /> Done
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <FaTimesCircle /> Missed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ➕ Add Appointment Button */}
        <button
          onClick={() => setOpenA(true)}
          className="mt-6 bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-500 shadow-md"
        >
          ➕ Add Appointment
        </button>
      </div>

      {/* Modals */}
      <AddMedicineModal isOpen={open} onClose={() => setOpen(false)} />
      <AddAppointmentModal
        isOpen={openA}
        onClose={() => setOpenA(false)}
        onSuccess={() => fetchAppointments(selectedDate)}
      />
    </div>
  );
}
