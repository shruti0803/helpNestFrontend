import React from 'react';
import Badges from './Badges';

import Today from './Today';
import WeekAnalysis from './WeekAnalysis';


const Dashboard = () => {
 
  return (
    <div className="min-h-screen pt-16 bg-purple-50 flex flex-col lg:flex-row">

      {/* Left Sidebar */}
      <div className="w-full lg:w-96 bg-purple-200 p-4">
       
         <Today/>
      </div>

      {/* Middle Section */}
      <div className="flex-1 flex flex-col  gap-4">
        {/* Top Row */}
        <div className="bg-white rounded-xl shadow-md p-4">
          
         
         
     

       
       
          <WeekAnalysis/> 
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-72 bg-purple-200 p-4 overflow-y-auto">
       
        <Badges />
      </div>
  
    </div>
  );
};

export default Dashboard;
