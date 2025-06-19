import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#4ade80", "#f87171"]; // green, red

const WeeklyDonutChart = () => {
  const [summary, setSummary] = useState({ taken: 0, missed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  const buildDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  };

  const fetchWeeklySummary = async () => {
    const today = new Date();
    const allLogs = [];

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const builtDate = buildDate(dateStr);

      console.log("📅 Fetching for:", dateStr);

      try {
        const [medsRes, apptRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/health/meds-for-date?date=${builtDate}`,
            { withCredentials: true }
          ),
          axios.get(
            `http://localhost:5000/api/health/appts-for-date?date=${builtDate}`,
            { withCredentials: true }
          ),
        ]);

        const meds = medsRes.data.tasks || [];
        const appts = apptRes.data.tasks || [];

        console.log(`🟣 Day ${dateStr} meds:`, meds);
        console.log(`🔵 Day ${dateStr} appts:`, appts);

        allLogs.push(...meds, ...appts);
      } catch (err) {
        console.error("❌ Error fetching data for", dateStr, err.message);
      }
    }

    const taken = allLogs.filter(
      (item) => item.status === "taken" || item.status === "done"
    ).length;
    const missed = allLogs.filter((item) => item.status === "missed").length;
    const total = taken + missed;

    console.log("✅ Total logs:", allLogs);
    console.log("✅ Taken:", taken, "Missed:", missed, "Total:", total);

    setSummary({ taken, missed, total });
    setLoading(false);
  };

  useEffect(() => {
    fetchWeeklySummary();
  }, []);

  useEffect(() => {
    if (!loading) {
      const target = summary.total > 0
        ? Math.round((summary.taken / summary.total) * 100)
        : 0;

      let current = 0;
      const step = Math.ceil(target / 30);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          setAnimatedPercent(target);
          clearInterval(interval);
        } else {
          setAnimatedPercent(current);
        }
      }, 20);
    }
  }, [summary, loading]);

  const chartData = [
    { name: "Completed", value: summary.taken },
    { name: "Missed", value: summary.missed },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full h-80 bg-gradient-to-br from-purple-100 to-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-500"
    >
      <h3 className="text-lg font-semibold mb-3 text-center text-purple-800">
        Weekly Health Completion
      </h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading chart...</p>
      ) : summary.total === 0 ? (
        <p className="text-center text-gray-500">No tasks scheduled last week.</p>
      ) : (
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "10px", fontSize: "0.9rem" }}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={22}
              fontWeight={700}
              fill="#4b5563"
              style={{
                filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.15))",
              }}
            >
              {animatedPercent}%
            </text>
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default WeeklyDonutChart;
