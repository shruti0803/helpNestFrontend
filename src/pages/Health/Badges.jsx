import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFire, FaCoins, FaMedkit, FaStar, FaCrown } from "react-icons/fa";

const allBadges = [
  {
    id: 1,
    title: "Med Rookie",
    icon: <FaMedkit className="text-green-100 text-4xl drop-shadow" />,
    achievedBy: "Took medicine for 2 days in a row",
    condition: (streak) => streak >= 2
  },
  {
    id: 2,
    title: "Expert Med Time",
    icon: <FaCrown className="text-yellow-100 text-4xl drop-shadow" />,
    achievedBy: "Took medicine consistently for 10+ days",
    condition: (streak) => streak >= 10
  },
  {
    id: 3,
    title: "Streak Star",
    icon: <FaStar className="text-purple-100 text-4xl drop-shadow" />,
    achievedBy: "Maintained a 7-day streak",
    condition: (streak) => streak >= 7
  }
];

const Badges = () => {
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/health/streak", {
          withCredentials: true
        });
        setStreak(res.data.streak || 0);
        setCoins((res.data.streak || 0) * 10);
      } catch (err) {
        console.error("Failed to fetch streak:", err);
      }
    };

    fetchStreak();
  }, []);

  const earnedBadges = allBadges.filter((badge) => badge.condition(streak));

  return (
    <div className="h-full p-6 rounded-xl bg-gradient-to-b from-purple-50 to-white overflow-y-auto">
      {/* 🔥 Streak and Coins Header */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-purple-700 font-bold text-base">
          <FaFire className="text-orange-500 text-2xl animate-pulse" />
          <span>Streak: {streak}</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-600 font-bold text-base">
          <FaCoins className="text-yellow-400 text-2xl" />
          <span>Coins: {coins}</span>
        </div>
      </div>

      {/* 🏅 Badges Section */}
      <h2 className="text-xl font-bold text-purple-800 mb-4">Your Badges</h2>

      {earnedBadges.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          No badges earned yet. Keep going strong! 💪
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className="relative group bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 text-white rounded-xl p-5 h-28 flex flex-col justify-center items-center text-center shadow-xl hover:scale-105 transform transition-all duration-300"
            >
              <div className="">{badge.icon}</div>
              <p className=" font-semibold">{badge.title}</p>

              {/* Tooltip */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-44 bg-white text-purple-800 border border-purple-200 shadow-lg rounded-md px-3 py-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                {badge.achievedBy}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Badges;
