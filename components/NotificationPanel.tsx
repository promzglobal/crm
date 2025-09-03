
import React from 'react';
import { Notification, Task } from '../types';
import CloseIcon from './icons/CloseIcon';

interface NotificationPanelProps {
  notifications: Notification[];
  tasks: Record<string, Task>;
  onClear: () => void;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, tasks, onClear, onClose }) => {
  return (
    <div className="absolute top-20 right-8 w-full max-w-sm bg-white rounded-card shadow-lg border border-gray-200 z-50 animate-fade-in-down">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-bold text-lg text-text-primary">Notifications</h3>
        <div className="flex items-center gap-2">
            {notifications.length > 0 && (
                <button 
                    onClick={onClear} 
                    className="text-xs font-semibold text-primary-accent hover:underline"
                >
                    Clear All
                </button>
            )}
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-secondary-accent" aria-label="Close notifications">
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifications.length > 0 ? (
          <div>
            {notifications.map(notification => {
              const task = tasks[notification.taskId];
              if (!task) return null;
              return (
                <div key={notification.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-secondary-accent/50 transition-colors duration-150">
                    <p className="text-sm text-text-primary">{notification.message}</p>
                    <p className="text-xs text-text-secondary mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-text-secondary">
            <p>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
