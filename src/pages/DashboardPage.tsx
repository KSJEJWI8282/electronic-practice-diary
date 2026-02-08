import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { users } from '../data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { CalendarDays, Clock, CheckCircle, FileText, Users, GraduationCap, TrendingUp, Award, BarChart3, AlertCircle, Star, BookOpen } from 'lucide-react';

export function DashboardPage() {
  const { user, theme } = useAuth();
  const { diary, files, testResults, assignedTests, templates, activityLog } = useData();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';

  if (!user) return null;

  if (user.role === 'student') {
    const myEntries = diary.filter(e => e.studentId === user.id);
    const totalHours = myEntries.reduce((s, e) => s + e.hours, 0);
    const confirmedHours = myEntries.filter(e => e.confirmed).reduce((s, e) => s + e.hours, 0);
    const myFiles = files.filter(f => f.studentId === user.id);
    const myResults = testResults.filter(r => r.studentId === user.id);
    const myTests = assignedTests.filter(t => t.assignedTo === user.group);
    const pendingTests = myTests.filter(t => !myResults.find(r => r.testId === t.id));
    const avgScore = myResults.length > 0 ? Math.round(myResults.reduce((s, r) => s + (r.score / r.totalQuestions) * 100, 0) / myResults.length) : 0;

    const weekData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 6 + i);
      const dateStr = d.toISOString().split('T')[0];
      const hrs = myEntries.filter(e => e.date === dateStr).reduce((s, e) => s + e.hours, 0);
      return { day: d.toLocaleDateString('ru-RU', { weekday: 'short' }), hours: hrs };
    });

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className={`rounded-2xl p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg`}>
          <h2 className="text-2xl font-bold mb-1">Добро пожаловать, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-blue-100">Вот сводка вашей практики на сегодня</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Clock className="text-blue-500" size={22} />, bg: 'bg-blue-50 dark:bg-blue-900/30', value: totalHours, label: 'Всего часов' },
            { icon: <CheckCircle className="text-emerald-500" size={22} />, bg: 'bg-emerald-50 dark:bg-emerald-900/30', value: confirmedHours, label: 'Подтверждено' },
            { icon: <FileText className="text-violet-500" size={22} />, bg: 'bg-violet-50 dark:bg-violet-900/30', value: myFiles.length, label: 'Файлов' },
            { icon: <Award className="text-amber-500" size={22} />, bg: 'bg-amber-50 dark:bg-amber-900/30', value: `${avgScore}%`, label: 'Средний балл' },
          ].map((stat, i) => (
            <div key={i} className={`${cardBg} rounded-2xl p-4 shadow-sm border`}>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>{stat.icon}</div>
              <p className={`text-2xl font-bold ${textMain}`}>{stat.value}</p>
              <p className={`text-xs ${textSub}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
            <h3 className={`font-semibold ${textMain} mb-4 flex items-center gap-2`}>
              <BarChart3 size={18} className="text-blue-500" /> Часы за неделю
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f1f5f9'} />
                <XAxis dataKey="day" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={12} />
                <YAxis stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Часы" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
            <h3 className={`font-semibold ${textMain} mb-4 flex items-center gap-2`}>
              <AlertCircle size={18} className="text-amber-500" /> Требуют внимания
            </h3>
            <div className="space-y-3">
              {pendingTests.length > 0 && pendingTests.map(t => (
                <div key={t.id} className={`p-3 rounded-xl ${isDark ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-100'} border`}>
                  <p className={`text-sm font-medium ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>📝 Незавершённый тест</p>
                  <p className={`text-xs ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{t.title} • до {t.deadline}</p>
                </div>
              ))}
              {myEntries.filter(e => !e.confirmed).length > 0 && (
                <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'} border`}>
                  <p className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>⏳ Ожидают подтверждения</p>
                  <p className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{myEntries.filter(e => !e.confirmed).length} записей на проверке</p>
                </div>
              )}
              {pendingTests.length === 0 && myEntries.filter(e => !e.confirmed).length === 0 && (
                <div className={`text-center py-6 ${textSub}`}>
                  <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Всё в порядке! 🎉</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'supervisor') {
    const students = users.filter(u => u.role === 'student');
    const totalEntries = diary.length;
    const unconfirmed = diary.filter(e => !e.confirmed).length;
    const allFiles = files;
    const pendingFiles = allFiles.filter(f => f.status === 'pending').length;

    const studentData = students.map(s => {
      const entries = diary.filter(e => e.studentId === s.id);
      const hours = entries.reduce((sum, e) => sum + e.hours, 0);
      return { name: s.name.split(' ')[0], hours, entries: entries.length };
    });

    const statusData = [
      { name: 'Подтверждено', value: diary.filter(e => e.confirmed).length, color: '#10b981' },
      { name: 'На проверке', value: unconfirmed, color: '#f59e0b' },
    ];

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Панель руководителя 📋</h2>
          <p className="text-emerald-100">Контроль прохождения практики студентами</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Users className="text-blue-500" size={22} />, bg: 'bg-blue-50 dark:bg-blue-900/30', value: students.length, label: 'Студентов' },
            { icon: <CalendarDays className="text-emerald-500" size={22} />, bg: 'bg-emerald-50 dark:bg-emerald-900/30', value: totalEntries, label: 'Записей' },
            { icon: <AlertCircle className="text-amber-500" size={22} />, bg: 'bg-amber-50 dark:bg-amber-900/30', value: unconfirmed, label: 'Не подтв.' },
            { icon: <FileText className="text-violet-500" size={22} />, bg: 'bg-violet-50 dark:bg-violet-900/30', value: pendingFiles, label: 'Файлов на проверку' },
          ].map((stat, i) => (
            <div key={i} className={`${cardBg} rounded-2xl p-4 shadow-sm border`}>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>{stat.icon}</div>
              <p className={`text-2xl font-bold ${textMain}`}>{stat.value}</p>
              <p className={`text-xs ${textSub}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
            <h3 className={`font-semibold ${textMain} mb-4 flex items-center gap-2`}>
              <BarChart3 size={18} className="text-blue-500" /> Часы по студентам
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={studentData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={11} />
                <YAxis stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: 'none', borderRadius: 12 }} />
                <Bar dataKey="hours" fill="#10b981" radius={[6, 6, 0, 0]} name="Часы" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
            <h3 className={`font-semibold ${textMain} mb-4 flex items-center gap-2`}>
              <CheckCircle size={18} className="text-emerald-500" /> Статус записей
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: 'none', borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2">
              {statusData.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className={`text-xs ${textSub}`}>{s.name}: {s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
          <h3 className={`font-semibold ${textMain} mb-4`}>📋 Последние действия</h3>
          <div className="space-y-3">
            {activityLog.slice(0, 5).map(a => (
              <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                  a.type === 'diary' ? 'bg-blue-100 text-blue-600' :
                  a.type === 'file' ? 'bg-violet-100 text-violet-600' :
                  a.type === 'test' ? 'bg-emerald-100 text-emerald-600' :
                  a.type === 'comment' ? 'bg-amber-100 text-amber-600' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {a.type === 'diary' ? '📝' : a.type === 'file' ? '📁' : a.type === 'test' ? '✅' : a.type === 'comment' ? '💬' : '⚙'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${textMain}`}><span className="font-medium">{a.userName}</span> — {a.action}</p>
                  <p className={`text-xs ${textSub}`}>{a.details}</p>
                </div>
                <span className={`text-xs ${textSub} flex-shrink-0`}>
                  {new Date(a.timestamp).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Teacher dashboard
  const totalTemplates = templates.filter(t => t.isTemplate).length;
  const totalAssigned = assignedTests.length;
  const totalResults = testResults.length;
  const avgScore = totalResults > 0 ? Math.round(testResults.reduce((s, r) => s + (r.score / r.totalQuestions) * 100, 0) / totalResults) : 0;

  const topicData = [...new Set(templates.map(t => t.topic))].map(topic => ({
    topic: topic.length > 15 ? topic.slice(0, 15) + '…' : topic,
    count: templates.filter(t => t.topic === topic).length,
  }));

  const scoreHistory = testResults.map(r => ({
    date: r.completedDate,
    score: Math.round((r.score / r.totalQuestions) * 100),
    student: r.studentName.split(' ')[0],
  })).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="rounded-2xl p-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-1">Панель преподавателя 🎓</h2>
        <p className="text-violet-100">Управление тестами и аналитика</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <BookOpen className="text-violet-500" size={22} />, bg: 'bg-violet-50 dark:bg-violet-900/30', value: totalTemplates, label: 'Шаблонов' },
          { icon: <GraduationCap className="text-blue-500" size={22} />, bg: 'bg-blue-50 dark:bg-blue-900/30', value: totalAssigned, label: 'Назначено' },
          { icon: <Star className="text-amber-500" size={22} />, bg: 'bg-amber-50 dark:bg-amber-900/30', value: totalResults, label: 'Результатов' },
          { icon: <TrendingUp className="text-emerald-500" size={22} />, bg: 'bg-emerald-50 dark:bg-emerald-900/30', value: `${avgScore}%`, label: 'Средний балл' },
        ].map((stat, i) => (
          <div key={i} className={`${cardBg} rounded-2xl p-4 shadow-sm border`}>
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>{stat.icon}</div>
            <p className={`text-2xl font-bold ${textMain}`}>{stat.value}</p>
            <p className={`text-xs ${textSub}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
          <h3 className={`font-semibold ${textMain} mb-4`}>📊 Шаблоны по темам</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topicData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f1f5f9'} />
              <XAxis type="number" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={12} />
              <YAxis dataKey="topic" type="category" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={10} width={120} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: 'none', borderRadius: 12 }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} name="Шаблонов" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
          <h3 className={`font-semibold ${textMain} mb-4`}>📈 Динамика оценок</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f1f5f9'} />
              <XAxis dataKey="student" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={11} />
              <YAxis stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: 'none', borderRadius: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }} name="Балл %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
