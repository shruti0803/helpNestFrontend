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
    const builtDate = buildDate(dateStr);

    try {
      const [medsRes, apptsRes] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/health/meds-for-date?date=${builtDate}`,
          { withCredentials: true }
        ),
        axios.get(
          `http://localhost:5000/api/health/appts-for-date?date=${builtDate}`,
          { withCredentials: true }
        )
      ]);

      const meds = medsRes.data.tasks || [];
      const appts = apptsRes.data.tasks || [];

      const takenMeds = meds.filter((task) => task.status === "taken").length;
      const doneAppts = appts.filter((task) => task.status === "done").length;

      chartData.push({
        date: dateStr.substring(5), // e.g., "06-19"
        medicine: takenMeds,
        appointment: doneAppts,
      });
    } catch (err) {
      console.error(`Error on ${dateStr}:`, err.message);
    }
  }

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
      className="w-full h-[350px] bg-white rounded-xl shadow-lg p-4"
    >
  <div className="relative mb-5">
  <h2 className="text-2xl font-extrabold text-purple-800 tracking-wide text-center">
    Weekly Task Distribution
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
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
  <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
</linearGradient>



<linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#7e22ce" stopOpacity={0.8} />  {/* Tailwind purple-800 */}
  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />  {/* Tailwind purple-500 */}
</linearGradient>



            </defs>

            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis allowDecimals={false} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />

            {visible.meds && (
              <Area
                type="monotone"
                dataKey="medicine"
                stroke="#9333ea"
                fillOpacity={1}
                fill="url(#colorMed)"
              />
            )}

            {visible.appts && (
              <Area
                type="monotone"
                dataKey="appointment"
                stroke="#c4b5fd"
                fillOpacity={1}
                fill="url(#colorAppt)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default AreaGraph;