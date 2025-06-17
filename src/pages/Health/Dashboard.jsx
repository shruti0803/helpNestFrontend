import React from 'react';
import Badges from './Badges';
import { useNavigate } from 'react-router-dom';
import Today from './Today';
import WeeklyAnalysis from './WeekAnalysis';

const Dashboard = () => {
  const navigate=useNavigate();
const handle=()=>{
  navigate("/health");
}
  return (
    <div className="min-h-screen pt-16 bg-purple-50 flex flex-col lg:flex-row">

      {/* Left Sidebar */}
      <div className="w-full lg:w-72 bg-purple-200 p-4">
        <h2 className="text-lg font-bold mb-4">Left Sidebar</h2>
        <p>Navigation or info</p>
      </div>

      {/* Middle Section */}
      <div className="flex-1 flex flex-col p-4 gap-4">
        {/* Top Row */}
        <div className="bg-white rounded-xl shadow-md p-4">
          
          <Today/>
          <button onClick={handle}>Add</button>
        </div>

        {/* Bottom Row */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">Bottom Row Content</h2>
          {/* <WeeklyAnalysis/>  */}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-72 bg-purple-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Right Sidebar</h2>
        <Badges />
      </div>
  
    </div>
  );
};

export default Dashboard;
