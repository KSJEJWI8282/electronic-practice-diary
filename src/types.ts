import type { Language } from './i18n';

export type Role = 'student' | 'supervisor' | 'teacher';
export type ThemeMode = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  role: Role;
  group?: string;
  email: string;
  avatar?: string;
  phone?: string;
  telegramId?: string;
  registeredDate: string;
  approved: boolean;
  approvedBy?: string;
}

export interface PendingRegistration {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  group?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Practice {
  id: string;
  type: string;
  title: string;
  startDate: string;
  endDate: string;
  group: string;
  supervisorId: string;
  status: 'active' | 'completed' | 'upcoming';
}

export interface DiaryEntry {
  id: string;
  studentId: string;
  practiceId: string;
  date: string;
  description: string;
  hours: number;
  confirmed: boolean;
  comment?: string;
  rating?: number;
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  studentId: string;
  studentName?: string;
  practiceId: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewComment?: string;
  dataUrl?: string;
}

export interface TestTemplate {
  id: string;
  title: string;
  topic: string;
  description: string;
  topicMaterial: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: TestQuestion[];
  isTemplate: boolean;
  createdBy?: string;
  createdAt?: string;
  timeLimit?: number;
  passingScore?: number;
}

export interface TestQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface AssignedTest {
  id: string;
  templateId: string;
  title: string;
  topic: string;
  topicMaterial?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: TestQuestion[];
  assignedTo: string;
  assignedBy: string;
  assignedDate: string;
  deadline: string;
  timeLimit?: number;
  passingScore?: number;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  completedDate: string;
  answers: number[];
  timeSpent?: number;
}

export interface Grade {
  id: string;
  studentId: string;
  category: string;
  subcategory: string;
  score: number;
  maxScore: number;
  date: string;
  comment?: string;
  givenBy: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'diary' | 'file' | 'test' | 'comment' | 'system' | 'grade' | 'approval';
}

export interface TelegramSettings {
  enabled: boolean;
  botToken: string;
  chatId: string;
  webhookUrl: string;
  notifications: {
    newEntry: boolean;
    confirmedHours: boolean;
    newComment: boolean;
    testAssigned: boolean;
    testCompleted: boolean;
    fileUploaded: boolean;
    gradeAdded: boolean;
    registrationRequest: boolean;
  };
}

export interface AppSettings {
  language: Language;
  theme: ThemeMode;
}

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}
