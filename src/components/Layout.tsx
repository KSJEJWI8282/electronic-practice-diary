import { type ReactNode, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { t, languageNames, languageFlags, type Language } from '../i18n';
import {
  LogOut, Menu, X, Bell, Sun, Moon,
  CalendarDays, FileText, BarChart3, ClipboardList,
  Users, MessageSquare, CheckCircle, GraduationCap,
  LayoutGrid, PlusCircle, ListChecks, Home, Send, FolderOpen, Activity,
  User, Award, Shield, Globe, ChevronDown
} from 'lucide-react';

interface LayoutProps { children: ReactNode; currentPage: string; onNavigate: (page: string) => void; }

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout, theme, toggleTheme, language, setLanguage } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, getUnreadCount, pendingRegistrations } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  if (!user) return null;

  const unreadCount = getUnreadCount(user.id);
  const userNotifications = notifications.filter(n => n.userId === user.id).slice(0, 15);
  const pendingCount = pendingRegistrations.filter(p => p.status === 'pending').length;
  const isDark = theme === 'dark';

  const roleLabels: Record<string, Record<Language, string>> = {
    student: { ru: 'Студент', kz: 'Студент', en: 'Student' },
    supervisor: { ru: 'Руководитель', kz: 'Жетекші', en: 'Supervisor' },
    teacher: { ru: 'Преподаватель', kz: 'Оқытушы', en: 'Teacher' },
  };
  const roleColors: Record<string, string> = { student: 'bg-blue-100 text-blue-700', supervisor: 'bg-emerald-100 text-emerald-700', teacher: 'bg-violet-100 text-violet-700' };
  const roleGradients: Record<string, string> = { student: 'from-blue-500 to-indigo-600', supervisor: 'from-emerald-500 to-teal-600', teacher: 'from-violet-500 to-purple-600' };

  type NavItem = { id: string; label: string; icon: React.ReactNode; badge?: number };

  const navItems: NavItem[] = user.role === 'student'
    ? [
        { id: 'dashboard', label: t('nav.dashboard', language), icon: <Home size={20} /> },
        { id: 'diary', label: t('nav.diary', language), icon: <CalendarDays size={20} /> },
        { id: 'files', label: t('nav.files', language), icon: <FileText size={20} /> },
        { id: 'tests', label: t('nav.tests', language), icon: <ListChecks size={20} /> },
        { id: 'grades', label: t('nav.grades', language), icon: <Award size={20} /> },
        { id: 'results', label: t('nav.results', language), icon: <BarChart3 size={20} /> },
        { id: 'profile', label: t('nav.profile', language), icon: <User size={20} /> },
      ]
    : user.role === 'supervisor'
    ? [
        { id: 'dashboard', label: t('nav.dashboard', language), icon: <Home size={20} /> },
        { id: 'students', label: t('nav.students', language), icon: <Users size={20} /> },
        { id: 'review', label: t('nav.review', language), icon: <ClipboardList size={20} /> },
        { id: 'student-files', label: t('nav.studentFiles', language), icon: <FolderOpen size={20} /> },
        { id: 'confirm', label: t('nav.confirm', language), icon: <CheckCircle size={20} /> },
        { id: 'comments', label: t('nav.comments', language), icon: <MessageSquare size={20} /> },
        { id: 'test-results', label: t('nav.testResults', language), icon: <BarChart3 size={20} /> },
        { id: 'grades', label: t('nav.grades', language), icon: <Award size={20} /> },
        { id: 'approvals', label: t('nav.approvals', language), icon: <Shield size={20} />, badge: pendingCount },
        { id: 'activity', label: t('nav.activity', language), icon: <Activity size={20} /> },
        { id: 'telegram', label: t('nav.telegram', language), icon: <Send size={20} /> },
        { id: 'profile', label: t('nav.profile', language), icon: <User size={20} /> },
      ]
    : [
        { id: 'dashboard', label: t('nav.dashboard', language), icon: <Home size={20} /> },
        { id: 'templates', label: t('nav.templates', language), icon: <LayoutGrid size={20} /> },
        { id: 'create-test', label: t('nav.createTest', language), icon: <PlusCircle size={20} /> },
        { id: 'assign-test', label: t('nav.assignTest', language), icon: <GraduationCap size={20} /> },
        { id: 'statistics', label: t('nav.statistics', language), icon: <BarChart3 size={20} /> },
        { id: 'student-files', label: t('nav.studentFiles', language), icon: <FolderOpen size={20} /> },
        { id: 'grades', label: t('nav.grades', language), icon: <Award size={20} /> },
        { id: 'approvals', label: t('nav.approvals', language), icon: <Shield size={20} />, badge: pendingCount },
        { id: 'telegram', label: t('nav.telegram', language), icon: <Send size={20} /> },
        { id: 'activity', label: t('nav.activity', language), icon: <Activity size={20} /> },
        { id: 'profile', label: t('nav.profile', language), icon: <User size={20} /> },
      ];

  const notifTypeColors: Record<string, string> = {
    info: isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-600',
    success: isDark ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-100 text-emerald-600',
    warning: isDark ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-600',
    error: isDark ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-600',
  };

  const bg = isDark ? 'bg-gray-900' : 'bg-slate-50';
  const sidebarBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200';
  const headerBg = isDark ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-slate-200';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';

  const avatar = user.avatar ? (
    <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
  ) : (
    <span className="text-sm font-bold text-white">{user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
  );

  return (
    <div className={`min-h-screen ${bg} flex`}>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] ${sidebarBg} border-r z-50 transform transition-transform duration-300 ease-out lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-slate-100'} flex items-center gap-3`}>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleGradients[user.role]} flex items-center justify-center shadow-lg animate-pulse-glow relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl" />
            <span className="text-white font-black text-xl italic relative z-10" style={{fontFamily: 'Georgia, "Times New Roman", serif', textShadow: '0 2px 6px rgba(0,0,0,0.3)', transform: 'rotate(-5deg)'}}>S</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className={`font-bold text-sm ${textMain}`}>{t('app.name', language)}</h1>
            <p className={`text-[10px] ${textSub}`}>{t('app.version', language)}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className={`lg:hidden ${textSub}`}><X size={20} /></button>
        </div>

        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${roleGradients[user.role]} flex items-center justify-center shadow-md overflow-hidden`}>
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${textMain}`}>{user.name}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${roleColors[user.role]}`}>
                {roleLabels[user.role][language]}
              </span>
            </div>
          </div>
          {user.group && <p className={`text-xs mt-2 ${textSub}`}>📚 {t('auth.group', language)}: {user.group}</p>}
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === item.id
                  ? isDark ? 'bg-blue-900/40 text-blue-300 shadow-sm' : 'bg-blue-50 text-blue-600 shadow-sm'
                  : isDark ? 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={`p-2 border-t ${isDark ? 'border-gray-700' : 'border-slate-100'} space-y-0.5`}>
          <button onClick={toggleTheme} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isDark ? 'text-gray-400 hover:bg-gray-700/50' : 'text-slate-400 hover:bg-slate-50'}`}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? t('common.lightTheme', language) : t('common.darkTheme', language)}
          </button>
          <button onClick={logout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}`}>
            <LogOut size={20} />
            {t('auth.logout', language)}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className={`${headerBg} backdrop-blur-lg border-b px-4 lg:px-6 py-3 flex items-center gap-3 sticky top-0 z-30`}>
          <button onClick={() => setSidebarOpen(true)} className={`lg:hidden ${textSub}`}><Menu size={24} /></button>
          <h2 className={`text-lg font-semibold ${textMain} flex-1 truncate`}>
            {navItems.find(n => n.id === currentPage)?.label || t('nav.dashboard', language)}
          </h2>

          {/* Language */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm transition ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              <Globe size={16} />
              <span className="hidden sm:inline">{languageFlags[language]}</span>
              <ChevronDown size={12} />
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className={`absolute right-0 top-10 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} border rounded-xl shadow-xl z-50 overflow-hidden min-w-[140px]`}>
                  {(['ru', 'kz', 'en'] as Language[]).map(lang => (
                    <button key={lang} onClick={() => { setLanguage(lang); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition ${language === lang ? (isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600') : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                      {languageFlags[lang]} {languageNames[lang]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button onClick={toggleTheme} className={`p-2 rounded-xl transition ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-400'}`}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Logout button in header */}
          <button onClick={logout} title={t('auth.logout', language)} className={`p-2 rounded-xl transition flex items-center gap-2 ${isDark ? 'hover:bg-red-900/30 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'}`}>
            <LogOut size={18} />
            <span className="hidden sm:inline text-sm font-medium">{t('auth.logout', language)}</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className={`p-2 rounded-xl transition relative ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-100 text-slate-400'}`}>
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-bounce-soft">{unreadCount}</span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className={`absolute right-0 top-12 w-[340px] ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} border rounded-2xl shadow-2xl z-50 overflow-hidden animate-scaleIn`}>
                  <div className={`px-4 py-3 border-b ${isDark ? 'border-gray-700' : 'border-slate-100'} flex items-center justify-between`}>
                    <h3 className={`font-semibold text-sm ${textMain}`}>{t('common.notifications', language)}</h3>
                    {unreadCount > 0 && (
                      <button onClick={() => markAllNotificationsRead(user.id)} className="text-xs text-blue-500 hover:text-blue-600 font-medium">{t('common.readAll', language)}</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {userNotifications.length === 0 ? (
                      <p className={`text-center py-8 text-sm ${textSub}`}>{t('common.noData', language)}</p>
                    ) : userNotifications.map(n => (
                      <button key={n.id} onClick={() => { markNotificationRead(n.id); setNotifOpen(false); }}
                        className={`w-full text-left px-4 py-3 border-b last:border-0 transition ${isDark ? 'border-gray-700' : 'border-slate-50'} ${!n.read ? (isDark ? 'bg-blue-900/10' : 'bg-blue-50/30') : ''} ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${notifTypeColors[n.type]}`}>
                            {n.type === 'info' ? 'ℹ' : n.type === 'success' ? '✓' : n.type === 'warning' ? '!' : '✕'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${textMain} ${!n.read ? 'font-semibold' : ''}`}>{n.title}</p>
                            <p className={`text-xs ${textSub} mt-0.5 line-clamp-2`}>{n.message}</p>
                            <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-slate-300'}`}>
                              {new Date(n.createdAt).toLocaleDateString('ru-RU')}
                            </p>
                          </div>
                          {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>

        <footer className={`px-6 py-3 text-center text-xs ${textSub} border-t ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
          {t('app.copyright', language)}
        </footer>
      </div>
    </div>
  );
}
