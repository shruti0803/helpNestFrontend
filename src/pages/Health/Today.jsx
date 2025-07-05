import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClock, FaVial,FaMapMarkerAlt } from "react-icons/fa"; // or FaFlask for dosage
import { FaCalendarAlt} from "react-icons/fa";

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
  const [todayBp, setTodayBp] = useState(null);

  const [showBpModal, setShowBpModal] = useState(false);
const [bp, setBp] = useState({ systolic: "", diastolic: "" });
const [showVerdict, setShowVerdict] = useState(false);
const [verdictInfo, setVerdictInfo] = useState({ verdict: "", suggestion: "" });

     const navigate=useNavigate();
const handle=()=>{
  navigate("/health");
}
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
   const getBpVerdict = (systolic, diastolic) => {
  systolic = Number(systolic);
  diastolic = Number(diastolic);

  if (systolic < 90 || diastolic < 60) {
    return {
      verdict: "Low Blood Pressure",
      suggestion: "Drink more fluids, eat small salty meals, avoid sudden standing.",
    };
  } else if (systolic > 140 || diastolic > 90) {
    return {
      verdict: "High Blood Pressure",
      suggestion: "Limit salt, avoid stress, exercise gently, consult a doctor if persistent.",
    };
  } else {
    return {
      verdict: "Normal Blood Pressure",
      suggestion: "Keep up the good work! Maintain a healthy diet and regular exercise.",
    };
  }
};
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

    const fetchTodayBp = async () => {
  const dateStr = getFormattedDate();

  try {
    const res = await axios.get(
      `http://localhost:5000/api/health/get-bp?date=${dateStr}`,
      { withCredentials: true }
    );
    setTodayBp(res.data);
  } catch (err) {
    if (err?.response?.status === 404) {
      setTodayBp(null); // No BP for today
    } else {
      console.error("❌ Error fetching today's BP:", err.message);
    }
  }
};
  useEffect(() => {
    fetchToday();
    fetchTodayBp();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto bg-purple-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">
        📅 Today's Tasks
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
  className="flex justify-between items-start bg-white rounded px-4 py-3 shadow-md"
>
  <div>
    <div className="text-lg font-semibold">
      {typeEmojis[med.type] || "💊"} 
      <span className="text-purple-700">{med.name}</span>
    </div>

    {med.dosage && (
      <div className="text-sm text-gray-700 font-medium mt-1">
       <FaVial className="inline text-purple-700 mr-1" /> Dosage:{" "}
        <span >{med.dosage}</span>
      </div>
    )}

    <div className="text-sm text-gray-700 font-medium">
     <FaClock className="inline text-purple-700 mr-1" /> Time:{" "}
      <span className=" capitalize">{med.timeSlot}</span>
    </div>
  </div>

  {med.status === "taken" ? (
    <span className="text-green-600 font-medium self-center">✅ Taken</span>
  ) : (
    <button
      onClick={() => markTask(med)}
      className="bg-purple-500 text-white text-sm px-3 py-1 rounded hover:bg-purple-600 self-center"
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
  className="flex justify-between items-start bg-white rounded px-4 py-3 shadow-md"
>
  <div>
    <div className="text-lg font-semibold">
      <FaCalendarAlt className="inline text-purple-600 mr-1" />
      <span className="text-purple-700">{app.title}</span>
    </div>
    <div className="text-sm  mt-1 font-medium">
      <FaClock className="inline text-purple-600 mr-1" />
      Time: <span className=" capitalize">{app.timeSlot}</span>
    </div>
    {app.location && (
      <div className="text-sm  mt-1 font-medium">
        <FaMapMarkerAlt className="inline text-purple-600 mr-1" />
        Location: <span >{app.location}</span>
      </div>
    )}
  </div>

  {app.status === "done" ? (
    <span className="text-green-600 font-medium self-center">✅ Done</span>
  ) : (
    <button
      onClick={() => markTask({ ...app, type: "appointment" })}
      className="bg-purple-500 text-white text-sm px-3 py-1 rounded hover:bg-purple-600 self-center"
    >
      Mark Done
    </button>
  )}
</li>

            ))}
          </ul>
        )}
      </section>
      {todayBp ? (
  <div className="bg-white border border-purple-300 rounded-lg p-4 my-6 text-center shadow">
    <h3 className="text-lg font-semibold text-purple-800 mb-2">
      🩺 Today's Blood Pressure
    </h3>
    <p className="text-gray-800 text-md mb-1">
      <strong>Systolic:</strong> {todayBp.systolic} mmHg
    </p>
    <p className="text-gray-800 text-md mb-2">
      <strong>Diastolic:</strong> {todayBp.diastolic} mmHg
    </p>
    <p className="text-sm italic text-purple-700">
      {getBpVerdict(todayBp.systolic, todayBp.diastolic).verdict}
    </p>
  </div>
) : null}

     <div className="flex justify-center p-4 gap-4">
  <button
    onClick={handle}
    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg font-medium px-4 py-2 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
  >
    ➕ Add Entry
  </button>
{!todayBp && (
  <button
    onClick={() => setShowBpModal(true)}
    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg font-medium px-4 py-2 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
  >
    ➕ Add BP
  </button>
)}


 
</div>
{showBpModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-80">
      <h3 className="text-xl font-semibold mb-4 text-purple-700">Add Blood Pressure</h3>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Systolic (Upper)</label>
        <input
          type="number"
          value={bp.systolic}
          onChange={(e) => setBp({ ...bp, systolic: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic (Lower)</label>
        <input
          type="number"
          value={bp.diastolic}
          onChange={(e) => setBp({ ...bp, diastolic: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setShowBpModal(false)}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
        >
          Cancel
        </button>
        <button
onClick={async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/health/add-bp",
      {
        systolic: bp.systolic,
        diastolic: bp.diastolic,
        date: getFormattedDate(),
      },
      { withCredentials: true }
    );
    const result = getBpVerdict(bp.systolic, bp.diastolic);
    setVerdictInfo(result);
    setShowBpModal(false);
    setShowVerdict(true);
    setBp({ systolic: "", diastolic: "" });
  } catch (err) {
    console.error("❌ Error adding BP", err.response?.data || err.message);
  }
}}

          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}
{showVerdict && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
      <h3 className="text-2xl font-bold text-purple-700 mb-4">{verdictInfo.verdict}</h3>
      <p className="text-gray-800 mb-6">{verdictInfo.suggestion}</p>
      <button
        onClick={() => setShowVerdict(false)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Today;
