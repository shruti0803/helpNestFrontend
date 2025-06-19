import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFire, FaCoins } from "react-icons/fa";

const allBadges = [
  {
    id: 1,
    title: "Beginner Med Time",
    image: "/badges/beginner.png",
    achievedBy: "Took medicine for 3 days in a row",
    condition: (streak) => streak >= 3
  },
  {
    id: 2,
    title: "Expert Med Time",
    image: "/badges/expert.png",
    achievedBy: "Took medicine consistently for 10+ days",
    condition: (streak) => streak >= 10
  }
];

const Badges = () => {
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0); // optional coin logic

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/health/streak", {
          withCredentials: true
        });
        setStreak(res.data.streak || 0);

        // Optionally: 10 coins per streak day
        setCoins((res.data.streak || 0) * 10);
      } catch (err) {
        console.error("Failed to fetch streak:", err);
      }
    };

    fetchStreak();
  }, []);

  const earnedBadges = allBadges.filter((badge) => badge.condition(streak));

  return (
    <div className="h-full p-6 rounded-lg bg-purple-50 overflow-y-auto">
      {/* 🔥 Streak and Coins */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
          <FaFire className="text-orange-500 text-xl" />
          <span>Streak: {streak}</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm">
          <FaCoins className="text-yellow-500 text-xl" />
          <span>Coins: {coins}</span>
        </div>
      </div>

      {/* 🏅 Badges Section */}
      <h2 className="text-lg font-bold text-purple-700 mb-3">Badges</h2>
      {earnedBadges.length === 0 ? (
        <p className="text-sm text-gray-500">No badges earned yet. Keep going!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {earnedBadges.map((badge) => (
            <div
              key={badge.id}
              className="relative group cursor-pointer bg-white rounded-lg shadow-md p-2 flex flex-col items-center text-center"
            >
              <img
                src={badge.image}
                alt={badge.title}
                className="w-16 h-16 rounded-md"
              />
              <p className="text-sm font-medium text-purple-800 mt-1">
                {badge.title}
              </p>

              {/* Tooltip */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 bg-white border border-purple-200 text-xs text-purple-700 shadow-lg rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
