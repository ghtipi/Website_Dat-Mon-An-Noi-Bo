import React from 'react';
import HeaderAdmin from './HeaderAdmin';
import SidebarAdmin from './SidebarAdmin';

interface LayoutAdminProps {
  children: React.ReactNode;
}


const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
  return (
    <div className="min-h-screen ">
      <HeaderAdmin />
      <SidebarAdmin />
      <div className="ml-8 p-8 pt-24">
        {children}
      </div>
    </div>
  );
};

export default LayoutAdmin; 

   