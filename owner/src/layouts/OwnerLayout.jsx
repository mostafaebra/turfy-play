import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';


const OwnerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  );
};

export default OwnerLayout;