import React, { useState, useEffect } from 'react';
import { Assignee, Priority, Task } from '../../types';

interface NewTaskFormProps {
  onSave: (task: Omit<Task, 'id' | 'isCompleted' | 'columnId'> | Task) => void;
  onCancel: () => void;
  assignees: Assignee[];
  selectedDate?: Date;
  initialData?: Task | null;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onSave, onCancel, assignees, selectedDate, initialData }) => {
  const isEditMode = !!initialData;
  
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title);
      setAssigneeId(initialData.assigneeId);
      setPriority(initialData.priority);
      setDueDate(new Date(initialData.dueDate).toISOString().split('T')[0]);
    } else if (selectedDate) {
      setTitle('');
      setAssigneeId(assignees[0]?.id || '');
      setPriority('Medium');
      setDueDate(selectedDate.toISOString().split('T')[0]);
    }
  }, [initialData, isEditMode, selectedDate, assignees]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assigneeId || !dueDate) return;

    const taskData = {
      title: title.trim(),
      dueDate: new Date(dueDate).toISOString(),
      assigneeId,
      priority,
    };
    
    if (isEditMode && initialData) {
      onSave({ ...initialData, ...taskData });
    } else {
      onSave(taskData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="taskTitle" className="block text-sm font-medium text-text-secondary mb-1">Task Title</label>
          <input
            type="text"
            id="taskTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-text-secondary mb-1">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
          />
        </div>
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-text-secondary mb-1">Assignee</label>
          <select
            id="assignee"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
          >
            <option value="" disabled>Select an assignee</option>
            {assignees.map(assignee => (
              <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>
       <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-button hover:bg-secondary-accent">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-accent rounded-button hover:opacity-90">
          {isEditMode ? 'Save Changes' : 'Save Task'}
        </button>
      </div>
    </form>
  );
};

export default NewTaskForm;