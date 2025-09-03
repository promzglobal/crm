
import React from 'react';
import { Task, Priority, Assignee } from '../types';

interface TaskCardProps {
  task: Task;
  assignee?: Assignee;
  onCheck: (taskId: string, isCompleted: boolean) => void;
}

const priorityColors: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-blue-100 text-blue-700',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, onCheck }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('taskId', task.id);
  };
  
  const dueDate = new Date(task.dueDate);
  
  // A task is considered overdue if its due date is before the beginning of the current day.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const isOverdue = !task.isCompleted && dueDate < startOfToday;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-white rounded-card p-4 shadow-card-default hover:shadow-card-hover transition-all duration-200 cursor-grab active:cursor-grabbing mb-4 ${task.isCompleted ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.isCompleted}
          onChange={(e) => onCheck(task.id, e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-accent focus:ring-primary-accent"
        />
        <div className="flex-1">
          <p className={`font-medium text-text-primary ${task.isCompleted ? 'line-through' : ''}`}>
            {task.title}
          </p>
          <div className="flex items-center justify-between mt-3 text-sm">
            <div className="flex items-center gap-2">
              {assignee && (
                <img src={assignee.avatarUrl} alt={assignee.name} className="w-6 h-6 rounded-full" title={assignee.name} />
              )}
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            <span className={`text-xs ${isOverdue ? 'text-red-500 font-semibold' : 'text-text-secondary'}`}>
              {dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;