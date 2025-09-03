import React from 'react';
import { Tab, BoardData, Task, Assignee, Note, User, Ticket, TicketStatus, Email } from '../types';
import CheckBoard from './CheckBoard';
import TrashIcon from './icons/TrashIcon';
import UserManagementDashboard from './UserManagementDashboard';
import TicketBoard from './TicketBoard';
import LoginForm from './LoginForm';
import InboxView from './InboxView';

interface ContentViewProps {
    activeTab: Tab;
    boardData: BoardData;
    activeBoardId: string;
    setActiveBoardId: (boardId: string) => void;
    handleTaskCheck: (taskId: string, isCompleted: boolean) => void;
    handleTaskMove: (taskId: string, newColumnId: string) => void;
    handleDeleteTaskRequest: (taskId: string) => void;
    handleTicketMove: (ticketId: string, newStatus: TicketStatus) => void;
    handleOpenAddUserModal: () => void;
    handleOpenEditUserModal: (user: User) => void;
    handleBulkDeleteRequest: (userIds: string[]) => void;
    handleViewTask: (taskId: string) => void;
    selectedDate: Date;
    dateRange: { start: string | null; end: string | null };
    setDateRange: React.Dispatch<React.SetStateAction<{ start: string | null; end: string | null }>>;
    userEmail: string | null;
    handleLogin: (email: string) => void;
    handleLogout: () => void;
    selectedEmailId: string | null;
    handleSelectEmail: (emailId: string) => void;
    handleMarkAsUnread: (emailId: string) => void;
}

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
    <div className="p-8 h-full flex items-center justify-center text-text-secondary">
        <h2 className="text-2xl font-semibold">{title} View</h2>
    </div>
);

const ScheduleView: React.FC<{ 
    tasks: Task[], 
    assignees: Record<string, Assignee>, 
    selectedDate: Date,
    onDeleteTaskRequest: (taskId: string) => void;
    onViewTask: (taskId: string) => void;
}> = ({ tasks, assignees, selectedDate, onDeleteTaskRequest, onViewTask }) => {
    const filteredTasks = tasks.filter(task => new Date(task.dueDate).toDateString() === selectedDate.toDateString());

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Schedule for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
            <div className="bg-white rounded-card shadow-card-default p-6 space-y-4">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <div key={task.id} onClick={() => onViewTask(task.id)} className="group flex items-center gap-3 p-3 rounded-button hover:bg-secondary-accent/50 transition-colors cursor-pointer">
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteTaskRequest(task.id); }}
                                className="opacity-0 w-8 h-8 flex items-center justify-center group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 rounded-full hover:bg-red-100/50 -ml-1"
                                aria-label="Delete task"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                             <img src={assignees[task.assigneeId]?.avatarUrl} alt={assignees[task.assigneeId]?.name} className="w-8 h-8 rounded-full" />
                            <div className="flex-1">
                                <p className={`font-medium ${task.isCompleted ? 'line-through text-text-secondary' : 'text-text-primary'}`}>{task.title}</p>
                                <p className="text-sm text-text-secondary">{assignees[task.assigneeId]?.name}</p>
                            </div>
                            <span className="text-sm text-text-secondary">{new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-text-secondary">No tasks scheduled for this day.</p>
                )}
            </div>
        </div>
    );
};

const DailyChecklistView: React.FC<{ tasks: Task[], selectedDate: Date, handleTaskCheck: (taskId: string, isCompleted: boolean) => void, onViewTask: (taskId: string) => void }> = ({ tasks, selectedDate, handleTaskCheck, onViewTask }) => {
    const filteredTasks = tasks.filter(task => new Date(task.dueDate).toDateString() === selectedDate.toDateString());

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Daily Checklist for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h2>
            <div className="bg-white rounded-card shadow-card-default p-6 space-y-3">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <div key={task.id} onClick={() => onViewTask(task.id)} className={`flex items-center gap-4 p-3 rounded-button transition-opacity cursor-pointer hover:bg-secondary-accent/50 ${task.isCompleted ? 'opacity-60' : ''}`}>
                            <input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={(e) => handleTaskCheck(task.id, e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-5 w-5 rounded border-gray-300 text-primary-accent focus:ring-primary-accent cursor-pointer"
                            />
                            <label className={`flex-1 font-medium cursor-pointer ${task.isCompleted ? 'line-through text-text-secondary' : 'text-text-primary'}`} onClick={(e) => {
                                e.stopPropagation();
                                handleTaskCheck(task.id, !task.isCompleted);
                            }}>
                                {task.title}
                            </label>
                        </div>
                    ))
                ) : (
                    <p className="text-text-secondary">You're all clear for today!</p>
                )}
            </div>
        </div>
    );
};

const NotesView: React.FC<{ notes: Note[] }> = ({ notes }) => (
    <div className="p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.length > 0 ? (
                notes.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(note => (
                    <div key={note.id} className="bg-white rounded-card shadow-card-default p-6 flex flex-col">
                        <h3 className="font-bold text-lg text-text-primary mb-2">{note.title}</h3>
                        <p className="text-text-secondary flex-1 whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-gray-400 mt-4">{new Date(note.createdAt).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p className="text-text-secondary col-span-full text-center">No notes yet. Click the '+' in the navigation to add one!</p>
            )}
        </div>
    </div>
);

const ContentView: React.FC<ContentViewProps> = ({ 
    activeTab, 
    boardData, 
    activeBoardId, 
    setActiveBoardId, 
    handleTaskCheck, 
    handleTaskMove,
    handleDeleteTaskRequest,
    handleTicketMove,
    handleOpenAddUserModal,
    handleOpenEditUserModal,
    handleBulkDeleteRequest,
    handleViewTask,
    selectedDate,
    dateRange,
    setDateRange,
    userEmail,
    handleLogin,
    handleLogout,
    selectedEmailId,
    handleSelectEmail,
    handleMarkAsUnread,
}) => {
    const { tasks, assignees, notes, users, tickets, emails } = boardData;

    const renderContent = () => {
        switch (activeTab) {
            case 'Projects':
                return <CheckBoard 
                            data={boardData} 
                            activeBoardId={activeBoardId}
                            setActiveBoardId={setActiveBoardId}
                            onTaskCheck={handleTaskCheck}
                            onTaskMove={handleTaskMove}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                        />;
            case 'Schedule':
                return <ScheduleView tasks={Object.values(tasks)} assignees={assignees} selectedDate={selectedDate} onDeleteTaskRequest={handleDeleteTaskRequest} onViewTask={handleViewTask} />;
            case 'Daily Checklist':
                return <DailyChecklistView tasks={Object.values(tasks)} selectedDate={selectedDate} handleTaskCheck={handleTaskCheck} onViewTask={handleViewTask} />;
            case 'Notes':
                return <NotesView notes={Object.values(notes)} />;
            case 'Tickets':
                return <TicketBoard tickets={Object.values(tickets)} onTicketMove={handleTicketMove} />;
            case 'Timeline (Gantt)':
                return <UserManagementDashboard 
                            users={Object.values(users)} 
                            onAddUserClick={handleOpenAddUserModal}
                            onEditUserClick={handleOpenEditUserModal}
                            onBulkDeleteClick={handleBulkDeleteRequest}
                        />;
            case 'Inbox':
                if (!userEmail) {
                    return <LoginForm onLogin={handleLogin} />;
                }
                const selectedEmail = selectedEmailId ? emails[selectedEmailId] : null;
                return <InboxView
                            emails={Object.values(emails)}
                            selectedEmail={selectedEmail}
                            onSelectEmail={handleSelectEmail}
                            onMarkAsUnread={handleMarkAsUnread}
                            onLogout={handleLogout}
                            userEmail={userEmail}
                        />;
            case 'Teams':
            case 'Goals':
            case 'Analytics':
            case 'Files':
            case 'Settings':
                return <PlaceholderView title={activeTab} />;
            default:
                return <PlaceholderView title="Content" />;
        }
    };

    return <main className="flex-1 flex flex-col min-w-0">{renderContent()}</main>;
};

export default ContentView;