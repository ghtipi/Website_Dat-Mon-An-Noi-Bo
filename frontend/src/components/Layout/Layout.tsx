import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

  

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/images/background.png')" }}>
      <Header />
      <Sidebar />
      <div className="ml-8 p-8 pt-6">
        
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout; 