import React from 'react';
import { BoardData } from '../types';
import TaskCard from './TaskCard';

interface CheckBoardProps {
  data: BoardData;
  activeBoardId: string;
  setActiveBoardId: (boardId: string) => void;
  onTaskCheck: (taskId: string, isCompleted: boolean) => void;
  onTaskMove: (taskId: string, newColumnId: string) => void;
  dateRange: { start: string | null; end: string | null };
  setDateRange: React.Dispatch<React.SetStateAction<{ start: string | null; end: string | null }>>;
}

const CheckBoard: React.FC<CheckBoardProps> = ({ data, activeBoardId, setActiveBoardId, onTaskCheck, onTaskMove, dateRange, setDateRange }) => {
  const activeBoard = data.boards[activeBoardId];
  
  if (!activeBoard) {
    return <div className="p-8 text-center text-text-secondary">Board not found.</div>;
  }
  
  const onDrop = (columnId: string, e: React.DragEvent<HTMLDivElement>) => {
      const taskId = e.dataTransfer.getData('taskId');
      if(taskId) {
        onTaskMove(taskId, columnId);
      }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setDateRange(prev => ({ ...prev, [name]: value || null }));
  };

  const clearDateFilter = () => {
      setDateRange({ start: null, end: null });
  };

  return (
    <div className="p-8px flex flex-col h-full">
        <div className="flex items-center justify-between flex-wrap gap-4 px-24px pt-24px pb-4 border-b border-gray-200/80">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-text-primary">{activeBoard.name}</h2>
                 <select 
                    value={activeBoardId}
                    onChange={(e) => setActiveBoardId(e.target.value)}
                    className="p-2 rounded-lg bg-transparent font-semibold text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer"
                 >
                     {Object.values(data.boards).map(board => (
                         <option className="font-normal" key={board.id} value={board.id}>{board.name}</option>
                     ))}
                 </select>
            </div>
             <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Due date:</label>
                <input
                    type="date"
                    name="start"
                    value={dateRange.start || ''}
                    onChange={handleDateChange}
                    className="bg-background-start border border-secondary-accent/50 rounded-button py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-accent"
                />
                <span className="text-text-secondary">-</span>
                <input
                    type="date"
                    name="end"
                    value={dateRange.end || ''}
                    onChange={handleDateChange}
                    className="bg-background-start border border-secondary-accent/50 rounded-button py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-accent"
                />
                {(dateRange.start || dateRange.end) && (
                    <button
                        onClick={clearDateFilter}
                        className="text-xs text-text-secondary hover:text-text-primary font-semibold p-2 rounded-button hover:bg-secondary-accent"
                        title="Clear date filter"
                    >
                        CLEAR
                    </button>
                )}
            </div>
        </div>
        
        <div className="flex-1 flex gap-6 overflow-x-auto p-4">
            {activeBoard.columnIds.map((columnId) => {
                const column = data.columns[columnId];
                
                const filteredTaskIds = column.taskIds.filter(taskId => {
                    const task = data.tasks[taskId];
                    if (!task) return false;

                    const taskDueDate = new Date(task.dueDate);
                    
                    const startMatch = !dateRange.start || taskDueDate >= new Date(dateRange.start + 'T00:00:00');
                    const endMatch = !dateRange.end || taskDueDate <= new Date(dateRange.end + 'T23:59:59');
                    
                    return startMatch && endMatch;
                });

                const tasks = filteredTaskIds.map(taskId => data.tasks[taskId]);

                const DndWrapperColumn = ({ children }: {children: React.ReactNode}) => {
                    const [isOver, setIsOver] = React.useState(false);

                    return (
                        <div 
                            className={`flex-shrink-0 w-80 bg-secondary-accent/50 rounded-card p-4 transition-colors ${isOver ? 'bg-primary-accent/20' : ''} flex flex-col`}
                            onDragOver={(e) => {e.preventDefault(); setIsOver(true);}}
                            onDragLeave={() => setIsOver(false)}
                            onDrop={(e) => {e.preventDefault(); setIsOver(false); onDrop(column.id, e);}}
                        >
                          {children}
                        </div>
                    );
                };
                
                return (
                    <DndWrapperColumn key={column.id}>
                      <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <h3 className="font-semibold text-text-primary">{column.title}</h3>
                        <span className="text-sm font-medium bg-gray-200 text-text-secondary rounded-full px-2 py-0.5">{tasks.length}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
                        {tasks.map((task) => (
                          <TaskCard key={task.id} task={task} assignee={data.assignees[task.assigneeId]} onCheck={onTaskCheck} />
                        ))}
                      </div>
                    </DndWrapperColumn>
                );
            })}
        </div>
    </div>
  );
}


export default CheckBoard;