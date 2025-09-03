import React from 'react';
import { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('ticketId', ticket.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex flex-col">
        <p className="font-semibold text-text-primary mb-2">{ticket.title}</p>
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>ID: {ticket.id.slice(0, 8)}</span>
          <span>User: {ticket.userId}</span>
          <span>Reporter: {ticket.reporter}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
