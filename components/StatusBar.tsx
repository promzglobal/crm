import React from 'react';
import CheckmarkCircleIcon from './icons/CheckmarkCircleIcon';

interface StatusBarProps {
  projectCount: number;
  taskCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ projectCount, taskCount }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm px-8 py-2 border-t border-gray-200/90 text-sm text-text-secondary z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckmarkCircleIcon className="w-5 h-5 text-green-500" />
          <span className="font-medium">All systems operational</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-medium">{projectCount} Projects</span>
          <span className="font-medium">{taskCount} Tasks</span>
          <span className="font-medium">Version 1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;