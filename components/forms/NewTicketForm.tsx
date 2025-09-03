import React, { useState } from 'react';
import { Ticket } from '../../types';

interface NewTicketFormProps {
  onAddTicket: (ticket: Omit<Ticket, 'id' | 'status'>) => void;
  onCancel: () => void;
}

const NewTicketForm: React.FC<NewTicketFormProps> = ({ onAddTicket, onCancel }) => {
  const [title, setTitle] = useState('');
  const [reporter, setReporter] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && reporter.trim() && userId.trim()) {
      onAddTicket({ title: title.trim(), reporter: reporter.trim(), userId: userId.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="ticketTitle" className="block text-sm font-medium text-text-secondary mb-1">Ticket Title</label>
          <input
            type="text"
            id="ticketTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="reporterName" className="block text-sm font-medium text-text-secondary mb-1">Reporter Name</label>
          <input
            type="text"
            id="reporterName"
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
          />
        </div>
        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-text-secondary mb-1">User ID</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-button hover:bg-secondary-accent">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-accent rounded-button hover:opacity-90">
          Create Ticket
        </button>
      </div>
    </form>
  );
};

export default NewTicketForm;
