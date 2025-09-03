import React, { useState, useMemo, useCallback, useEffect } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { Task } from '../types';

interface CalendarViewProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  tasks: Task[];
}

// Helper to check if two dates are the same day (ignoring time)
const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};


const CalendarView: React.FC<CalendarViewProps> = ({ isCollapsed, toggleCollapse, selectedDate, onDateSelect, tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // This is for the month being viewed
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const taskDates = useMemo(() => {
    const dates = new Set<string>();
    tasks.forEach(task => {
        // Use toISOString().split('T')[0] for a reliable YYYY-MM-DD key
        dates.add(new Date(task.dueDate).toISOString().split('T')[0]);
    });
    return dates;
  }, [tasks]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + offset, 1); // Set to day 1 to avoid month-end issues
        return newDate;
    });
  };

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(today);
  }, [onDateSelect]);
  
  const renderCalendarGrid = () => {
    const today = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const days = [];
    const date = new Date(firstDayOfMonth);
    date.setDate(date.getDate() - startingDayOfWeek); // Rewind to the first day of the first week (a Sunday)

    // Generate 42 days to fill a 6x7 grid
    for (let i = 0; i < 42; i++) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    
    return days.map((day, index) => {
      const isCurrentMonth = day.getMonth() === month;
      const isSelected = isSameDay(day, selectedDate);
      const isToday = isSameDay(day, today);
      const hasTask = taskDates.has(day.toISOString().split('T')[0]);

      const dayClasses = [
        'flex justify-center items-center rounded-lg h-16 transition-colors duration-200',
        isCurrentMonth ? 'cursor-pointer hover:bg-secondary-accent' : 'text-gray-300',
      ].join(' ');

      const numberClasses = [
        'w-9 h-9 flex items-center justify-center rounded-full relative transition-all duration-200',
        isToday && 'ring-2 ring-primary-accent/70',
        isSelected && 'bg-primary-accent text-white font-bold shadow-md',
        isToday && !isSelected && 'text-primary-accent font-semibold'
      ].filter(Boolean).join(' ');

      return (
        <div key={index} className={dayClasses} onClick={() => isCurrentMonth && onDateSelect(day)}>
          <div className={numberClasses}>
            {day.getDate()}
            {hasTask && isCurrentMonth && <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary-accent"></div>}
          </div>
        </div>
      );
    });
  };

  const renderWeekView = () => {
    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const weekDays = Array.from({length: 7}, (_, i) => {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        return day;
    });
        
    return weekDays.map((day, index) => {
         const isSelected = isSameDay(day, selectedDate);
         const hasTask = taskDates.has(day.toISOString().split('T')[0]);
         
         const dayClasses = [
           'flex flex-col items-center p-2 cursor-pointer rounded-lg hover:bg-secondary-accent transition-colors',
         ].join(' ');

         const numberClasses = [
            'mt-1 w-9 h-9 flex items-center justify-center rounded-full relative transition-colors duration-200',
            isSelected ? 'bg-primary-accent text-white font-bold shadow-sm' : ''
         ].filter(Boolean).join(' ');

         return (
             <div key={`week-${index}`} className={dayClasses} onClick={() => onDateSelect(day)}>
                 <span className="text-sm text-text-secondary">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                 <div className={numberClasses}>
                    {day.getDate()}
                    {hasTask && <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary-accent"></div>}
                 </div>
             </div>
         );
    });
  };


  return (
    <div className="bg-white rounded-card shadow-card-default m-8px p-24px transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-text-primary w-48 text-left">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-secondary-accent text-text-secondary" aria-label="Previous month">
             <ChevronDownIcon className="w-5 h-5 rotate-90" />
          </button>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-secondary-accent text-text-secondary" aria-label="Next month">
            <ChevronDownIcon className="w-5 h-5 -rotate-90" />
          </button>
           <button 
                onClick={goToToday}
                className="ml-2 px-3 py-1.5 text-sm font-semibold border border-gray-300 rounded-button text-text-secondary hover:bg-secondary-accent hover:border-gray-400 transition-all"
            >
                Today
            </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-text-primary text-lg tabular-nums tracking-wider">
            {time.toLocaleTimeString('en-US')}
          </span>
          <button onClick={toggleCollapse} className={`p-2 rounded-full hover:bg-secondary-accent transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} aria-label={isCollapsed ? "Expand calendar" : "Collapse calendar"}>
              <ChevronDownIcon />
          </button>
        </div>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isCollapsed ? 'grid-cols-7' : 'grid-cols-7'}`}>
         {!isCollapsed && ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-text-secondary pb-2 text-sm">{day}</div>
        ))}
        {isCollapsed ? renderWeekView() : renderCalendarGrid()}
      </div>
    </div>
  );
};

export default CalendarView;