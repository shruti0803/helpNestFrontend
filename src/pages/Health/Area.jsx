import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

const AreaGraph = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState({ meds: true, appts: true });

  const buildDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  };

const fetchWeeklyData = async () => {
  const today = new Date();
  const chartData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    try {
      const res = await axios.get(
        `http://localhost:5000/api/health/get-bp?date=${dateStr}`,
        { withCredentials: true }
      );

      const { systolic, diastolic } = res.data;

   chartData.push({
  date: dateStr.substring(5),
  systolic,
  diastolic,
  isSystolicDanger: systolic > 140 || systolic < 90,
  isDiastolicDanger: diastolic > 90 || diastolic < 60
});


console.log("BP Entry:", {
  date: dateStr,
  systolic,
  diastolic
});

    } catch (err) {
      if (err?.response?.status !== 404) {
        console.error(`Error on ${dateStr}:`, err.message);
      }
      // skip missing days silently
    }
  }
console.log("Processed Data for Chart:", chartData);

  setData(chartData);
  setLoading(false);
};



  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const toggleVisibility = (type) => {
    setVisible((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full h-[400px] bg-white rounded-xl shadow-lg p-4"
    >
  <div className="relative mb-5">
  <h2 className="text-2xl font-extrabold text-purple-800 tracking-wide text-center">
    Weekly Blood Pressure Trend
  </h2>

  <div className="absolute top-0 right-0 flex gap-3">


          <div
            className={`w-4 h-4 rounded-full cursor-pointer border-2 ${visible.meds ? 'bg-purple-600' : 'bg-gray-200'}`}
            onClick={() => toggleVisibility('meds')}
            title="Toggle Medicines"
          ></div>
          <div
            className={`w-4 h-4 rounded-full cursor-pointer border-2 ${visible.appts ? 'bg-purple-300' : 'bg-gray-200'}`}
            onClick={() => toggleVisibility('appts')}
            title="Toggle Appointments"
          ></div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : (
        <ResponsiveContainer width="100%" height={290}>
  <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
    <XAxis dataKey="date" stroke="#8884d8" />
    <YAxis allowDecimals={false} />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip />
    <Legend verticalAlign="top" height={36} />

    {visible.meds && (
      <Area
        type="monotone"
        dataKey="systolic"
        stroke="#a855f7"
        fill="#e9d5ff"
        dot={({ cx, cy, payload }) => (
          <circle
            cx={cx}
            cy={cy}
            r={4}
            fill={payload.isSystolicDanger ? "#ef4444" : "#a855f7"}
          />
        )}
        name="Systolic"
      />
    )}

    {visible.appts && (
      <Area
        type="monotone"
        dataKey="diastolic"
        stroke="#7e22ce"
        fill="#ddd6fe"
        dot={({ cx, cy, payload }) => (
          <circle
            cx={cx}
            cy={cy}
            r={4}
            fill={payload.isDiastolicDanger ? "#f97316" : "#7e22ce"}
          />
        )}
        name="Diastolic"
      />
    )}
  </AreaChart>
</ResponsiveContainer>

      )}
    </motion.div>
  );
};

export default AreaGraph;



