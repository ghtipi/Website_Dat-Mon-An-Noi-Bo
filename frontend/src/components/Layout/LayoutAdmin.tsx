import React from 'react';
import Header from './Header';
import SidebarAdmin from './SidebarAdmin';

interface LayoutAdminProps {
  children: React.ReactNode;
}


const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-300 bg-cover bg-center">
      <Header />
      <SidebarAdmin />
      <div className="ml-8 p-8 pt-6">
        {children}
      </div>
    </div>
  );
};

export default LayoutAdmin; 

   