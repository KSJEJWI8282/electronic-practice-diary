import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, DiaryEntry, UploadedFile, AssignedTest, TestResult, TestTemplate, Notification, ActivityLog, TelegramSettings, Grade, PendingRegistration, Toast } from '../types';
import {
  users as initialUsers,
  diaryEntries as initialDiary, uploadedFiles as initialFiles,
  assignedTests as initialAssigned, testResults as initialResults,
  testTemplates as initialTemplates, initialNotifications, initialActivityLog,
  initialGrades, pendingRegistrations as initialPending,
} from '../data';

interface DataContextType {
  allUsers: User[];
  diary: DiaryEntry[];
  files: UploadedFile[];
  assignedTests: AssignedTest[];
  testResults: TestResult[];
  templates: TestTemplate[];
  notifications: Notification[];
  activityLog: ActivityLog[];
  telegramSettings: TelegramSettings;
  grades: Grade[];
  pendingRegistrations: PendingRegistration[];
  toasts: Toast[];
  addDiaryEntry: (e: DiaryEntry) => void;
  updateDiaryEntry: (id: string, u: Partial<DiaryEntry>) => void;
  deleteDiaryEntry: (id: string) => void;
  addFile: (f: UploadedFile) => void;
  deleteFile: (id: string) => void;
  updateFileStatus: (id: string, s: UploadedFile['status'], c?: string) => void;
  confirmHours: (id: string) => void;
  confirmAllHours: (ids: string[]) => void;
  addComment: (id: string, c: string) => void;
  addRating: (id: string, r: number) => void;
  addTemplate: (t: TestTemplate) => void;
  updateTemplate: (id: string, u: Partial<TestTemplate>) => void;
  deleteTemplate: (id: string) => void;
  assignTest: (t: AssignedTest) => void;
  addTestResult: (r: TestResult) => void;
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (uid: string) => void;
  addActivity: (a: ActivityLog) => void;
  updateTelegramSettings: (s: Partial<TelegramSettings>) => void;
  getUnreadCount: (uid: string) => number;
  addGrade: (g: Grade) => void;
  updateGrade: (id: string, u: Partial<Grade>) => void;
  deleteGrade: (id: string) => void;
  approveRegistration: (id: string) => void;
  rejectRegistration: (id: string) => void;
  addPendingRegistration: (p: PendingRegistration) => void;
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

function load<T>(key: string, fallback: T): T {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}

const defaultTgSettings: TelegramSettings = {
  enabled: false, botToken: '', chatId: '', webhookUrl: '',
  notifications: { newEntry: true, confirmedHours: true, newComment: true, testAssigned: true, testCompleted: true, fileUploaded: true, gradeAdded: true, registrationRequest: true },
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [allUsers, setAllUsers] = useState<User[]>(() => load('allUsers', initialUsers));
  const [diary, setDiary] = useState<DiaryEntry[]>(() => load('diary', initialDiary));
  const [files, setFiles] = useState<UploadedFile[]>(() => load('files', initialFiles));
  const [assignedTestsList, setAssigned] = useState<AssignedTest[]>(() => load('assignedTests', initialAssigned));
  const [testResultsList, setResults] = useState<TestResult[]>(() => load('testResults', initialResults));
  const [templates, setTemplates] = useState<TestTemplate[]>(() => load('templates', initialTemplates));
  const [notifications, setNotifs] = useState<Notification[]>(() => load('notifications', initialNotifications));
  const [activityLog, setActivity] = useState<ActivityLog[]>(() => load('activityLog', initialActivityLog));
  const [telegramSettings, setTgSettings] = useState<TelegramSettings>(() => load('telegramSettings', defaultTgSettings));
  const [grades, setGrades] = useState<Grade[]>(() => load('grades', initialGrades));
  const [pendingRegistrations, setPending] = useState<PendingRegistration[]>(() => load('pendingRegs', initialPending));
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => { localStorage.setItem('allUsers', JSON.stringify(allUsers)); }, [allUsers]);
  useEffect(() => { localStorage.setItem('diary', JSON.stringify(diary)); }, [diary]);
  useEffect(() => { localStorage.setItem('files', JSON.stringify(files)); }, [files]);
  useEffect(() => { localStorage.setItem('assignedTests', JSON.stringify(assignedTestsList)); }, [assignedTestsList]);
  useEffect(() => { localStorage.setItem('testResults', JSON.stringify(testResultsList)); }, [testResultsList]);
  useEffect(() => { localStorage.setItem('templates', JSON.stringify(templates)); }, [templates]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('activityLog', JSON.stringify(activityLog)); }, [activityLog]);
  useEffect(() => { localStorage.setItem('telegramSettings', JSON.stringify(telegramSettings)); }, [telegramSettings]);
  useEffect(() => { localStorage.setItem('grades', JSON.stringify(grades)); }, [grades]);
  useEffect(() => { localStorage.setItem('pendingRegs', JSON.stringify(pendingRegistrations)); }, [pendingRegistrations]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  const dismissToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  const addDiaryEntry = useCallback((e: DiaryEntry) => { setDiary(p => [...p, e]); showToast('Запись добавлена', 'success'); }, [showToast]);
  const updateDiaryEntry = useCallback((id: string, u: Partial<DiaryEntry>) => setDiary(p => p.map(e => e.id === id ? { ...e, ...u } : e)), []);
  const deleteDiaryEntry = useCallback((id: string) => { setDiary(p => p.filter(e => e.id !== id)); showToast('Запись удалена', 'info'); }, [showToast]);

  const addFile = useCallback((f: UploadedFile) => { setFiles(p => [...p, f]); showToast('Файл загружен', 'success'); }, [showToast]);
  const deleteFile = useCallback((id: string) => { setFiles(p => p.filter(f => f.id !== id)); showToast('Файл удалён', 'info'); }, [showToast]);
  const updateFileStatus = useCallback((id: string, s: UploadedFile['status'], c?: string) => {
    setFiles(p => p.map(f => f.id === id ? { ...f, status: s, reviewComment: c || f.reviewComment } : f));
    showToast('Статус файла обновлён', 'success');
  }, [showToast]);

  const confirmHours = useCallback((id: string) => { setDiary(p => p.map(e => e.id === id ? { ...e, confirmed: true } : e)); showToast('Часы подтверждены', 'success'); }, [showToast]);
  const confirmAllHours = useCallback((ids: string[]) => { setDiary(p => p.map(e => ids.includes(e.id) ? { ...e, confirmed: true } : e)); showToast(`Подтверждено ${ids.length} записей`, 'success'); }, [showToast]);
  const addComment = useCallback((id: string, c: string) => { setDiary(p => p.map(e => e.id === id ? { ...e, comment: c } : e)); showToast('Комментарий добавлен', 'success'); }, [showToast]);
  const addRating = useCallback((id: string, r: number) => setDiary(p => p.map(e => e.id === id ? { ...e, rating: r } : e)), []);

  const addTemplate = useCallback((t: TestTemplate) => { setTemplates(p => [...p, t]); showToast('Шаблон сохранён', 'success'); }, [showToast]);
  const updateTemplate = useCallback((id: string, u: Partial<TestTemplate>) => { setTemplates(p => p.map(t => t.id === id ? { ...t, ...u } : t)); showToast('Шаблон обновлён', 'success'); }, [showToast]);
  const deleteTemplate = useCallback((id: string) => { setTemplates(p => p.filter(t => t.id !== id)); showToast('Шаблон удалён', 'info'); }, [showToast]);

  const assignTest = useCallback((t: AssignedTest) => { setAssigned(p => [...p, t]); showToast('Тест назначен', 'success'); }, [showToast]);
  const addTestResult = useCallback((r: TestResult) => { setResults(p => [...p, r]); }, []);

  const addNotification = useCallback((n: Notification) => setNotifs(p => [n, ...p]), []);
  const markNotificationRead = useCallback((id: string) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const markAllNotificationsRead = useCallback((uid: string) => setNotifs(p => p.map(n => n.userId === uid ? { ...n, read: true } : n)), []);

  const addActivity = useCallback((a: ActivityLog) => setActivity(p => [a, ...p]), []);
  const updateTelegramSettings = useCallback((s: Partial<TelegramSettings>) => { setTgSettings(p => ({ ...p, ...s })); showToast('Настройки сохранены', 'success'); }, [showToast]);
  const getUnreadCount = useCallback((uid: string) => notifications.filter(n => n.userId === uid && !n.read).length, [notifications]);

  const addGrade = useCallback((g: Grade) => { setGrades(p => [...p, g]); showToast('Оценка добавлена', 'success'); }, [showToast]);
  const updateGrade = useCallback((id: string, u: Partial<Grade>) => { setGrades(p => p.map(g => g.id === id ? { ...g, ...u } : g)); }, []);
  const deleteGrade = useCallback((id: string) => { setGrades(p => p.filter(g => g.id !== id)); showToast('Оценка удалена', 'info'); }, [showToast]);

  const approveRegistration = useCallback((id: string) => {
    // First find the pending registration
    const reg = pendingRegistrations.find(r => r.id === id);
    if (!reg) return;

    // Update pending status
    setPending(p => p.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));

    // Create real user from approved registration
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: reg.name,
      role: reg.role,
      group: reg.group,
      email: reg.email,
      registeredDate: new Date().toISOString().split('T')[0],
      approved: true,
    };

    // Add to allUsers - this is separate from setPending to avoid nested setState
    setAllUsers(prev => {
      const updated = [...prev, newUser];
      // Immediately persist to localStorage so login works right away
      localStorage.setItem('allUsers', JSON.stringify(updated));
      return updated;
    });

    showToast('Заявка одобрена — пользователь создан', 'success');
  }, [pendingRegistrations, showToast]);
  const rejectRegistration = useCallback((id: string) => { setPending(p => p.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r)); showToast('Заявка отклонена', 'info'); }, [showToast]);
  const addPendingRegistration = useCallback((pr: PendingRegistration) => { setPending(p => [...p, pr]); showToast('Заявка отправлена', 'info'); }, [showToast]);

  return (
    <DataContext.Provider value={{
      allUsers, diary, files, assignedTests: assignedTestsList, testResults: testResultsList, templates,
      notifications, activityLog, telegramSettings, grades, pendingRegistrations, toasts,
      addDiaryEntry, updateDiaryEntry, deleteDiaryEntry,
      addFile, deleteFile, updateFileStatus,
      confirmHours, confirmAllHours, addComment, addRating,
      addTemplate, updateTemplate, deleteTemplate, assignTest, addTestResult,
      addNotification, markNotificationRead, markAllNotificationsRead,
      addActivity, updateTelegramSettings, getUnreadCount,
      addGrade, updateGrade, deleteGrade,
      approveRegistration, rejectRegistration, addPendingRegistration,
      showToast, dismissToast,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
