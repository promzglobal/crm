import React from 'react';
import { Tab } from '../../types';

interface PlaceholderFormProps {
  tabName: Tab;
  onCancel: () => void;
}

const PlaceholderForm: React.FC<PlaceholderFormProps> = ({ tabName, onCancel }) => {
  return (
    <div>
      <p className="text-text-secondary mb-6">
        The ability to add new items to "{tabName}" is coming soon!
      </p>
      <div className="flex justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold rounded-button bg-primary-accent text-white hover:opacity-90">
          Close
        </button>
      </div>
    </div>
  );
};

export default PlaceholderForm;
