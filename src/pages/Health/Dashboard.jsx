import React from 'react';
import Badges from './Badges';
import Today from './Today';

import WeeklyDonutChart from '../../components/Donut';
import AreaGraph from './Area';
import { Navigate, useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const navigate=useNavigate();
  const handle=()=>{
  
navigate("/shop");
}
  return (
    <div className="min-h-screen  pt-16 bg-purple-200 flex flex-col lg:flex-row overflow-hidden">

      {/* Left Sidebar */}
      <div className="w-full lg:w-96 bg-purple-200 p-4 shrink-0">
        <Today />
        <div className="max-w-4xl mx-auto mt-6 mb-6">
  <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
    <div className="bg-white bg-opacity-10 absolute inset-0 z-0"></div>
    <div className="relative z-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Running Out of Medicines?</h2>
      <p className="text-base sm:text-lg mb-4">Don’t wait until it’s too late. Get essentials delivered in <span className="font-semibold">just 2 hours!</span></p>
      <button
        onClick={handle}
        className="px-6 py-2 bg-white text-purple-700 font-semibold rounded-lg shadow hover:bg-purple-100 transition-all"
      >
        Shop Now
      </button>
    </div>
  </div>
</div>

      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col gap-4 p-4">

        {/* Top Row */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1">
            <WeeklyDonutChart />
          </div>
          <div className="flex-1">
            <Badges />
          </div>
        </div>

        {/* Area Chart */}
        <div className="w-full">
          <AreaGraph />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
