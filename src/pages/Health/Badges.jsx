import React from "react";
import { FaFire, FaCoins } from "react-icons/fa";

const badges = [
  {
    id: 1,
    title: "Beginner Med Time",
    image: "/badges/beginner.png",
    achievedBy: "Took medicine for 3 days in a row"
  },
  {
    id: 2,
    title: "Expert Med Time",
    image: "/badges/expert.png",
    achievedBy: "Took medicine consistently for 10+ days"
  },
  {
    id: 3,
    title: "Water Freak",
    image: "/badges/water.png",
    achievedBy: "Drank 8+ glasses of water for 7 days"
  },
  {
    id: 4,
    title: "Sleep Master",
    image: "/badges/sleep.png",
    achievedBy: "Maintained 7+ hours of sleep for 5 days"
  }
];

const Badges = () => {
  return (
    <div className="h-full overflow-y-auto pr-1">
      {/* 🔥 Streak and Coins */}
      <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
          <FaFire className="text-red-500 text-xl" />
          <span>Streak: 5</span>
        </div>
        <div className="flex items-center gap-2 text-yellow-600 font-semibold text-sm">
          <FaCoins className="text-yellow-500 text-xl" />
          <span>Coins: 250</span>
        </div>
      </div>

      {/* 🏅 Badges Section */}
      <h2 className="text-lg font-bold text-purple-700 mb-3">Badges</h2>
      <div className="grid grid-cols-1 gap-4">
        {badges.map((badge) => (
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
    </div>
  );
};

export default Badges;
