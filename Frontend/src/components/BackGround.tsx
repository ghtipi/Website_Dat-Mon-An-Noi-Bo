import React from "react";
import bgImage from "../assets/backgroundv2.png";

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const Background: React.FC<BackgroundProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen w-full bg-cover bg-center bg-no-repeat px-4 py-8 sm:px-6 md:px-10 lg:px-20 ${className}`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-screen-xl mx-auto w-full">{children}</div>
    </div>
  );
};

export default Background;
