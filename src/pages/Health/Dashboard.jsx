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
    <div className="min-h-screen pt-16 bg-purple-200 flex flex-col lg:flex-row overflow-hidden">

      {/* Left Sidebar */}
      <div className="w-full lg:w-96 bg-purple-200 p-4 shrink-0">
        <Today />
        <button onClick={handle}>Shop</button>
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
