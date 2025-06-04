import React from 'react';
import HeaderManager from './HeaderManager';
import SidebarManager from './SidebarManager';

interface LayoutAdminProps {
  children: React.ReactNode;
}


const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children }) => {
  return (
    <div className="min-h-screen ">
      <HeaderManager />
      <SidebarManager />
      <div className="ml-8 p-8 pt-24">
        {children}
      </div>
    </div>
  );
};

export default LayoutAdmin; 

   