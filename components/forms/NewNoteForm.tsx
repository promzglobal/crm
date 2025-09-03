import React, { useState } from 'react';
import { Note } from '../../types';

interface NewNoteFormProps {
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const NewNoteForm: React.FC<NewNoteFormProps> = ({ onAddNote, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddNote({ title: title.trim(), content });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="noteTitle" className="block text-sm font-medium text-text-secondary mb-1">Title</label>
          <input
            type="text"
            id="noteTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="noteContent" className="block text-sm font-medium text-text-secondary mb-1">Content</label>
          <textarea
            id="noteContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-button hover:bg-secondary-accent">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-accent rounded-button hover:opacity-90">
          Save Note
        </button>
      </div>
    </form>
  );
};

export default NewNoteForm;
