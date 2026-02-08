import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { LoginPage } from './components/LoginPage';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { DiaryPage } from './pages/student/DiaryPage';
import { FilesPage } from './pages/student/FilesPage';
import { TestsPage } from './pages/student/TestsPage';
import { ResultsPage } from './pages/student/ResultsPage';
import { GradesPage } from './pages/shared/GradesPage';
import { ProfilePage } from './pages/ProfilePage';
import { ActivityPage } from './pages/shared/ActivityPage';
import { TelegramPage } from './pages/shared/TelegramPage';
import { StudentFilesPage } from './pages/shared/StudentFilesPage';
import { ApprovalsPage } from './pages/shared/ApprovalsPage';
import {
  StudentsPage, ReviewPage, CommentsPage, ConfirmPage, SupervisorTestResultsPage,
} from './pages/supervisor/SupervisorPages';
import {
  TemplatesPage, CreateTestPage, AssignTestPage, StatisticsPage,
} from './pages/teacher/TeacherPages';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

function ToastContainer() {
  const { toasts, dismissToast } = useData();
  const icons = { info: <Info size={16} />, success: <CheckCircle size={16} />, warning: <AlertTriangle size={16} />, error: <AlertCircle size={16} /> };
  const colors = { info: 'bg-blue-600', success: 'bg-emerald-600', warning: 'bg-amber-600', error: 'bg-red-600' };
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`animate-toast-in flex items-center gap-3 px-4 py-3 rounded-2xl text-white shadow-2xl ${colors[t.type]} min-w-[280px]`}>
          {icons[t.type]}
          <span className="text-sm font-medium flex-1">{t.message}</span>
          <button onClick={() => dismissToast(t.id)} className="text-white/70 hover:text-white"><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [page, setPage] = useState('');

  if (!user) return <LoginPage />;

  const currentPage = page || (
    user.role === 'student' ? 'dashboard' :
    user.role === 'supervisor' ? 'dashboard' : 'dashboard'
  );

  const renderPage = () => {
    if (currentPage === 'dashboard') return <DashboardPage />;
    if (currentPage === 'profile') return <ProfilePage />;
    if (currentPage === 'activity') return <ActivityPage />;
    if (currentPage === 'telegram') return <TelegramPage />;
    if (currentPage === 'student-files') return <StudentFilesPage />;
    if (currentPage === 'grades') return <GradesPage />;
    if (currentPage === 'approvals') return <ApprovalsPage />;

    if (user.role === 'student') {
      switch (currentPage) {
        case 'diary': return <DiaryPage />;
        case 'files': return <FilesPage />;
        case 'tests': return <TestsPage />;
        case 'results': return <ResultsPage />;
        default: return <DashboardPage />;
      }
    }
    if (user.role === 'supervisor') {
      switch (currentPage) {
        case 'students': return <StudentsPage />;
        case 'review': return <ReviewPage />;
        case 'comments': return <CommentsPage />;
        case 'confirm': return <ConfirmPage />;
        case 'test-results': return <SupervisorTestResultsPage />;
        default: return <DashboardPage />;
      }
    }
    if (user.role === 'teacher') {
      switch (currentPage) {
        case 'templates': return <TemplatesPage />;
        case 'create-test': return <CreateTestPage />;
        case 'assign-test': return <AssignTestPage />;
        case 'statistics': return <StatisticsPage />;
        default: return <DashboardPage />;
      }
    }
    return null;
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setPage}>
      <div className="animate-fadeIn">{renderPage()}</div>
      <ToastContainer />
    </Layout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
