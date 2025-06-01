// components/SettingToggle.tsx

import React from "react";

interface SettingToggleProps {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}

const SettingToggle: React.FC<SettingToggleProps> = ({ label, enabled, onToggle }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded mb-3">
      <span>{label}</span>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
          enabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        ></span>
      </button>
    </div>
  );
};

export default SettingToggle;
