import React, { useState, useCallback, useMemo } from 'react';
import GlobalHeader from './components/GlobalHeader';
import CalendarView from './components/CalendarView';
import PrimaryNav from './components/PrimaryNav';
import ContentView from './components/ContentView';
import { BoardData, Tab, Task, Board, Column, Note, User, Ticket, TicketStatus, Notification } from './types';
import { INITIAL_BOARD_DATA } from './constants';
import Modal from './components/Modal';
import NewTaskForm from './components/forms/NewTaskForm';
import NewProjectForm from './components/forms/NewProjectForm';
import NewNoteForm from './components/forms/NewNoteForm';
import PlaceholderForm from './components/forms/PlaceholderForm';
import NewUserForm from './components/forms/NewUserForm';
import NewTicketForm from './components/forms/NewTicketForm';
import StatusBar from './components/StatusBar';
import AttentionStatusBar from './components/AttentionStatusBar';
import NotificationPanel from './components/NotificationPanel';
import TaskDetailModal from './components/TaskDetailModal';

const App: React.FC = () => {
    const [boardData, setBoardData] = useState<BoardData>(INITIAL_BOARD_DATA);
    const [activeTab, setActiveTab] = useState<Tab>('Schedule');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isCalendarCollapsed, setIsCalendarCollapsed] = useState<boolean>(false);
    const [activeBoardId, setActiveBoardId] = useState<string>('board-1');
    const [dateRange, setDateRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
    const [modalType, setModalType] = useState<Tab | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [usersToDelete, setUsersToDelete] = useState<string[]>([]);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const [dismissedNotificationIds, setDismissedNotificationIds] = useState<Set<string>>(new Set());
    const [taskToView, setTaskToView] = useState<Task | null>(null);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

    const allPossibleNotifications = useMemo<Notification[]>(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toDateString();

        return Object.values(boardData.tasks)
            .filter(task => !task.isCompleted && new Date(task.dueDate).toDateString() === tomorrowString)
            .map(task => ({
                id: `notif-${task.id}`,
                taskId: task.id,
                message: `Task "${task.title}" is due tomorrow.`,
                createdAt: new Date().toISOString(),
            }));
    }, [boardData.tasks]);

    const activeNotifications = useMemo(() => {
        return allPossibleNotifications.filter(n => !dismissedNotificationIds.has(n.id));
    }, [allPossibleNotifications, dismissedNotificationIds]);

    const toggleNotificationPanel = useCallback(() => {
        setIsNotificationPanelOpen(prev => !prev);
    }, []);

    const handleClearNotifications = useCallback(() => {
        setDismissedNotificationIds(prev => {
            const newDismissed = new Set(prev);
            activeNotifications.forEach(n => newDismissed.add(n.id));
            return newDismissed;
        });
        setIsNotificationPanelOpen(false);
    }, [activeNotifications]);

    const toggleCalendar = useCallback(() => {
        setIsCalendarCollapsed(prev => !prev);
    }, []);
    
    const handleTaskCheck = useCallback((taskId: string, isCompleted: boolean) => {
        setBoardData(prevData => {
            const newTasks = { ...prevData.tasks };
            const task = { ...newTasks[taskId], isCompleted };
            newTasks[taskId] = task;
            return { ...prevData, tasks: newTasks };
        });
    }, []);

    const handleTaskMove = useCallback((taskId: string, newColumnId: string) => {
        setBoardData(prevData => {
            const task = prevData.tasks[taskId];
            const oldColumnId = task.columnId;

            if (oldColumnId === newColumnId) return prevData;

            const oldColumn = { ...prevData.columns[oldColumnId], taskIds: prevData.columns[oldColumnId].taskIds.filter(id => id !== taskId) };
            const newColumn = { ...prevData.columns[newColumnId], taskIds: [...prevData.columns[newColumnId].taskIds, taskId] };

            return {
                ...prevData,
                columns: { ...prevData.columns, [oldColumnId]: oldColumn, [newColumnId]: newColumn },
                tasks: { ...prevData.tasks, [taskId]: { ...task, columnId: newColumnId } },
            };
        });
    }, []);

    const handleTicketMove = useCallback((ticketId: string, newStatus: TicketStatus) => {
        setBoardData(prevData => ({
            ...prevData,
            tickets: { ...prevData.tickets, [ticketId]: { ...prevData.tickets[ticketId], status: newStatus } },
        }));
    }, []);

    const handleDeleteTaskRequest = useCallback((taskId: string) => {
        setTaskToDelete(taskId);
    }, []);

    const confirmDeleteTask = useCallback(() => {
        if (!taskToDelete) return;
        setBoardData(prevData => {
            const task = prevData.tasks[taskToDelete];
            const newTasks = { ...prevData.tasks };
            delete newTasks[taskToDelete];
            const sourceColumn = prevData.columns[task.columnId];
            const newColumns = {
                ...prevData.columns,
                [task.columnId]: { ...sourceColumn, taskIds: sourceColumn.taskIds.filter(id => id !== taskToDelete) },
            };
            return { ...prevData, tasks: newTasks, columns: newColumns };
        });
        setTaskToDelete(null);
    }, [taskToDelete]);
    
    const handleAddClick = (tab: Tab) => setModalType(tab);
    const handleCloseModal = useCallback(() => setModalType(null), []);

    const handleSaveTask = useCallback((taskData: Omit<Task, 'id' | 'isCompleted' | 'columnId'> | Task) => {
        if ('id' in taskData) {
            // Editing
            setBoardData(prevData => ({
                ...prevData,
                tasks: { ...prevData.tasks, [taskData.id]: { ...prevData.tasks[taskData.id], ...taskData } },
            }));
            setTaskToEdit(null);
        } else {
            // Creating
            setBoardData(prevData => {
                const newTaskId = `task-${Date.now()}`;
                const taskToAdd: Task = { ...taskData, id: newTaskId, isCompleted: false, columnId: 'col-2' }; // default to To-Do
                const newTasks = { ...prevData.tasks, [newTaskId]: taskToAdd };
                const todoColumn = { ...prevData.columns['col-2'], taskIds: [...prevData.columns['col-2'].taskIds, newTaskId] };
                return { ...prevData, tasks: newTasks, columns: { ...prevData.columns, 'col-2': todoColumn } };
            });
            setModalType(null);
        }
    }, []);
    
    const handleAddProject = useCallback((projectName: string) => {
        const newBoardId = `board-${Date.now()}`;
        const newColumnData = Array.from({ length: 8 }, (_, i) => ({
            id: `col-${Date.now()}-${i + 1}`,
            title: ['Backlog', 'To-Do', 'In Progress', 'In Review', 'Blocked', 'Needs Info', 'Done', 'Archived'][i],
            taskIds: []
        }));
        const newBoard: Board = { id: newBoardId, name: projectName, columnIds: newColumnData.map(c => c.id) };
        const newColumns = newColumnData.reduce((acc, col) => ({ ...acc, [col.id]: col }), {});
        
        setBoardData(prevData => ({
            ...prevData,
            boards: { ...prevData.boards, [newBoardId]: newBoard },
            columns: { ...prevData.columns, ...newColumns },
        }));
        
        setActiveBoardId(newBoardId);
        setActiveTab('Projects');
        handleCloseModal();
    }, [handleCloseModal, setActiveTab, setActiveBoardId]);

    const handleAddNote = useCallback((noteDetails: Omit<Note, 'id' | 'createdAt'>) => {
        const newNoteId = `note-${Date.now()}`;
        const noteToAdd: Note = { ...noteDetails, id: newNoteId, createdAt: new Date().toISOString() };
        setBoardData(p => ({ ...p, notes: { ...p.notes, [newNoteId]: noteToAdd } }));
        handleCloseModal();
    }, [handleCloseModal]);
    
    const handleAddTicket = useCallback((ticketDetails: Omit<Ticket, 'id' | 'status'>) => {
        const newTicketId = `ticket-${Date.now()}`;
        const ticketToAdd: Ticket = { ...ticketDetails, id: newTicketId, status: 'Open' };
        setBoardData(p => ({ ...p, tickets: { ...p.tickets, [newTicketId]: ticketToAdd } }));
        handleCloseModal();
    }, [handleCloseModal]);

    const handleAddNewUser = useCallback((newUser: Omit<User, 'id' | 'created' | 'lastEdited'>) => {
        const now = new Date().toISOString();
        const newUserId = `user-${Date.now()}`;
        const userToAdd: User = { ...newUser, id: newUserId, created: now, lastEdited: now };
        setBoardData(p => ({ ...p, users: { ...p.users, [newUserId]: userToAdd } }));
        handleCloseModal();
    }, [handleCloseModal]);

    const handleOpenEditUserModal = useCallback((user: User) => setUserToEdit(user), []);
    const handleCloseEditUserModal = useCallback(() => setUserToEdit(null), []);

    const handleEditUser = useCallback((updatedUserData: User) => {
        setBoardData(p => ({ ...p, users: { ...p.users, [updatedUserData.id]: { ...updatedUserData, lastEdited: new Date().toISOString() } } }));
        handleCloseEditUserModal();
    }, [handleCloseEditUserModal]);

    const handleOpenBulkDeleteModal = useCallback((userIds: string[]) => setUsersToDelete(userIds), []);
    const handleCloseBulkDeleteModal = useCallback(() => setUsersToDelete([]), []);

    const handleConfirmBulkDelete = useCallback(() => {
        if (usersToDelete.length === 0) return;
        setBoardData(prevData => {
            const newUsers = { ...prevData.users };
            usersToDelete.forEach(id => delete newUsers[id]);
            return { ...prevData, users: newUsers };
        });
        setUsersToDelete([]);
    }, [usersToDelete]);
    
    const overdueTasksCount = useMemo(() => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        return Object.values(boardData.tasks).filter(
            task => !task.isCompleted && new Date(task.dueDate) < startOfToday
        ).length;
    }, [boardData.tasks]);

    const blockedTasksCount = useMemo(() => {
        const blockedColumns = Object.values(boardData.columns).filter(c => c.title === 'Blocked');
        const blockedTaskIds = blockedColumns.flatMap(c => c.taskIds);
        return blockedTaskIds.filter(id => boardData.tasks[id] && !boardData.tasks[id].isCompleted).length;
    }, [boardData.columns, boardData.tasks]);

    const handleDownloadState = useCallback(() => {
        try {
            const stateString = JSON.stringify(boardData, null, 2);
            const blob = new Blob([stateString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `projectflow-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download data:", error);
            alert("Could not download data. See console for details.");
        }
    }, [boardData]);

    const handleUploadState = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    const parsedState: BoardData = JSON.parse(text);
                    if (parsedState.tasks && parsedState.boards && parsedState.columns) {
                        setBoardData(parsedState);
                        alert('Data uploaded successfully!');
                    } else {
                        throw new Error("Invalid file structure.");
                    }
                }
            } catch (error) {
                console.error("Failed to parse uploaded file:", error);
                alert('Failed to upload data. Please ensure it is a valid backup file.');
            } finally {
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    }, []);
    
    const handleViewTask = useCallback((taskId: string) => {
        const task = boardData.tasks[taskId];
        if (task) {
            setTaskToView(task);
        }
    }, [boardData.tasks]);

    const handleCloseViewTaskModal = useCallback(() => setTaskToView(null), []);

    const handleOpenEditTaskModal = useCallback((task: Task) => {
        setTaskToView(null);
        setTaskToEdit(task);
    }, []);

    const handleCloseEditTaskModal = useCallback(() => setTaskToEdit(null), []);

    const handleLogin = useCallback((email: string) => {
        setUserEmail(email);
        setSelectedEmailId(null);
    }, []);

    const handleLogout = useCallback(() => {
        setUserEmail(null);
        setSelectedEmailId(null);
    }, []);

    const handleSelectEmail = useCallback((emailId: string) => {
        setSelectedEmailId(emailId);
        setBoardData(prevData => {
            const email = prevData.emails[emailId];
            if (email && !email.isRead) {
                const newEmails = { ...prevData.emails, [emailId]: { ...email, isRead: true } };
                return { ...prevData, emails: newEmails };
            }
            return prevData;
        });
    }, []);

    const handleMarkAsUnread = useCallback((emailId: string) => {
        setBoardData(prevData => {
            const email = prevData.emails[emailId];
            if (email && email.isRead) {
                const newEmails = { ...prevData.emails, [emailId]: { ...email, isRead: false } };
                return { ...prevData, emails: newEmails };
            }
            return prevData;
        });
    }, []);

    const getModalContent = () => {
        switch (modalType) {
            case 'Daily Checklist':
            case 'Schedule':
                return <NewTaskForm onSave={handleSaveTask} onCancel={handleCloseModal} assignees={Object.values(boardData.assignees)} selectedDate={selectedDate} />;
            case 'Timeline (Gantt)':
                return <NewUserForm onSave={handleAddNewUser} onCancel={handleCloseModal} />;
            case 'Projects':
                return <NewProjectForm onAddProject={handleAddProject} onCancel={handleCloseModal} />;
            case 'Notes':
                return <NewNoteForm onAddNote={handleAddNote} onCancel={handleCloseModal} />;
            case 'Tickets':
                return <NewTicketForm onAddTicket={handleAddTicket} onCancel={handleCloseModal} />;
            case 'Teams': case 'Goals': case 'Files': case 'Inbox': case 'Analytics': case 'Settings':
                return modalType ? <PlaceholderForm tabName={modalType} onCancel={handleCloseModal} /> : null;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col text-text-primary bg-gradient-to-br from-background-start to-background-end overflow-hidden">
            <GlobalHeader 
                onDownload={handleDownloadState} 
                onUpload={handleUploadState}
                notificationCount={activeNotifications.length}
                onBellClick={toggleNotificationPanel}
            />
             {isNotificationPanelOpen && (
                <NotificationPanel 
                    notifications={activeNotifications} 
                    tasks={boardData.tasks}
                    onClear={handleClearNotifications}
                    onClose={toggleNotificationPanel}
                />
            )}
            <AttentionStatusBar overdueCount={overdueTasksCount} blockedCount={blockedTasksCount} />
            <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
                <CalendarView isCollapsed={isCalendarCollapsed} toggleCollapse={toggleCalendar} selectedDate={selectedDate} onDateSelect={setSelectedDate} tasks={Object.values(boardData.tasks)} />
                <div className="flex-1 flex flex-col bg-white/60 mx-8px mb-8px rounded-card shadow-inner">
                    <PrimaryNav activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={handleAddClick} modalType={modalType} />
                    <ContentView 
                        activeTab={activeTab}
                        boardData={boardData}
                        activeBoardId={activeBoardId}
                        setActiveBoardId={setActiveBoardId}
                        handleTaskCheck={handleTaskCheck}
                        handleTaskMove={handleTaskMove}
                        handleTicketMove={handleTicketMove}
                        handleDeleteTaskRequest={handleDeleteTaskRequest}
                        handleOpenAddUserModal={() => handleAddClick('Timeline (Gantt)')}
                        handleOpenEditUserModal={handleOpenEditUserModal}
                        handleBulkDeleteRequest={handleOpenBulkDeleteModal}
                        handleViewTask={handleViewTask}
                        selectedDate={selectedDate}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        userEmail={userEmail}
                        handleLogin={handleLogin}
                        handleLogout={handleLogout}
                        selectedEmailId={selectedEmailId}
                        handleSelectEmail={handleSelectEmail}
                        handleMarkAsUnread={handleMarkAsUnread}
                    />
                </div>
            </div>
            <StatusBar projectCount={Object.keys(boardData.boards).length} taskCount={Object.keys(boardData.tasks).length} />
            
            <Modal isOpen={!!modalType} onClose={handleCloseModal} title={`Add New ${modalType}`}>
                 {getModalContent()}
            </Modal>
            <Modal isOpen={!!taskToDelete} onClose={() => setTaskToDelete(null)} title="Confirm Deletion">
                <div>
                    <p className="text-text-secondary mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setTaskToDelete(null)} className="px-4 py-2 text-sm font-semibold rounded-button hover:bg-secondary-accent">Cancel</button>
                        <button type="button" onClick={confirmDeleteTask} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-button hover:bg-red-600">Delete</button>
                    </div>
                </div>
            </Modal>
             <Modal isOpen={!!userToEdit} onClose={handleCloseEditUserModal} title="Edit User">
                <NewUserForm onSave={handleEditUser as (user: User | Omit<User, 'id' | 'created' | 'lastEdited'>) => void} onCancel={handleCloseEditUserModal} initialData={userToEdit} />
            </Modal>
            <Modal isOpen={usersToDelete.length > 0} onClose={handleCloseBulkDeleteModal} title="Confirm Bulk Deletion">
                <div>
                    <p className="text-text-secondary mb-6">Are you sure you want to delete {usersToDelete.length} selected user(s)? This action cannot be undone.</p>
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={handleCloseBulkDeleteModal} className="px-4 py-2 text-sm font-semibold rounded-button hover:bg-secondary-accent">Cancel</button>
                        <button type="button" onClick={handleConfirmBulkDelete} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-button hover:bg-red-600">Delete Users</button>
                    </div>
                </div>
            </Modal>
            <Modal isOpen={!!taskToView} onClose={handleCloseViewTaskModal} title={taskToView?.title || 'Task Details'}>
                {taskToView && (
                    <TaskDetailModal 
                        task={taskToView}
                        assignee={boardData.assignees[taskToView.assigneeId]}
                        onClose={handleCloseViewTaskModal}
                        onEdit={() => handleOpenEditTaskModal(taskToView)}
                        onDelete={() => {
                            handleDeleteTaskRequest(taskToView.id);
                            handleCloseViewTaskModal();
                        }}
                    />
                )}
            </Modal>
            <Modal isOpen={!!taskToEdit} onClose={handleCloseEditTaskModal} title="Edit Task">
                {taskToEdit && <NewTaskForm
                    onSave={handleSaveTask}
                    onCancel={handleCloseEditTaskModal}
                    assignees={Object.values(boardData.assignees)}
                    initialData={taskToEdit}
                />}
            </Modal>
        </div>
    );
};

export default App;