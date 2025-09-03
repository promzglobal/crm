import React, { useState, useMemo, useEffect } from 'react';
import { User } from '../types';
import CheckmarkCircleIcon from './icons/CheckmarkCircleIcon';
import MinusCircleIcon from './icons/MinusCircleIcon';
import SortIcon from './icons/SortIcon';
import TrashIcon from './icons/TrashIcon';
import EditIcon from './icons/EditIcon';
import SearchIcon from './icons/SearchIcon';

type SortDirection = 'ascending' | 'descending';
type SortKey = keyof User;

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

interface DashboardProps {
    users: User[];
    onAddUserClick: () => void;
    onEditUserClick: (user: User) => void;
    onBulkDeleteClick: (userIds: string[]) => void;
}

const USERS_PER_PAGE = 8;

const UserManagementDashboard: React.FC<DashboardProps> = ({ users, onAddUserClick, onEditUserClick, onBulkDeleteClick }) => {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'lastEdited', direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (isoString: string) => {
      return new Date(isoString).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric'});
  }

  const processedUsers = useMemo(() => {
    let filteredUsers = [...users];

    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(lowercasedFilter) ||
        user.email.toLowerCase().includes(lowercasedFilter) ||
        user.userId.toLowerCase().includes(lowercasedFilter) ||
        formatDate(user.created).includes(lowercasedFilter) ||
        formatDate(user.lastEdited).includes(lowercasedFilter)
      );
    }

    filteredUsers.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return filteredUsers;
  }, [users, sortConfig, searchTerm]);
  
  const totalPages = Math.ceil(processedUsers.length / USERS_PER_PAGE);
  const paginatedUsers = useMemo(() => processedUsers.slice(
      (currentPage - 1) * USERS_PER_PAGE, 
      currentPage * USERS_PER_PAGE
  ), [processedUsers, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);
  
  useEffect(() => {
      setSelectedUserIds(new Set());
  }, [users, searchTerm, sortConfig]);

  useEffect(() => {
    if (currentPage !== 1) {
        setCurrentPage(1);
    }
  }, [searchTerm]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(new Set(processedUsers.map(u => u.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleSelectOne = (userId: string) => {
    const newSelection = new Set(selectedUserIds);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUserIds(newSelection);
  };
  
  const isAllSelected = selectedUserIds.size === processedUsers.length && processedUsers.length > 0;
  
  const renderSortableHeader = (key: SortKey, title: string, className: string) => (
    <div className={`${className} flex items-center cursor-pointer`} onClick={() => requestSort(key)}>
      <span className={sortConfig.key === key ? 'text-primary-accent' : ''}>{title}</span>
      <SortIcon direction={sortConfig.key === key ? sortConfig.direction : 'descending'} className={`ml-2 ${sortConfig.key === key ? 'text-primary-accent' : 'text-slate-500'}`} />
    </div>
  );

  return (
    <div className="p-8">
      <div className="bg-slate-800 rounded-lg shadow-lg text-white p-6">
        <header className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-xl font-bold">User Management</h2>
            <div className="flex-grow flex justify-center">
                <div className="relative w-full max-w-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email, ID, or date..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-button py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-accent text-white"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                {selectedUserIds.size > 0 && (
                    <button
                        onClick={() => onBulkDeleteClick(Array.from(selectedUserIds))}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-button hover:bg-red-600 flex items-center gap-2 transition-colors"
                    >
                        <TrashIcon className="w-4 h-4" />
                        Delete ({selectedUserIds.size})
                    </button>
                )}
                <button 
                    onClick={onAddUserClick}
                    className="px-4 py-2 text-sm font-semibold text-slate-800 bg-primary-accent rounded-button hover:opacity-90 transition-opacity"
                >
                    Create User
                </button>
            </div>
        </header>
        <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-slate-700 font-semibold text-slate-400 text-sm text-left">
          <div className="col-span-1 flex items-center">
            <input type="checkbox" className="w-4 h-4 rounded bg-slate-700 border-slate-600 focus:ring-primary-accent" onChange={handleSelectAll} checked={isAllSelected} />
          </div>
          {renderSortableHeader('name', 'USER NAME', 'col-span-2')}
          <div className="col-span-2">EMAIL</div>
          {renderSortableHeader('userId', 'USER ID', 'col-span-1')}
          {renderSortableHeader('created', 'CREATED', 'col-span-2')}
          {renderSortableHeader('lastEdited', 'LAST EDITED', 'col-span-2')}
          {renderSortableHeader('status', 'STATUS', 'col-span-1')}
          <div className="col-span-1 text-center">ACTIONS</div>
        </div>
        <div className="divide-y divide-slate-700">
          {paginatedUsers.map(user => {
            const isSelected = selectedUserIds.has(user.id);
            return (
              <div key={user.id} className={`grid grid-cols-12 gap-4 items-center px-4 py-4 text-sm transition-colors text-left ${isSelected ? 'bg-slate-700/50' : 'hover:bg-slate-700/30'}`}>
                <div className="col-span-1 flex items-center">
                  <input type="checkbox" className="w-4 h-4 rounded bg-slate-600 border-slate-500 focus:ring-primary-accent" checked={isSelected} onChange={() => handleSelectOne(user.id)} />
                </div>
                <div className="col-span-2 text-slate-200 font-medium truncate pr-2">{user.name}</div>
                <div className="col-span-2 text-slate-400 truncate pr-2">{user.email}</div>
                <div className="col-span-1 text-slate-400">{user.userId}</div>
                <div className="col-span-2 text-slate-400">{formatDate(user.created)}</div>
                <div className="col-span-2 text-slate-400">{formatDate(user.lastEdited)}</div>
                <div className="col-span-1">
                  {user.status === 'Approved' ? (
                    <span className="flex items-center gap-2 text-green-400">
                      <CheckmarkCircleIcon /> Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-400">
                      <MinusCircleIcon /> Denied
                    </span>
                  )}
                </div>
                 <div className="col-span-1 flex justify-center items-center">
                    <button onClick={() => onEditUserClick(user)} className="p-2 rounded-full hover:bg-slate-600 text-slate-400 hover:text-white" aria-label="Edit user">
                        <EditIcon className="w-5 h-5" />
                    </button>
                </div>
              </div>
            );
          })}
        </div>
         <div className="flex justify-between items-center mt-6 text-sm text-slate-400">
            <div>
                Showing <span className="font-semibold text-slate-300">{paginatedUsers.length}</span> of <span className="font-semibold text-slate-300">{processedUsers.length}</span> users
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1 || totalPages === 0} className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>
                <span>Page <span className="font-semibold text-slate-300">{totalPages === 0 ? 0 : currentPage}</span> of <span className="font-semibold text-slate-300">{totalPages}</span></span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 rounded-md bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDashboard;