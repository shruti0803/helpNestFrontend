import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaPills, FaCalendarCheck } from "react-icons/fa";
const buildDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
};

// Emoji maps
const timeEmojis = {
  morning: "☀️",
  afternoon: "🌤️",
  evening: "🌆",
  night: "🌙",
};

const typeEmojis = {
  tablet: "💊",
  syrup: "🧴",
  injection: "💉",
};

const Today = () => {
     const navigate=useNavigate();
const handle=()=>{
  navigate("/health");
}
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const getFormattedDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const fetchToday = async () => {
   const dateStr = getFormattedDate();
const date = buildDate(dateStr);


    try {
      const medsRes = await axios.get(
        `http://localhost:5000/api/health/meds-for-date?date=${date}`,
        { withCredentials: true }
      );
      const apptRes = await axios.get(
        `http://localhost:5000/api/health/appts-for-date?date=${date}`,
        { withCredentials: true }
      );

      // Sort by timeSlot order
      const sortBySlot = (a, b) => {
        const order = ["morning", "afternoon", "evening", "night"];
        return order.indexOf(a.timeSlot) - order.indexOf(b.timeSlot);
      };

      const meds = medsRes.data.tasks || [];
      const appts = apptRes.data.tasks || [];

      setMedicines(meds.sort(sortBySlot));
      setAppointments(appts.sort(sortBySlot));
    } catch (err) {
      console.error("❌ Error fetching today's tasks:", err);
    }
  };

 const markTask = async (item) => {
  const dateStr = getFormattedDate();
  const date = buildDate(dateStr); // Ensures UTC 00:00 date

  try {
    if (item.type === "appointment") {
      await axios.patch(
        "http://localhost:5000/api/health/markDone",
        {
          title: item.title,
          date,
          timeSlot: item.timeSlot,
        },
        { withCredentials: true }
      );
    } else {
      await axios.patch(
        "http://localhost:5000/api/health/markTaken",
        {
          name: item.name,
          date,
          timeSlot: item.timeSlot,
        },
        { withCredentials: true }
      );
    }

    fetchToday(); // refresh
  } catch (err) {
    console.error("❌ Failed to mark task", err.response?.data || err.message);
  }
};


  useEffect(() => {
    fetchToday();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto bg-purple-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">
        📅 Today's Health Summary
      </h2>

      {/* Medicines */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-purple-800 flex items-center gap-2">
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
                  {typeEmojis[med.type] || "💊"} <strong>{med.name}</strong>{" "}
                  at  {med.timeSlot}
                </span>
                {med.status === "taken" ? (
                  <span className="text-green-600 font-medium">✅ Taken</span>
                ) : (
                  <button
                    onClick={() => markTask(med)}
                    className="bg-purple-500 text-white text-sm px-3 py-1 rounded hover:bg-purple-600"
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
        <h3 className="text-xl font-semibold mb-4 text-purple-800 flex items-center gap-2">
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
                  📅 <strong>{app.title}</strong> at{" "}
                   {app.timeSlot}
                </span>
                {app.status === "done" ? (
                  <span className="text-green-600 font-medium">✅ Done</span>
                ) : (
                  <button
                    onClick={() => markTask({ ...app, type: "appointment" })}
                    className="bg-purple-500 text-white text-sm px-3 py-1 rounded hover:bg-purple-600"
                  >
                    Mark Done
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
     <div className="flex justify-center p-4">
  <button
    onClick={handle}
    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg font-medium px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
  >
    ➕ Add Entry
  </button>
</div>

    </div>
  );
};

export default Today;
