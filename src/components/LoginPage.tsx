import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { BookOpen, GraduationCap, Users, ClipboardCheck, Eye, EyeOff, Shield, Zap, BarChart3, UserPlus, ArrowLeft } from 'lucide-react';
import { t, languageFlags, type Language } from '../i18n';
import type { Role } from '../types';

export function LoginPage() {
  const { login, loginAs, language, setLanguage } = useAuth();
  const { addPendingRegistration, addNotification, pendingRegistrations, allUsers } = useData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'quick' | 'form' | 'register'>('quick');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // Registration form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>('student');
  const [regGroup, setRegGroup] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (!login(email, password)) {
        setError(language === 'ru' ? 'Пользователь не найден или не одобрен' : language === 'kz' ? 'Пайдаланушы табылмады' : 'User not found or not approved');
      }
      setLoading(false);
    }, 500);
  };

  const quickLogin = (role: Role) => {
    setLoading(true);
    setTimeout(() => { loginAs(role); setLoading(false); }, 300);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;

    // Check duplicate email across all users and pending registrations
    const emailExistsInUsers = allUsers.some(u => u.email === regEmail);
    const pendingExists = pendingRegistrations.some(p => p.email === regEmail && p.status !== 'rejected');
    if (emailExistsInUsers || pendingExists) {
      setError(language === 'ru' ? 'Этот email уже зарегистрирован' : language === 'kz' ? 'Бұл email тіркелген' : 'This email is already registered');
      return;
    }

    addPendingRegistration({
      id: `pr${Date.now()}`, name: regName, email: regEmail, password: regPassword, role: regRole,
      group: regRole === 'student' ? regGroup : undefined, requestDate: new Date().toISOString().split('T')[0], status: 'pending',
    });
    // Notify approver: students -> teacher, teachers -> supervisor
    const approverId = regRole === 'student' ? '5' : '4';
    addNotification({ id: `n${Date.now()}`, userId: approverId, title: 'Заявка на регистрацию', message: `${regName} (${regRole === 'student' ? 'студент' : 'преподаватель'}) запросил доступ`, type: 'warning', read: false, createdAt: new Date().toISOString() });
    setRegSuccess(true);
  };

  const roles = [
    { role: 'student' as Role, label: t('role.student', language), desc: 'Иванов Алексей Петрович', icon: <GraduationCap size={28} />, color: 'from-blue-500 to-indigo-600', hover: 'hover:border-blue-300' },
    { role: 'supervisor' as Role, label: t('role.supervisor', language), desc: 'Козлова Анна Владимировна', icon: <ClipboardCheck size={28} />, color: 'from-emerald-500 to-teal-600', hover: 'hover:border-emerald-300' },
    { role: 'teacher' as Role, label: t('role.teacher', language), desc: 'Морозов Игорь Николаевич', icon: <Users size={28} />, color: 'from-violet-500 to-purple-600', hover: 'hover:border-violet-300' },
  ];

  const features = [
    { icon: <BookOpen size={20} />, text: language === 'ru' ? 'Электронный дневник' : language === 'kz' ? 'Электрондық күнделік' : 'Digital Diary' },
    { icon: <Shield size={20} />, text: language === 'ru' ? 'Контроль доступа' : language === 'kz' ? 'Қол жетімділікті бақылау' : 'Access Control' },
    { icon: <Zap size={20} />, text: language === 'ru' ? 'Шаблоны тестов' : language === 'kz' ? 'Тест үлгілері' : 'Test Templates' },
    { icon: <BarChart3 size={20} />, text: language === 'ru' ? 'Аналитика' : language === 'kz' ? 'Аналитика' : 'Analytics' },
  ];

  const bgItems = [
    // Books
    { icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <rect x="8" y="10" width="48" height="44" rx="3" fill="currentColor" opacity="0.15"/>
        <rect x="12" y="6" width="40" height="44" rx="3" fill="currentColor" opacity="0.2"/>
        <rect x="16" y="2" width="36" height="44" rx="3" fill="currentColor" opacity="0.25"/>
        <line x1="20" y1="14" x2="48" y2="14" stroke="currentColor" opacity="0.3" strokeWidth="2"/>
        <line x1="20" y1="22" x2="44" y2="22" stroke="currentColor" opacity="0.2" strokeWidth="2"/>
        <line x1="20" y1="30" x2="40" y2="30" stroke="currentColor" opacity="0.15" strokeWidth="2"/>
      </svg>
    ), style: { top: '5%', left: '3%', width: 80, height: 80, transform: 'rotate(-15deg)' }, delay: 0 },
    { icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <rect x="10" y="8" width="44" height="48" rx="4" fill="currentColor" opacity="0.12"/>
        <rect x="14" y="4" width="36" height="48" rx="4" fill="currentColor" opacity="0.18"/>
        <path d="M14 4h18v48H14z" fill="currentColor" opacity="0.08"/>
        <circle cx="32" cy="28" r="8" fill="currentColor" opacity="0.15"/>
      </svg>
    ), style: { bottom: '8%', right: '5%', width: 70, height: 70, transform: 'rotate(10deg)' }, delay: 2 },

    // Pencils
    { icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <rect x="28" y="2" width="8" height="48" rx="2" fill="currentColor" opacity="0.2" transform="rotate(30 32 32)"/>
        <polygon points="28,50 36,50 32,60" fill="currentColor" opacity="0.25" transform="rotate(30 32 32)"/>
        <rect x="28" y="2" width="8" height="8" fill="currentColor" opacity="0.1" transform="rotate(30 32 32)"/>
      </svg>
    ), style: { top: '15%', right: '8%', width: 60, height: 60, transform: 'rotate(-25deg)' }, delay: 0.5 },
    { icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <rect x="28" y="4" width="8" height="44" rx="2" fill="currentColor" opacity="0.18"/>
        <polygon points="28,48 36,48 32,58" fill="currentColor" opacity="0.22"/>
        <rect x="28" y="4" width="8" height="6" rx="1" fill="currentColor" opacity="0.12"/>
        <rect x="27" y="38" width="10" height="4" fill="currentColor" opacity="0.1"/>
      </svg>
    ), style: { bottom: '20%', left: '6%', width: 50, height: 50, transform: 'rotate(45deg)' }, delay: 3 },

    // Pen
    { icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path d="M32 4L38 10L14 54L8 58L12 52L32 4Z" fill="currentColor" opacity="0.2"/>
        <path d="M32 4L38 10L36 14L30 8L32 4Z" fill="currentColor" opacity="0.15"/>
        <path d="M8 58L14 54L12 56L8 58Z" fill="currentColor" opacity="0.25"/>
      </svg>
    ), style: { top: '40%', left: '2%', width: 55, height: 55, transform: 'rotate(20deg)' }, delay: 1 },
    { icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <path d="M16 8L56 48L52 52L12 12L16 8Z" fill="currentColor" opacity="0.15"/>
        <path d="M56 48L52 52L54 56L58 50L56 48Z" fill="currentColor" opacity="0.2"/>
        <circle cx="14" cy="10" r="3" fill="currentColor" opacity="0.12"/>
      </svg>
    ), style: { top: '60%', right: '4%', width: 65, height: 65, transform: 'rotate(-10deg)' }, delay: 1.5 },

    // Ruler
    { icon: (
      <svg viewBox="0 0 80 24" fill="none" className="w-full h-full">
        <rect x="0" y="0" width="80" height="24" rx="3" fill="currentColor" opacity="0.15"/>
        {[8,16,24,32,40,48,56,64,72].map((x,i) => (
          <line key={i} x1={x} y1="0" x2={x} y2={i%2===0?"12":"8"} stroke="currentColor" opacity="0.2" strokeWidth="1.5"/>
        ))}
      </svg>
    ), style: { bottom: '35%', right: '10%', width: 100, height: 30, transform: 'rotate(-20deg)' }, delay: 2.5 },

    // Graduation cap
    { icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <polygon points="32,8 4,24 32,40 60,24" fill="currentColor" opacity="0.15"/>
        <polygon points="32,40 60,24 60,36 32,52 4,36 4,24" fill="currentColor" opacity="0.1"/>
        <line x1="52" y1="28" x2="52" y2="48" stroke="currentColor" opacity="0.2" strokeWidth="2"/>
        <circle cx="52" cy="50" r="3" fill="currentColor" opacity="0.15"/>
      </svg>
    ), style: { top: '8%', left: '40%', width: 70, height: 70, transform: 'rotate(5deg)' }, delay: 0.8 },

    // Notebook / clipboard
    { icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <rect x="12" y="8" width="40" height="50" rx="4" fill="currentColor" opacity="0.15"/>
        <rect x="22" y="4" width="20" height="8" rx="4" fill="currentColor" opacity="0.2"/>
        <line x1="20" y1="24" x2="44" y2="24" stroke="currentColor" opacity="0.15" strokeWidth="2"/>
        <line x1="20" y1="32" x2="44" y2="32" stroke="currentColor" opacity="0.12" strokeWidth="2"/>
        <line x1="20" y1="40" x2="36" y2="40" stroke="currentColor" opacity="0.1" strokeWidth="2"/>
      </svg>
    ), style: { bottom: '5%', left: '35%', width: 55, height: 55, transform: 'rotate(8deg)' }, delay: 1.8 },

    // Calculator
    { icon: (
      <svg viewBox="0 0 48 64" fill="none" className="w-full h-full">
        <rect x="4" y="2" width="40" height="60" rx="4" fill="currentColor" opacity="0.15"/>
        <rect x="8" y="6" width="32" height="14" rx="2" fill="currentColor" opacity="0.1"/>
        {[0,1,2].map(row => [0,1,2].map(col => (
          <rect key={`${row}-${col}`} x={10+col*11} y={24+row*12} width="8" height="8" rx="1.5" fill="currentColor" opacity="0.12"/>
        )))}
      </svg>
    ), style: { top: '70%', left: '15%', width: 48, height: 64, transform: 'rotate(-12deg)' }, delay: 3.5 },

    // Globe / world
    { icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" opacity="0.15" strokeWidth="2"/>
        <ellipse cx="32" cy="32" rx="12" ry="26" fill="none" stroke="currentColor" opacity="0.12" strokeWidth="1.5"/>
        <line x1="6" y1="32" x2="58" y2="32" stroke="currentColor" opacity="0.1" strokeWidth="1.5"/>
        <line x1="32" y1="6" x2="32" y2="58" stroke="currentColor" opacity="0.1" strokeWidth="1.5"/>
        <ellipse cx="32" cy="20" rx="22" ry="4" fill="none" stroke="currentColor" opacity="0.08" strokeWidth="1"/>
        <ellipse cx="32" cy="44" rx="22" ry="4" fill="none" stroke="currentColor" opacity="0.08" strokeWidth="1"/>
      </svg>
    ), style: { top: '25%', right: '15%', width: 60, height: 60, transform: 'rotate(10deg)' }, delay: 4 },

    // Light bulb (idea)
    { icon: (
      <svg viewBox="0 0 48 64" fill="none" className="w-full h-full">
        <path d="M24 4C14 4 6 12 6 22C6 30 12 34 14 40H34C36 34 42 30 42 22C42 12 34 4 24 4Z" fill="currentColor" opacity="0.12"/>
        <rect x="16" y="42" width="16" height="4" rx="2" fill="currentColor" opacity="0.15"/>
        <rect x="18" y="48" width="12" height="4" rx="2" fill="currentColor" opacity="0.15"/>
        <rect x="20" y="54" width="8" height="4" rx="2" fill="currentColor" opacity="0.15"/>
        <line x1="24" y1="14" x2="24" y2="28" stroke="currentColor" opacity="0.15" strokeWidth="2"/>
        <line x1="18" y1="22" x2="30" y2="22" stroke="currentColor" opacity="0.15" strokeWidth="2"/>
      </svg>
    ), style: { bottom: '45%', left: '25%', width: 44, height: 58, transform: 'rotate(-8deg)' }, delay: 2.2 },

    // Atom / science
    { icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
        <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="currentColor" opacity="0.12" strokeWidth="1.5" transform="rotate(0 32 32)"/>
        <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="currentColor" opacity="0.12" strokeWidth="1.5" transform="rotate(60 32 32)"/>
        <ellipse cx="32" cy="32" rx="28" ry="10" fill="none" stroke="currentColor" opacity="0.12" strokeWidth="1.5" transform="rotate(120 32 32)"/>
        <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.2"/>
      </svg>
    ), style: { top: '50%', right: '20%', width: 70, height: 70, transform: 'rotate(15deg)' }, delay: 1.2 },

    // Wi-Fi / connectivity
    { icon: (
      <svg viewBox="0 0 64 48" fill="none" className="w-full h-full">
        <path d="M32 44a4 4 0 100-8 4 4 0 000 8z" fill="currentColor" opacity="0.2"/>
        <path d="M20 32c6.6-6.6 17.4-6.6 24 0" stroke="currentColor" opacity="0.15" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M12 24c11-11 29-11 40 0" stroke="currentColor" opacity="0.12" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M4 16c15.5-15.5 40.5-15.5 56 0" stroke="currentColor" opacity="0.09" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    ), style: { top: '3%', right: '30%', width: 55, height: 42, transform: 'rotate(0deg)' }, delay: 3.2 },

    // Code brackets < / >
    { icon: (
      <svg viewBox="0 0 80 48" fill="none" className="w-full h-full">
        <path d="M24 8L8 24L24 40" stroke="currentColor" opacity="0.18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M56 8L72 24L56 40" stroke="currentColor" opacity="0.18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <line x1="46" y1="4" x2="34" y2="44" stroke="currentColor" opacity="0.15" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ), style: { bottom: '15%', right: '25%', width: 70, height: 42, transform: 'rotate(5deg)' }, delay: 0.3 },

    // Monitor / screen
    { icon: (
      <svg viewBox="0 0 64 56" fill="none" className="w-full h-full">
        <rect x="4" y="2" width="56" height="38" rx="4" fill="currentColor" opacity="0.12"/>
        <rect x="8" y="6" width="48" height="30" rx="2" fill="currentColor" opacity="0.08"/>
        <rect x="24" y="42" width="16" height="4" fill="currentColor" opacity="0.15"/>
        <rect x="18" y="48" width="28" height="4" rx="2" fill="currentColor" opacity="0.12"/>
      </svg>
    ), style: { top: '80%', left: '45%', width: 60, height: 52, transform: 'rotate(-5deg)' }, delay: 4.2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Educational background items */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bgItems.map((item, i) => (
          <div
            key={i}
            className="absolute text-blue-300/40 animate-float-slow"
            style={{
              ...item.style,
              animationDelay: `${item.delay}s`,
              animationDuration: `${8 + (i % 5) * 2}s`,
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-20 flex gap-1">
        {(['ru', 'kz', 'en'] as Language[]).map(lang => (
          <button key={lang} onClick={() => setLanguage(lang)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${language === lang ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/10'}`}>
            {languageFlags[lang]}
          </button>
        ))}
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Left branding */}
        <div className="flex-1 flex flex-col justify-center text-white lg:pr-8 animate-fadeInLeft">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse-glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent rounded-2xl" />
              <span className="text-white font-black text-3xl italic relative z-10" style={{fontFamily: 'Georgia, "Times New Roman", serif', textShadow: '0 2px 8px rgba(0,0,0,0.3)', transform: 'rotate(-5deg) translateY(-1px)'}}>S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('app.name', language)}</h1>
              <p className="text-blue-200 text-sm">{t('app.subtitle', language)}</p>
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            {language === 'ru' ? 'Автоматизация учёта' : language === 'kz' ? 'Есепті автоматтандыру' : 'Automating'}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-violet-300">
              {language === 'ru' ? ' прохождения практики' : language === 'kz' ? ' практиканы' : ' practice tracking'}
            </span>
          </h2>
          <p className="text-blue-200/80 mb-8 text-lg leading-relaxed hidden sm:block">
            {language === 'ru' ? 'Современная система для ведения дневника практики, контроля часов, прохождения тестов и формирования отчётов.' :
             language === 'kz' ? 'Практика күнделігін жүргізу, сағаттарды бақылау, тесттерден өту және есептер құру үшін заманауи жүйе.' :
             'Modern system for maintaining practice diary, monitoring hours, taking tests and generating reports.'}
          </p>
          <div className="grid grid-cols-2 gap-3 hidden sm:grid">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 glass rounded-xl px-4 py-3 animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-blue-300">{f.icon}</div>
                <span className="text-sm text-blue-100">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Login card */}
        <div className="w-full lg:w-[440px] animate-fadeInRight">
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
            <div className="flex border-b border-slate-100">
              {[
                { m: 'quick' as const, icon: '⚡', label: t('auth.quickLogin', language) },
                { m: 'form' as const, icon: '📧', label: t('auth.byEmail', language) },
                { m: 'register' as const, icon: '📝', label: t('auth.register', language) },
              ].map(tab => (
                <button key={tab.m} onClick={() => { setMode(tab.m); setError(''); setRegSuccess(false); }}
                  className={`flex-1 py-3.5 text-xs font-semibold transition ${mode === tab.m ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {mode === 'quick' && (
                <div className="space-y-3 stagger-children">
                  <p className="text-sm text-slate-500 mb-4">{language === 'ru' ? 'Выберите роль для демонстрации:' : language === 'kz' ? 'Демонстрация үшін рөлді таңдаңыз:' : 'Select a role to demo:'}</p>
                  {roles.map(r => (
                    <button key={r.role} onClick={() => quickLogin(r.role)} disabled={loading}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 ${r.hover} hover:bg-slate-50/50 transition-all group disabled:opacity-50 animate-fadeIn`}>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>{r.icon}</div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-slate-700">{r.label}</div>
                        <div className="text-sm text-slate-400">{r.desc}</div>
                      </div>
                      <div className="text-slate-300 group-hover:text-slate-500 transition group-hover:translate-x-1">→</div>
                    </button>
                  ))}
                </div>
              )}

              {mode === 'form' && (
                <form onSubmit={handleLogin} className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">{t('auth.email', language)}</label>
                    <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="example@college.ru"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">{t('auth.password', language)}</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="••••••••"
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition text-slate-700" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  {error && <div className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">⚠ {error}</div>}
                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-200 transition active:scale-[0.98] disabled:opacity-50">
                    {loading ? `⏳ ${t('auth.loginLoading', language)}` : t('auth.login', language)}
                  </button>
                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-400 space-y-1">
                    <p className="font-medium text-slate-500">Доступные аккаунты:</p>
                    <p>👨‍🎓 ivanov@college.ru</p>
                    <p>👩‍🏫 kozlova@college.ru</p>
                    <p>👨‍🏫 morozov@college.ru</p>
                  </div>
                </form>
              )}

              {mode === 'register' && !regSuccess && (
                <form onSubmit={handleRegister} className="space-y-4 animate-fadeIn">
                  <p className="text-sm text-slate-500">
                    {language === 'ru' ? 'Регистрация требует одобрения. Студентов одобряет преподаватель, преподавателей — руководитель практики.' :
                     language === 'kz' ? 'Тіркелу мақұлдауды қажет етеді.' : 'Registration requires approval.'}
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">{t('auth.fullName', language)}</label>
                    <input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Фамилия Имя Отчество" required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Gmail</label>
                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="your@gmail.com" required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">{t('auth.password', language)}</label>
                    <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="••••••••" required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition text-slate-700" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">{t('auth.selectRole', language)}</label>
                    <select value={regRole} onChange={e => setRegRole(e.target.value as Role)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-slate-700">
                      <option value="student">{t('role.student', language)}</option>
                      <option value="teacher">{t('role.teacher', language)}</option>
                    </select>
                  </div>
                  {regRole === 'student' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">{t('auth.group', language)}</label>
                      <select value={regGroup} onChange={e => setRegGroup(e.target.value)} required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none transition text-slate-700 bg-white">
                        <option value="">{language === 'ru' ? '— Выберите группу —' : language === 'kz' ? '— Топты таңдаңыз —' : '— Select group —'}</option>
                        <option value="ИС-922">ИС-922</option>
                        <option value="ИС-923">ИС-923</option>
                        <option value="ИС-924">ИС-924</option>
                      </select>
                    </div>
                  )}
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition active:scale-[0.98]">
                    <UserPlus size={18} className="inline mr-2" /> {t('auth.register', language)}
                  </button>
                </form>
              )}

              {mode === 'register' && regSuccess && (
                <div className="text-center py-8 animate-scaleIn">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Shield size={36} className="text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">Заявка отправлена!</h3>
                  <p className="text-sm text-slate-500 mb-4">{t('auth.registerPending', language)}</p>
                  <button onClick={() => { setMode('form'); setRegSuccess(false); }} className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1 mx-auto">
                    <ArrowLeft size={14} /> {t('auth.login', language)}
                  </button>
                </div>
              )}
            </div>

            <div className="px-6 pb-5 text-center">
              <p className="text-xs text-slate-300">{t('app.copyright', language)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
