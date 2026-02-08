import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { practices } from '../../data';
import { Users, CheckCircle, MessageSquare, Clock, AlertCircle, Send, ChevronDown, Trophy, Eye, Star, CheckSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function StudentsPage() {
  const { theme } = useAuth();
  const { diary, testResults, files, allUsers } = useData();
  const students = allUsers.filter((u: any) => u.role === 'student');
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';
  const [search, setSearch] = useState('');

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || (s.group || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className={`${cardBg} rounded-2xl p-4 shadow-sm border`}>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск студента..."
          className={`w-full px-4 py-2.5 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'} focus:border-blue-400 outline-none`} />
      </div>

      {filtered.map(s => {
        const entries = diary.filter(e => e.studentId === s.id);
        const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);
        const confirmedHours = entries.filter(e => e.confirmed).reduce((sum, e) => sum + e.hours, 0);
        const results = testResults.filter(r => r.studentId === s.id);
        const avgScore = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / results.length) : 0;
        const fileCount = files.filter(f => f.studentId === s.id).length;
        const practice = practices.find(p => p.group === s.group);

        return (
          <div key={s.id} className={`${cardBg} rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${textMain}`}>{s.name}</p>
                <p className={`text-sm ${textSub}`}>📚 {s.group} • {practice?.title || '—'}</p>
                {s.telegramId && <p className={`text-xs ${textSub}`}>📱 {s.telegramId}</p>}
              </div>
              <div className="hidden sm:flex items-center gap-6">
                <div className="text-center">
                  <p className={`text-lg font-bold ${textMain}`}>{totalHours}</p>
                  <p className={`text-xs ${textSub}`}>Часов</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-500">{confirmedHours}</p>
                  <p className={`text-xs ${textSub}`}>Подтв.</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-500">{entries.length}</p>
                  <p className={`text-xs ${textSub}`}>Записей</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-violet-500">{fileCount}</p>
                  <p className={`text-xs ${textSub}`}>Файлов</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${avgScore >= 70 ? 'text-emerald-500' : avgScore > 0 ? 'text-amber-500' : textSub}`}>{avgScore > 0 ? `${avgScore}%` : '—'}</p>
                  <p className={`text-xs ${textSub}`}>Тесты</p>
                </div>
              </div>
            </div>
            {/* Progress */}
            <div className="mt-3">
              <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                <div className="h-full bg-gradient-to-r from-blue-400 to-emerald-500 rounded-full transition-all" style={{ width: `${Math.min(100, (totalHours / 80) * 100)}%` }} />
              </div>
              <p className={`text-xs ${textSub} mt-1`}>Прогресс: {Math.min(100, Math.round((totalHours / 80) * 100))}%</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ReviewPage() {
  const { theme } = useAuth();
  const { diary, addRating, allUsers } = useData();
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const students = allUsers.filter((u: any) => u.role === 'student');
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';

  const entries = selectedStudent === 'all' ? diary : diary.filter(e => e.studentId === selectedStudent);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className={`${cardBg} rounded-2xl p-4 shadow-sm border`}>
        <div className="relative">
          <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
            className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'} focus:border-blue-400 outline-none`}>
            <option value="all">Все студенты</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.group})</option>)}
          </select>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 ${textSub} pointer-events-none`} size={18} />
        </div>
      </div>

      <div className="space-y-3">
        {entries.sort((a, b) => b.date.localeCompare(a.date)).map(entry => {
          const student = allUsers.find((u: any) => u.id === entry.studentId);
          return (
            <div key={entry.id} className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className={`font-semibold ${textMain}`}>{student?.name}</p>
                  <div className={`flex items-center gap-3 text-xs ${textSub} mt-1`}>
                    <span>📅 {new Date(entry.date).toLocaleDateString('ru-RU')}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{entry.hours} ч.</span>
                    <span>📚 {student?.group}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Rating */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => addRating(entry.id, star)}
                        className={`transition ${(entry.rating || 0) >= star ? 'text-amber-400' : isDark ? 'text-gray-600' : 'text-slate-200'} hover:text-amber-400`}>
                        <Star size={16} fill={(entry.rating || 0) >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${entry.confirmed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                    {entry.confirmed ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {entry.confirmed ? 'Подтв.' : 'Проверка'}
                  </span>
                </div>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{entry.description}</p>
              {entry.comment && (
                <div className={`mt-3 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-xl p-3 flex items-start gap-2`}>
                  <MessageSquare size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>{entry.comment}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CommentsPage() {
  const { theme } = useAuth();
  const { diary, addComment, addNotification, addActivity, allUsers } = useData();
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';

  const handleSend = (entryId: string, studentId: string) => {
    const text = commentText[entryId];
    if (!text?.trim()) return;
    addComment(entryId, text);
    addNotification({ id: `n${Date.now()}`, userId: studentId, title: 'Новый комментарий', message: `Руководитель оставил комментарий к записи`, type: 'info', read: false, createdAt: new Date().toISOString() });
    addActivity({ id: `a${Date.now()}`, userId: '4', userName: 'Козлова А.В.', action: 'Оставила комментарий', details: text.slice(0, 50), timestamp: new Date().toISOString(), type: 'comment' });
    setCommentText(prev => ({ ...prev, [entryId]: '' }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {diary.sort((a, b) => b.date.localeCompare(a.date)).map(entry => {
        const student = allUsers.find((u: any) => u.id === entry.studentId);
        return (
          <div key={entry.id} className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className={`font-medium ${textMain} text-sm`}>{student?.name}</p>
                <p className={`text-xs ${textSub}`}>{new Date(entry.date).toLocaleDateString('ru-RU')} • {entry.hours} ч. • {student?.group}</p>
              </div>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'} mb-3`}>{entry.description}</p>
            {entry.comment && (
              <div className={`${isDark ? 'bg-emerald-900/20' : 'bg-emerald-50'} rounded-xl p-3 mb-3`}>
                <p className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>💬 {entry.comment}</p>
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={commentText[entry.id] || ''} onChange={e => setCommentText(prev => ({ ...prev, [entry.id]: e.target.value }))}
                placeholder="Написать комментарий..." onKeyDown={e => e.key === 'Enter' && handleSend(entry.id, entry.studentId)}
                className={`flex-1 px-3 py-2 rounded-xl border text-sm ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-slate-200 text-slate-700'} focus:border-blue-400 outline-none`} />
              <button onClick={() => handleSend(entry.id, entry.studentId)} className="px-3 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition">
                <Send size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ConfirmPage() {
  const { theme } = useAuth();
  const { diary, confirmHours, confirmAllHours, addNotification, addActivity, allUsers } = useData();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const unconfirmed = diary.filter(e => !e.confirmed);

  const handleConfirm = (entryId: string) => {
    const entry = diary.find(e => e.id === entryId);
    confirmHours(entryId);
    if (entry) {
      addNotification({ id: `n${Date.now()}`, userId: entry.studentId, title: 'Часы подтверждены', message: `Руководитель подтвердил ${entry.hours} часов за ${entry.date}`, type: 'success', read: false, createdAt: new Date().toISOString() });
      addActivity({ id: `a${Date.now()}`, userId: '4', userName: 'Козлова А.В.', action: 'Подтвердила часы', details: `${allUsers.find((u: any) => u.id === entry.studentId)?.name?.split(' ')[0]}, ${entry.date} — ${entry.hours}ч`, timestamp: new Date().toISOString(), type: 'diary' });
    }
  };

  const handleBulkConfirm = () => {
    confirmAllHours(Array.from(selected));
    selected.forEach(id => {
      const entry = diary.find(e => e.id === id);
      if (entry) {
        addNotification({ id: `n${Date.now()}${id}`, userId: entry.studentId, title: 'Часы подтверждены', message: `Руководитель подтвердил ${entry.hours} часов за ${entry.date}`, type: 'success', read: false, createdAt: new Date().toISOString() });
      }
    });
    setSelected(new Set());
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === unconfirmed.length) setSelected(new Set());
    else setSelected(new Set(unconfirmed.map(e => e.id)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-amber-900/30' : 'bg-amber-50'} flex items-center justify-center`}>
              <AlertCircle className="text-amber-500" size={20} />
            </div>
            <div><p className={`text-2xl font-bold ${textMain}`}>{unconfirmed.length}</p><p className={`text-xs ${textSub}`}>Ожидают</p></div>
          </div>
        </div>
        <div className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-emerald-900/30' : 'bg-emerald-50'} flex items-center justify-center`}>
              <CheckCircle className="text-emerald-500" size={20} />
            </div>
            <div><p className={`text-2xl font-bold ${textMain}`}>{diary.filter(e => e.confirmed).length}</p><p className={`text-xs ${textSub}`}>Подтверждено</p></div>
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {unconfirmed.length > 0 && (
        <div className={`${cardBg} rounded-2xl p-4 shadow-sm border flex items-center gap-3`}>
          <button onClick={selectAll} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {selected.size === unconfirmed.length ? 'Снять всё' : 'Выбрать все'}
          </button>
          {selected.size > 0 && (
            <button onClick={handleBulkConfirm} className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition flex items-center gap-1">
              <CheckSquare size={14} /> Подтвердить выбранные ({selected.size})
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {unconfirmed.map(entry => {
          const student = allUsers.find((u: any) => u.id === entry.studentId);
          return (
            <div key={entry.id} className={`${cardBg} rounded-2xl p-5 shadow-sm border flex items-center gap-4`}>
              <input type="checkbox" checked={selected.has(entry.id)} onChange={() => toggleSelect(entry.id)} className="w-4 h-4 accent-blue-500 rounded" />
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${textMain}`}>{student?.name} <span className={`text-xs ${textSub}`}>({student?.group})</span></p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-500'} mt-1 line-clamp-2`}>{entry.description}</p>
                <div className={`flex items-center gap-3 text-xs ${textSub} mt-2`}>
                  <span>📅 {new Date(entry.date).toLocaleDateString('ru-RU')}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{entry.hours} ч.</span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleConfirm(entry.id)} className="px-3 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition text-sm font-medium flex items-center gap-1">
                  <CheckCircle size={14} /> Подтвердить
                </button>
              </div>
            </div>
          );
        })}
        {unconfirmed.length === 0 && (
          <div className={`text-center py-8 ${textSub}`}>
            <CheckCircle size={40} className="mx-auto mb-2 opacity-30" />
            <p>Все часы подтверждены! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SupervisorTestResultsPage() {
  const { theme } = useAuth();
  const { testResults, assignedTests } = useData();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';

  const avgScore = testResults.length > 0 ? Math.round(testResults.reduce((s, r) => s + (r.score / r.totalQuestions) * 100, 0) / testResults.length) : 0;

  const chartData = testResults.map(r => ({
    name: r.studentName.split(' ')[0],
    score: Math.round((r.score / r.totalQuestions) * 100),
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
          <Eye className="text-violet-500 mb-3" size={22} />
          <p className={`text-2xl font-bold ${textMain}`}>{assignedTests.length}</p>
          <p className={`text-sm ${textSub}`}>Тестов</p>
        </div>
        <div className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
          <Users className="text-blue-500 mb-3" size={22} />
          <p className={`text-2xl font-bold ${textMain}`}>{testResults.length}</p>
          <p className={`text-sm ${textSub}`}>Результатов</p>
        </div>
        <div className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
          <Trophy className="text-emerald-500 mb-3" size={22} />
          <p className={`text-2xl font-bold ${textMain}`}>{avgScore}%</p>
          <p className={`text-sm ${textSub}`}>Средний балл</p>
        </div>
      </div>

      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`font-semibold ${textMain} mb-4`}>📊 Результаты</h3>
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#f1f5f9'} />
              <XAxis dataKey="name" stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={11} />
              <YAxis stroke={isDark ? '#9ca3af' : '#94a3b8'} fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff', border: 'none', borderRadius: 12 }} />
              <Bar dataKey="score" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Балл %" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`font-semibold ${textMain} mb-4`}>📋 Таблица результатов</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
                <th className={`text-left py-3 px-2 font-medium ${textSub}`}>Студент</th>
                <th className={`text-left py-3 px-2 font-medium ${textSub}`}>Тест</th>
                <th className={`text-center py-3 px-2 font-medium ${textSub}`}>Результат</th>
                <th className={`text-center py-3 px-2 font-medium ${textSub}`}>Время</th>
                <th className={`text-center py-3 px-2 font-medium ${textSub}`}>Дата</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map(r => {
                const test = assignedTests.find(t => t.id === r.testId);
                const pct = Math.round((r.score / r.totalQuestions) * 100);
                return (
                  <tr key={r.id} className={`border-b ${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-slate-50 hover:bg-slate-50'}`}>
                    <td className={`py-3 px-2 ${textMain}`}>{r.studentName}</td>
                    <td className={`py-3 px-2 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{test?.title || '—'}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${pct >= 70 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300'}`}>
                        {r.score}/{r.totalQuestions} ({pct}%)
                      </span>
                    </td>
                    <td className={`py-3 px-2 text-center ${textSub}`}>{r.timeSpent ? `${r.timeSpent} мин` : '—'}</td>
                    <td className={`py-3 px-2 text-center ${textSub}`}>{r.completedDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
