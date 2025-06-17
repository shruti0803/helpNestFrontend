import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#8b5cf6", "#f87171"]; // purple and red

const WeeklySummary = () => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ total: 0, taken: 0, missed: 0 });

  useEffect(() => {
    const fetchWeekly = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/health/weekly", {
          withCredentials: true,
        });
        setLogs(res.data.logs);
        setSummary(res.data.summary);
      } catch (err) {
        console.error("❌ Weekly fetch failed", err);
      }
    };
    fetchWeekly();
  }, []);

  // Prepare pie data
  const pieData = [
    { name: "Taken", value: summary.taken },
    { name: "Missed", value: summary.missed }
  ];

  // Prepare bar data
  const groupedByDate = {};
  logs.forEach(log => {
    const date = new Date(log.date).toDateString();
    const type = log.itemId.type;
    if (!groupedByDate[date]) {
      groupedByDate[date] = { date, medicine: 0, appointment: 0 };
    }
    groupedByDate[date][type]++;
  });
  const barData = Object.values(groupedByDate);

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">📊 Weekly Health Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-10">
        {/* Pie Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Taken vs Missed</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Tasks Per Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="medicine" fill="#8b5cf6" />
              <Bar dataKey="appointment" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-3">Detailed Logs</h3>
        <table className="w-full table-auto border rounded text-sm">
          <thead className="bg-purple-100">
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="text-center">
                <td className="border px-2 py-1">{new Date(log.date).toDateString()}</td>
                <td className="border px-2 py-1">{log.itemId.name || log.itemId.title}</td>
                <td className="border px-2 py-1 capitalize">{log.itemId.type}</td>
                <td className={`border px-2 py-1 font-medium ${log.status === "taken" ? "text-green-600" : "text-red-500"}`}>
                  {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklySummary;
