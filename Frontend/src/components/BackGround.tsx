import React from "react";
import bgImage from "../assets/backgroundv2.png"; // đường dẫn đến ảnh của bạn

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const Background: React.FC<BackgroundProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen w-full bg-cover bg-center p-4 ${className}`}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {children}
    </div>
  );
};

export default Background;
