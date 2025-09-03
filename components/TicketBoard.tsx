import React, { useMemo, useState } from 'react';
import { Ticket, TicketStatus } from '../types';
import TicketCard from './TicketCard';
import SearchIcon from './icons/SearchIcon';

interface TicketBoardProps {
  tickets: Ticket[];
  onTicketMove: (ticketId: string, newStatus: TicketStatus) => void;
}

const TicketColumn: React.FC<{
  title: string;
  tickets: Ticket[];
  status: TicketStatus;
  onTicketMove: (ticketId: string, newStatus: TicketStatus) => void;
}> = ({ title, tickets, status, onTicketMove }) => {
  const [isOver, setIsOver] = React.useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId) {
      onTicketMove(ticketId, status);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  return (
    <div 
      className={`bg-secondary-accent/50 rounded-lg p-4 flex-1 flex flex-col transition-colors duration-200 ${isOver ? 'bg-primary-accent/20' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsOver(false)}
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="font-bold text-text-primary">{title}</h3>
        <span className="text-sm font-medium bg-gray-200 text-text-secondary rounded-full px-2 py-0.5">{tickets.length}</span>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {tickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

const TicketBoard: React.FC<TicketBoardProps> = ({ tickets, onTicketMove }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<TicketStatus | 'All'>('All');

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const searchMatch = searchTerm.trim() === '' ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.reporter.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = activeFilter === 'All' || ticket.status === activeFilter;
      return searchMatch && statusMatch;
    });
  }, [tickets, searchTerm, activeFilter]);

  const categorizedTickets = useMemo(() => {
    return filteredTickets.reduce((acc, ticket) => {
      if (!acc[ticket.status]) {
        acc[ticket.status] = [];
      }
      acc[ticket.status].push(ticket);
      return acc;
    }, {} as Record<TicketStatus, Ticket[]>);
  }, [filteredTickets]);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4 flex-shrink-0">
      <h2 className="text-2xl font-bold text-text-primary">Support Tickets</h2>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search title or reporter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background-start border border-gray-200/80 rounded-button py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-accent transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-secondary-accent/50 rounded-button">
          {(['All', 'Open', 'In Progress', 'Closed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1 text-sm font-semibold rounded-lg transition-colors ${
                activeFilter === status ? 'bg-white text-primary-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 flex-1 flex flex-col">
      {renderHeader()}
      <div className="flex gap-6 flex-1 min-h-0">
        <TicketColumn title="Open" tickets={categorizedTickets['Open'] || []} status="Open" onTicketMove={onTicketMove} />
        <TicketColumn title="In Progress" tickets={categorizedTickets['In Progress'] || []} status="In Progress" onTicketMove={onTicketMove} />
        <TicketColumn title="Closed" tickets={categorizedTickets['Closed'] || []} status="Closed" onTicketMove={onTicketMove} />
      </div>
    </div>
  );
};

export default TicketBoard;