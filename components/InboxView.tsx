import React from 'react';
import { Email } from '../types';
import SearchIcon from './icons/SearchIcon';

interface InboxViewProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (emailId: string) => void;
  onMarkAsUnread: (emailId: string) => void;
  onLogout: () => void;
  userEmail: string;
}

const formatTimestamp = (isoString: string) => {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const EmailListItem: React.FC<{ email: Email; isSelected: boolean; onSelect: () => void; }> = ({ email, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 cursor-pointer border-l-4 transition-colors duration-150 ${
        isSelected ? 'bg-secondary-accent border-primary-accent' : `border-transparent hover:bg-secondary-accent/50 ${!email.isRead ? 'bg-violet-100/50' : ''}`
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {!email.isRead && <div className="w-2.5 h-2.5 bg-primary-accent rounded-full flex-shrink-0"></div>}
          <div className={email.isRead ? 'ml-[18px]' : ''}>
            <p className={`font-semibold text-sm ${!email.isRead ? 'text-text-primary' : 'text-text-secondary'}`}>{email.sender}</p>
            <p className={`font-bold text-sm truncate max-w-[150px] ${!email.isRead ? 'text-text-primary' : 'text-text-secondary'}`}>{email.subject}</p>
          </div>
        </div>
        <span className="text-xs text-text-secondary flex-shrink-0">{formatTimestamp(email.timestamp)}</span>
      </div>
      <p className="text-sm text-text-secondary mt-1 line-clamp-2">{email.body}</p>
    </div>
  );
};

const EmailDetailView: React.FC<{ email: Email, onMarkAsUnread: () => void }> = ({ email, onMarkAsUnread }) => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-text-primary mb-2">{email.subject}</h2>
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div className="flex items-center gap-4">
          <img src={email.avatarUrl} alt={email.sender} className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-semibold text-text-primary">{email.sender}</p>
            <p className="text-sm text-text-secondary">{email.senderEmail}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary">{new Date(email.timestamp).toLocaleString()}</p>
          <button onClick={onMarkAsUnread} className="text-sm text-primary-accent hover:underline mt-1">Mark as unread</button>
        </div>
      </div>
      <div className="prose max-w-none text-text-primary whitespace-pre-wrap">
        {email.body}
      </div>
    </div>
  );
};

const InboxView: React.FC<InboxViewProps> = ({ emails, selectedEmail, onSelectEmail, onMarkAsUnread, onLogout, userEmail }) => {
  
  const sortedEmails = [...emails].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="h-full flex flex-col">
       <header className="px-8 py-3 flex items-center justify-between border-b border-gray-200/80 flex-shrink-0">
         <div className="flex items-center gap-3">
           <h2 className="text-xl font-bold text-text-primary">Inbox</h2>
           <span className="text-sm text-text-secondary bg-secondary-accent px-2 py-1 rounded-full">{userEmail}</span>
         </div>
         <button onClick={onLogout} className="px-4 py-2 text-sm font-semibold rounded-button hover:bg-secondary-accent">Logout</button>
       </header>
        <div className="flex-1 flex min-h-0">
          {/* Email List */}
          <div className="w-96 border-r border-gray-200/80 flex flex-col">
            <div className="p-4 border-b border-gray-200/80">
               <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search mail"
                        className="w-full bg-background-start border border-gray-200/80 rounded-button py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary-accent text-sm"
                    />
                </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {sortedEmails.map(email => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  isSelected={selectedEmail?.id === email.id}
                  onSelect={() => onSelectEmail(email.id)}
                />
              ))}
            </div>
          </div>

          {/* Email Detail */}
          <div className="flex-1">
            {selectedEmail ? (
              <EmailDetailView email={selectedEmail} onMarkAsUnread={() => onMarkAsUnread(selectedEmail.id)} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-text-secondary">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
                 <p className="text-lg font-semibold">Select an email to read</p>
                 <p>Nothing selected</p>
              </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default InboxView;
