import React from 'react';

const SortIcon: React.FC<{ direction: 'ascending' | 'descending', className?: string }> = ({ direction, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-slate-500 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {direction === 'ascending' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    )}
  </svg>
);

export default SortIcon;
