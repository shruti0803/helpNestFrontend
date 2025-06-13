import React, { useEffect, useState } from "react";
import axios from "axios";

const timesOfDay = [
  { label: "🌅", name: "morning" },
  { label: "🌞", name: "afternoon" },
  { label: "🌇", name: "evening" },
  { label: "🌙", name: "night" },
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Health() {
  const [weeklyData, setWeeklyData] = useState({});
  const [reminders, setReminders] = useState({}); // Local add

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/health/weekly-summary", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("📅 Weekly summary:", res.data);
        setWeeklyData(res.data);
      })
      .catch((err) => {
        console.error("❌ Weekly summary fetch failed:", err);
      });
  }, []);

const handleAdd = async (day, timeOfDay) => {
  const type = prompt("Add 'med' for medicine or 'app' for appointment:");
  if (!type || !["med", "app"].includes(type)) return;

  const name = prompt(type === "med" ? "Enter medicine name:" : "Enter appointment title:");
  if (!name) return;

  // Define default time based on time of day
  const defaultTimes = {
    morning: "08:00",
    afternoon: "14:00",
    evening: "18:00",
    night: "21:00",
  };
  const time = defaultTimes[timeOfDay] || "08:00";

  const key = `${day}_${timeOfDay}`;
  setReminders((prev) => ({
    ...prev,
    [key]: [...(prev[key] || []), name],
  }));

  const payload =
    type === "med"
      ? {
          name,
          time,
          days: [day], // e.g. ["Wed"]
        }
      : {
          title: name,
          time,
          day, // e.g. "Wed"
        };

  try {
    const url =
      type === "med"
        ? "http://localhost:5000/api/health/medicine"
        : "http://localhost:5000/api/health/appointment";

    await axios.post(url, payload, { withCredentials: true });

    // ✅ Re-fetch updated weekly summary
    const res = await axios.get("http://localhost:5000/api/health/weekly-summary", {
      withCredentials: true,
    });
    setWeeklyData(res.data);
    console.log("✅ Updated weekly summary after add.");
  } catch (err) {
    console.error("❌ Failed to add reminder:", err);
  }
};

const handleDelete = async (item) => {
  const confirmDelete = window.confirm(`Delete ${item.type === "med" ? item.name : item.title}?`);
  if (!confirmDelete) return;

  try {
    const endpoint =
      item.type === "med"
        ? `http://localhost:5000/api/health/medicine/${encodeURIComponent(item.name)}`
        : `http://localhost:5000/api/health/appointment/${encodeURIComponent(item.title)}`;

    await axios.delete(endpoint, { withCredentials: true });

    const res = await axios.get("http://localhost:5000/api/health/weekly-summary", {
      withCredentials: true,
    });
    setWeeklyData(res.data);
    console.log("🗑️ Item deleted and summary refreshed");
  } catch (err) {
    console.error("❌ Delete failed:", err);
  }
};


  const getItemsForCell = (day, timeName) => {
    const dayData = weeklyData[day] || {};
    const { medicines = [], appointments = [] } = dayData;

    const filteredMeds = medicines.filter((med) => {
      const medTime = med.time?.toLowerCase();
      if (!medTime) return false;
      const hour = parseInt(medTime.split(":")[0]);
      const slot =
        hour < 12
          ? "morning"
          : hour < 16
          ? "afternoon"
          : hour < 20
          ? "evening"
          : "night";
      return slot === timeName;
    });

    const filteredAppointments = appointments.filter((app) => {
      const appTime = app.time?.toLowerCase();
      if (!appTime) return false;
      const hour = parseInt(appTime.split(":")[0]);
      const slot =
        hour < 12
          ? "morning"
          : hour < 16
          ? "afternoon"
          : hour < 20
          ? "evening"
          : "night";
      return slot === timeName;
    });

    return [...filteredMeds.map((m) => ({ ...m, type: "med" })), ...filteredAppointments.map((a) => ({ ...a, type: "app" }))];
  };

  return (
    <div className="p-40 overflow-x-auto">
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Time/Day</th>
            {daysOfWeek.map((day) => (
              <th key={day} className="border px-4 py-2 text-center">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timesOfDay.map((time) => (
            <tr key={time.name}>
              <td className="border px-4 py-2 text-center font-bold">
                {time.label}
              </td>
              {daysOfWeek.map((day) => {
                const key = `${day}_${time.name}`;
                const items = getItemsForCell(day, time.name);

                return (
                  <td
                    key={key}
                    className="border px-2 py-2 hover:bg-blue-50 cursor-pointer align-top"
                    onClick={() => handleAdd(day, time.name)}
                  >
                    <ul className="text-sm space-y-1 mb-1">
                    {items.map((item, i) => (
  <li
    key={`item-${i}`}
    className={`flex justify-between items-center px-2 py-1 rounded group ${
      item.type === "med"
        ? item.taken
          ? "bg-green-200"
          : "bg-red-200"
        : item.done
        ? "bg-green-100"
        : "bg-red-100"
    }`}
  >
    <span>
      {item.type === "med" ? `💊 ${item.name}` : `📅 ${item.title}`}
    </span>
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDelete(item);
      }}
      className="ml-2 text-red-600 opacity-0 group-hover:opacity-100 hover:scale-110 transition"
      title="Delete"
    >
      🗑️
    </button>
  </li>
))}


                      {(reminders[key] || []).map((local, idx) => (
                        <li
                          key={`local-${idx}`}
                          className="bg-blue-100 px-2 py-1 rounded"
                        >
                          {local}
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-blue-500">+ </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
