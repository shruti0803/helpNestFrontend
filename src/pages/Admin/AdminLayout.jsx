import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = () => {
  return (
   <div className="flex relative">
  <div className="w-1/12 z-10 relative">
    <Sidebar />
  </div>
  <div className="w-11/12 flex flex-col z-0 relative">
    <Navbar />
    <main className="p-4 h-[calc(100vh-4rem)] overflow-auto">
      <Outlet />
    </main>
  </div>
</div>

  );
};

export default AdminLayout;
