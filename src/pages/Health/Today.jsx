import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPills, FaCalendarCheck } from "react-icons/fa";

const Today = () => {
  const [data, setData] = useState([]);

  const getFormattedDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  const fetchToday = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/health/meds-for-date?date=${getFormattedDate()}`,
        {
          withCredentials: true,
        }
      );
      setData(res.data.tasks || []);
    } catch (err) {
      console.error("❌ Error fetching today's data", err);
    }
  };

  const markTask = async (scheduleId) => {
    try {
      await axios.patch(
        "http://localhost:5000/api/health/markTaken",
        { scheduleId, status: "taken" },
        { withCredentials: true }
      );
      fetchToday(); // Refresh
    } catch (err) {
      console.error("❌ Failed to mark task", err);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const medicines = data.filter((item) =>
  ["tablet", "syrup", "capsule", "injection"].includes(item.type)
);

  const appointments = data.filter((item) => item.type === "appointment");

  return (
    <div className="p-8 max-w-3xl mx-auto bg-purple-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">
        📅 Today's Health Summary
      </h2>

      {/* Medicines */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3 text-purple-800 flex items-center gap-2">
          <FaPills /> Medicines
        </h3>
        {medicines.length === 0 ? (
          <p className="text-gray-600">No medicines scheduled for today.</p>
        ) : (
          <ul className="space-y-3">
            {medicines.map((med, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white rounded px-4 py-2 shadow"
              >
                <span>
                  💊 <strong>{med.name}</strong> at {med.timeSlot}
                </span>
                {med.status === "taken" ? (
                  <span className="text-green-600 font-medium">✅ Taken</span>
                ) : (
                  <button
                    onClick={() => markTask(med.scheduleId)}
                    className="bg-purple-500 text-white text-sm px-2 py-1 rounded hover:bg-purple-600"
                  >
                    Mark Taken
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Appointments */}
      <section>
        <h3 className="text-xl font-semibold mb-3 text-purple-800 flex items-center gap-2">
          <FaCalendarCheck /> Appointments
        </h3>
        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments scheduled for today.</p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((app, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white rounded px-4 py-2 shadow"
              >
                <span>
                  📅 <strong>{app.title}</strong> at {app.timeSlot}
                </span>
                {app.status === "taken" ? (
                  <span className="text-green-600 font-medium">✅ Done</span>
                ) : (
                  <button
                    onClick={() => markTask(app.scheduleId)}
                    className="bg-purple-500 text-white text-sm px-2 py-1 rounded hover:bg-purple-600"
                  >
                    Mark Done
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Today;
