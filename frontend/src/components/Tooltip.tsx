import React, { useEffect, useState } from 'react';

interface TooltipProps {
  x: number;
  y: number;
  content: string;
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ x, y, content, visible }) => {
  const [pos, setPos] = useState({ left: x, top: y });

  useEffect(() => {
    const tooltipWidth = 300; 
    const tooltipHeight = 150; 
    const padding = 10;

    let left = x + padding;
    let top = y + padding;

    
    if (left + tooltipWidth > window.innerWidth) {
      left = x - tooltipWidth - padding;
    }
    // Giới hạn chiều dọc tránh tràn xuống dưới
    if (top + tooltipHeight > window.innerHeight) {
      top = y - tooltipHeight - padding;
    }

    setPos({ left, top });
  }, [x, y]);

  if (!visible) return null;

  return (
    <div
      className="fixed bg-white text-gray-700 text-sm p-2 rounded-lg shadow-md max-w-xs border border-gray-200 z-50"
      style={{
        left: pos.left,
        top: pos.top,
        maxWidth: 300,
        maxHeight: 200,
        overflow: 'auto',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      }}
    >
      {content}
    </div>
  );
};

export default Tooltip;
