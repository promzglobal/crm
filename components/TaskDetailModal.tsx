import React from 'react';
import { Task, Assignee } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

interface TaskDetailModalProps {
  task: Task;
  assignee?: Assignee;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityClasses: Record<string, string> = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-blue-100 text-blue-700 border-blue-200',
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, assignee, onClose, onEdit, onDelete }) => {
  const dueDate = new Date(task.dueDate);
  
  return (
    <div>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-text-secondary">Assignee</h3>
          <div className="flex items-center gap-3 mt-2">
            {assignee ? (
              <>
                <img src={assignee.avatarUrl} alt={assignee.name} className="w-10 h-10 rounded-full" />
                <span className="font-semibold text-text-primary">{assignee.name}</span>
              </>
            ) : (
              <span className="text-text-secondary">Unassigned</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-text-secondary">Due Date</h3>
            <p className="mt-2 font-semibold text-text-primary">
              {dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary">Priority</h3>
            <span className={`mt-2 inline-block px-3 py-1 text-sm font-semibold rounded-full border ${priorityClasses[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        </div>

        {task.isCompleted && (
           <div>
            <h3 className="text-sm font-medium text-text-secondary">Status</h3>
            <p className="mt-2 font-semibold text-green-600">Completed</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 text-sm font-semibold rounded-button text-red-600 hover:bg-red-50 flex items-center gap-2"
        >
          <TrashIcon className="w-4 h-4" />
          Delete Task
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="px-4 py-2 text-sm font-semibold text-white bg-primary-accent rounded-button hover:opacity-90 flex items-center gap-2"
        >
          <EditIcon className="w-4 h-4" />
          Edit Task
        </button>
      </div>
    </div>
  );
};

export default TaskDetailModal;
