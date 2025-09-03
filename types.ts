export type Priority = 'High' | 'Medium' | 'Low';

export interface Assignee {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string; // ISO string format
  assigneeId: string;
  priority: Priority;
  isCompleted: boolean;
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  name: string;
  columnIds: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
}

export type UserStatus = 'Approved' | 'Denied';

export interface User {
  id: string;
  name: string;
  email: string;
  userId: string;
  created: string; // ISO string
  lastEdited: string; // ISO string
  status: UserStatus;
}

export type TicketStatus = 'Open' | 'In Progress' | 'Closed';

export interface Ticket {
  id: string;
  title: string;
  reporter: string;
  status: TicketStatus;
  userId: string;
}

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  body: string;
  timestamp: string; // ISO string
  isRead: boolean;
  avatarUrl: string;
}

export interface BoardData {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  boards: Record<string, Board>;
  assignees: Record<string, Assignee>;
  notes: Record<string, Note>;
  users: Record<string, User>;
  tickets: Record<string, Ticket>;
  emails: Record<string, Email>;
}

export const TABS = [
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
] as const;

export type Tab = typeof TABS[number];

export interface Notification {
  id: string;
  taskId: string;
  message: string;
  createdAt: string;
}