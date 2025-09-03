
import React from 'react';
import { Column, Task, Assignee } from '../types';
import TaskCard from './TaskCard';

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  assignees: Record<string, Assignee>;
  onCheckTask: (taskId: string, isCompleted: boolean) => void;
  onDropTask: (columnId: string) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ column, tasks, assignees, onCheckTask, onDropTask }) => {
    const [isOver, setIsOver] = React.useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = () => {
        setIsOver(false);
    }
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        onDropTask(column.id);
    };

  return (
    <div 
        className={`flex-shrink-0 w-80 bg-secondary-accent/50 rounded-card p-4 transition-colors ${isOver ? 'bg-primary-accent/20' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">{column.title}</h3>
        <span className="text-sm font-medium bg-gray-200 text-text-secondary rounded-full px-2 py-0.5">{tasks.length}</span>
      </div>
      <div className="h-[calc(100vh-380px)] overflow-y-auto pr-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} assignee={assignees[task.assigneeId]} onCheck={onCheckTask} />
        ))}
      </div>
    </div>
  );
};

export default BoardColumn;
