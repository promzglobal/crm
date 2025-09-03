import React from 'react';
import { Tab, TABS } from '../types';
import AddIcon from './icons/AddIcon';

interface PrimaryNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onAddClick: (tab: Tab) => void;
  modalType: Tab | null;
}

const TABS_WITH_ADD: Tab[] = [
  'Schedule',
  'Daily Checklist',
  'Projects',
  'Teams',
  'Goals',
  'Timeline (Gantt)',
  'Analytics',
  'Notes',
  'Tickets',
  'Files',
  'Inbox',
  'Settings',
];

const PrimaryNav: React.FC<PrimaryNavProps> = ({ activeTab, setActiveTab, onAddClick, modalType }) => {
  const handleTabClick = (tab: Tab) => {
    if (activeTab === tab) {
      if (TABS_WITH_ADD.includes(tab)) {
        onAddClick(tab);
      }
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="px-8px border-b border-gray-200/80">
      <nav className="flex space-x-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const isAddActive = modalType === tab;

          const buttonClasses = `px-4 py-3 whitespace-nowrap text-sm font-medium transition-colors duration-200 rounded-t-lg ${
            isActive
              ? 'bg-violet-100 text-violet-800 font-semibold'
              : 'text-text-secondary hover:text-text-primary hover:bg-secondary-accent/50'
          }`;

          const addBtnClasses = `ml-2 w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
            isAddActive
              ? 'bg-green-500 text-white'
              : 'bg-primary-accent/20 text-primary-accent hover:bg-primary-accent/40'
          }`;

          return (
            <div key={tab} className="flex items-center py-1">
              <button
                onClick={() => handleTabClick(tab)}
                className={buttonClasses}
              >
                {tab}
              </button>
              {TABS_WITH_ADD.includes(tab) && (
                <button
                  onClick={() => onAddClick(tab)}
                  className={addBtnClasses}
                  aria-label={`Add to ${tab}`}
                >
                  <AddIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default PrimaryNav;