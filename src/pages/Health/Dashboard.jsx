import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { FaTint, FaPills, FaBed } from "react-icons/fa";

const Dashboard = () => {
  const [waterIntake, setWaterIntake] = useState(9); // glasses
  const [medicineTaken, setMedicineTaken] = useState(5); // times
  const [sleepHours, setSleepHours] = useState(9);

  const healthData = [
    { name: "Water", value: waterIntake },
    { name: "Medicine", value: medicineTaken },
    { name: "Sleep", value: sleepHours },
  ];

  const getBadge = () => {
     if (medicineTaken >= 3) return { icon: <FaPills />, label: "Med Time Champ" };
    if (waterIntake >= 8) return { icon: <FaTint />, label: "Water Freak" };
   
    if (sleepHours >= 8) return { icon: <FaBed />, label: "Sleep Star" };
    return null;
  };

  const badge = getBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-purple-400 p-6 text-white">
      <motion.h1 
        className="text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Health Dashboard
      </motion.h1>

      {badge && (
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white text-purple-500 px-6 py-2 rounded-full shadow-md flex items-center gap-2">
            {badge.icon}
            <span className="font-semibold">{badge.label}</span>
          </div>
        </motion.div>
      )}

      <motion.div 
        className="w-full max-w-3xl mx-auto bg-purple-700 p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Daily Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={healthData}>
            <XAxis dataKey="name" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip contentStyle={{ backgroundColor: '#9333ea', color: '#fff' }} />
            <Bar dataKey="value" fill="#a78bfa" barSize={50} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div 
        className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
      >
        {[
          { label: "Water Drank", value: `${waterIntake} glasses`, icon: <FaTint /> },
          { label: "Medicine Taken", value: `${medicineTaken} times`, icon: <FaPills /> },
          { label: "Sleep Duration", value: `${sleepHours} hrs`, icon: <FaBed /> }
        ].map((item, idx) => (
          <motion.div 
            key={idx} 
            className="bg-purple-600 p-6 rounded-xl shadow-lg flex flex-col items-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <h3 className="text-xl font-bold">{item.label}</h3>
            <p className="text-lg mt-1">{item.value}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;
