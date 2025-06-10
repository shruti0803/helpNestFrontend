import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const WEEKLY_DATA = [
  { day: "Mon", water: 1800 },
  { day: "Tue", water: 2500 },
  { day: "Wed", water: 2000 },
  { day: "Thu", water: 3000 },
  { day: "Fri", water: 2200 },
  { day: "Sat", water: 2800 },
  { day: "Sun", water: 2600 },
];

export default function WaterTracker() {
  const [waterToday, setWaterToday] = useState(0);
  const maxWater = 3000;
  const glassSize = 250;
  const glassesFilled = Math.floor(waterToday / glassSize);
  const totalGlasses = maxWater / glassSize;

  const incrementWater = () => {
    setWaterToday((prev) => Math.min(prev + glassSize, maxWater));
  };

  const resetWater = () => {
    setWaterToday(0);
  };

  return (
    <div className="pt-40 max-w-4xl mx-auto space-y-10">
      <div className="bg-white  rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">🚰 Daily Water Tracker</h2>
        <p className="text-gray-600 mb-4">Stay hydrated! Goal: 3000ml</p>

        {/* Water Glasses UI */}
        <div className="flex justify-center flex-wrap gap-2 mb-4">
          {Array.from({ length: totalGlasses }).map((_, index) => (
            <div
              key={index}
              className={`w-10 h-16 border-2 rounded-md flex items-end justify-center p-1 transition-all duration-300 ${
                index < glassesFilled ? "bg-blue-400 border-blue-600" : "bg-white border-gray-300"
              }`}
            >
              <span className="text-xs font-medium">🥤</span>
            </div>
          ))}
        </div>

        <p className="text-lg font-medium mb-4">{waterToday} ml</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={incrementWater}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            +250ml
          </button>
          <button
            onClick={resetWater}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white  rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">📊 Weekly Water Intake</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={WEEKLY_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis unit="ml" />
            <Tooltip />
            <Bar dataKey="water" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
