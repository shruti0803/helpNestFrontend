import React, { useState } from "react";
import WaterTracker from "./WaterTracker";
import Dashboard from "./Dashboard";

const timesOfDay = [
  { label: "🌅", name: "morning" },
  { label: "🌞", name: "afternoon" },
  { label: "🌇", name: "evening" },
  { label: "🌙", name: "night" },
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Health() {
  const [reminders, setReminders] = useState({});

  const handleAdd = (day, timeOfDay) => {
    const med = prompt("Enter medicine name:");
    if (!med) return;
    const key = `${day}_${timeOfDay}`;
    setReminders((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), med],
    }));
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
                return (
                  <td
                    key={key}
                    className="border px-2 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleAdd(day, time.name)}
                  >
                    <ul className="text-sm space-y-1">
                      {(reminders[key] || []).map((med, idx) => (
                        <li key={idx} className="bg-blue-100 px-2 py-1 rounded">
                          {med}
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-blue-500 mt-1">+ Add</div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <WaterTracker/>
      <Dashboard/>
    </div>
  );
}
