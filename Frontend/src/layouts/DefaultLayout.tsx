import React from "react";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => (
  <div className="bg-main min-h-screen flex">
    <div className="mt-24">
      <Sidebar />
    </div>

    <div className="ml-20 flex-1">
      <Navbar />
      <main>{children}</main>
    </div>
  </div>
);

export default DefaultLayout;
