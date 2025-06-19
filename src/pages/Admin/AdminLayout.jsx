import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = () => {
  return (
    <div className="flex">
        
      <div className='w-1/12 z-2'>
      <Sidebar/>
      
      </div>
       <div className='w-11/12 flex flex-col z-1'>
        <Navbar />
        <main className="p-4">
          <Outlet /> {/* ⬅️ This is where each admin page will render */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
