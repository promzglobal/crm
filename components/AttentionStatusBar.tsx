import React from 'react';

interface AttentionStatusBarProps {
  overdueCount: number;
  blockedCount: number;
}

const AttentionStatusBar: React.FC<AttentionStatusBarProps> = ({ overdueCount, blockedCount }) => {
  if (overdueCount === 0 && blockedCount === 0) {
    return null;
  }

  return (
    <div className="bg-orange-600 text-yellow-200 px-8 py-2 text-base font-bold z-40">
      <div className="flex items-center justify-center gap-6">
        {overdueCount > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <span>{overdueCount} Task{overdueCount > 1 ? 's' : ''} Overdue</span>
          </div>
        )}
        {blockedCount > 0 && (
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <span>{blockedCount} Task{blockedCount > 1 ? 's' : ''} Blocked</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttentionStatusBar;