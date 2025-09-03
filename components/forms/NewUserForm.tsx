import React, { useState, useEffect } from 'react';
import { User, UserStatus } from '../../types';

interface NewUserFormProps {
  onSave: (user: Omit<User, 'id' | 'created' | 'lastEdited'> | User) => void;
  onCancel: () => void;
  initialData?: User | null;
}

const NewUserForm: React.FC<NewUserFormProps> = ({ onSave, onCancel, initialData }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState<UserStatus>('Approved');
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setUserId(initialData.userId);
      setStatus(initialData.status);
    }
  }, [initialData, isEditMode]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !userId.trim()) {
        setError('All fields are required.');
        return;
    }
    setError(null);

    if (isEditMode && initialData) {
        onSave({
            ...initialData,
            name: name.trim(),
            email: email.trim(),
            userId: userId.trim(),
            status,
        });
    } else {
        onSave({
          name: name.trim(),
          email: email.trim(),
          userId: userId.trim(),
          status,
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 text-sm mb-4 bg-red-100 p-3 rounded-button">{error}</p>}
      <div className="space-y-4">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
          <input
            type="text"
            id="userName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
            autoFocus
          />
        </div>
         <div>
          <label htmlFor="userEmail" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
          <input
            type="email"
            id="userEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <label htmlFor="userStatus" className="block text-sm font-medium text-text-secondary mb-1">Status</label>
          <select
            id="userStatus"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            className="mt-1 block w-full bg-background-start border border-secondary-accent/50 rounded-button py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-accent"
            required
          >
            <option>Approved</option>
            <option>Denied</option>
          </select>
        </div>
      </div>
       <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-button hover:bg-secondary-accent">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary-accent rounded-button hover:opacity-90">
          {isEditMode ? 'Save Changes' : 'Save User'}
        </button>
      </div>
    </form>
  );
};

export default NewUserForm;