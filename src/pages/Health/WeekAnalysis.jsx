import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WeeklyAnalysis = () => {
  const [weeklyData, setWeeklyData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/health/weekly-summary", {
        withCredentials: true,
      })
      .then((res) => setWeeklyData(res.data))
      .catch((err) => console.error("❌ Failed to fetch weekly summary", err));
  }, []);

  const processData = (data) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => {
      const medicines = data[day]?.medicines || [];
      const appointments = data[day]?.appointments || [];

      const takenMeds = medicines.filter((m) => m.taken).length;
      const notTakenMeds = medicines.filter((m) => !m.taken).length;

      const doneApps = appointments.filter((a) => a.done).length;
      const notDoneApps = appointments.filter((a) => !a.done).length;

      return {
        day,
        "Meds Taken": takenMeds,
        "Meds Missed": notTakenMeds,
        "Apps Done": doneApps,
        "Apps Missed": notDoneApps,
      };
    });
  };

  if (!weeklyData) return <div className="p-10 text-purple-600">Loading analysis...</div>;

  const chartData = processData(weeklyData);

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">
        📊 Weekly Health Activity Summary
      </h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Meds Taken" fill="#84cc16" />
            <Bar dataKey="Meds Missed" fill="#f87171" />
            <Bar dataKey="Apps Done" fill="#60a5fa" />
            <Bar dataKey="Apps Missed" fill="#facc15" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyAnalysis;
