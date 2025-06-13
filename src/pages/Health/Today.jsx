import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPills, FaCalendarCheck } from "react-icons/fa";

const Today = () => {
  const [data, setData] = useState(null);

  const fetchToday = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/health/today", {
        withCredentials: true,
      });
      setData(res.data);
    } catch (err) {
      console.error("❌ Error fetching today's data", err);
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const markMedicineTaken = async (name) => {
    try {
      await axios.put(
        "http://localhost:5000/api/health/medicine/taken",
        { name },
        { withCredentials: true }
      );
      fetchToday(); // refresh data
    } catch (err) {
      console.error("❌ Failed to mark medicine taken", err);
    }
  };

  const markAppointmentDone = async (title) => {
    try {
      await axios.put(
        "http://localhost:5000/api/health/appointment/done",
        { title },
        { withCredentials: true }
      );
      fetchToday(); // refresh data
    } catch (err) {
      console.error("❌ Failed to mark appointment done", err);
    }
  };

  if (!data) return <div className="p-10 text-purple-600">Loading today’s tasks...</div>;

  return (
    <div className="p-10 max-w-2xl mx-auto bg-purple-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">📆 Today's Health Summary</h2>

      {/* Medicines */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-purple-800 flex items-center gap-2">
          <FaPills /> Medicines
        </h3>
        {data.medicine.length === 0 ? (
          <p className="text-gray-600">No medicines scheduled for today.</p>
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {data.medicine.map((med, i) => (
              <li key={i} className="text-purple-900 flex items-center justify-between bg-white rounded px-3 py-2 shadow">
                <span>
                  💊 <strong>{med.name}</strong> at {med.time}
                </span>
                {med.taken ? (
                  <span className="text-green-600 font-medium">✅ Taken</span>
                ) : (
                  <button
                    onClick={() => markMedicineTaken(med.name)}
                    className="bg-purple-500 text-white text-sm px-2 py-1 rounded hover:bg-purple-600"
                  >
                    Mark Taken
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Appointments */}
      <div>
        <h3 className="text-xl font-semibold mb-2 text-purple-800 flex items-center gap-2">
          <FaCalendarCheck /> Appointments
        </h3>
        {data.appointments.length === 0 ? (
          <p className="text-gray-600">No appointments today.</p>
        ) : (
          <ul className="list-disc list-inside space-y-2">
            {data.appointments.map((app, i) => (
              <li key={i} className="text-purple-900 flex items-center justify-between bg-white rounded px-3 py-2 shadow">
                <span>
                  📅 <strong>{app.title}</strong> at {app.time}
                </span>
                {app.done ? (
                  <span className="text-green-600 font-medium">✅ Done</span>
                ) : (
                  <button
                    onClick={() => markAppointmentDone(app.title)}
                    className="bg-purple-500 text-white text-sm px-2 py-1 rounded hover:bg-purple-600"
                  >
                    Mark Done
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Today;
