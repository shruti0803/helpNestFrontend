import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const WeeklyDonutChart = () => {
  const [summary, setSummary] = useState({ taken: 0, missed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

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

        allLogs.push(...(medsRes.data.tasks || []), ...(apptRes.data.tasks || []));
      } catch (err) {
        console.error("❌ Error fetching data for", dateStr, err.message);
      }
    }

    const taken = allLogs.filter(
      (item) => item.status === "taken" || item.status === "done"
    ).length;
    const missed = allLogs.filter((item) => item.status === "missed").length;
    const total = taken + missed;

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
          if (target === 100) setCelebrate(true);
          clearInterval(interval);
        } else {
          setAnimatedPercent(current);
        }
      }, 20);
    }
  }, [summary, loading]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - animatedPercent / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full h-80 bg-gradient-to-br from-purple-100 to-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-500 relative"
    >
      <h3 className="text-lg font-semibold mb-4 text-center text-purple-800">
        Weekly Health Completion
      </h3>

      {loading ? (
        <p className="text-center text-gray-500">Loading chart...</p>
      ) : summary.total === 0 ? (
        <p className="text-center text-gray-500">No tasks scheduled last week.</p>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-60 relative">
          {/* Circle container */}
          <svg
            className={`w-40 h-40 ${
              animatedPercent === 100 ? "animate-spin-slow" : ""
            } rotate-[-90deg]`}
          >
            {/* Base black circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#000"
              strokeWidth="10"
              fill="#111827" // dark background inside
            />
            {/* Progress purple ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#a855f7"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center content */}
          <div className="absolute text-center">
            <p className="text-3xl font-bold text-white drop-shadow-md">{animatedPercent}%</p>
            <p className="text-sm text-gray-300 mt-1">Completed</p>
          </div>

          {/* 🎉 Confetti on 100% */}
          {celebrate && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 120 }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random(),
                    ease: "easeOut"
                  }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 50}%`,
                    backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default WeeklyDonutChart;
