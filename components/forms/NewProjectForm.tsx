import React, { useState } from 'react';

interface NewProjectFormProps {
  onAddProject: (projectName: string) => void;
  onCancel: () => void;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({ onAddProject, onCancel }) => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onAddProject(projectName.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-text-secondary mb-1">Project Name</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
            autoFocus
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-button hover:bg-secondary-accent">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-accent rounded-button hover:opacity-90">
          Save Project
        </button>
      </div>
    </form>
  );
};

export default NewProjectForm;
