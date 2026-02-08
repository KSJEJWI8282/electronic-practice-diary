import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { practices } from '../../data';
import { Plus, Calendar, Clock, CheckCircle, AlertCircle, ChevronDown, MessageSquare, Trash2, Star, X } from 'lucide-react';

export function DiaryPage() {
  const { user, theme } = useAuth();
  const { diary, addDiaryEntry, deleteDiaryEntry, addNotification, addActivity } = useData();
  const [selectedPractice, setSelectedPractice] = useState(practices[0]?.id || '');
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ date: '', description: '', hours: '' });
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700';

  if (!user) return null;

  const userPractices = practices.filter(p => p.group === user.group);
  const myEntries = diary.filter(e => e.studentId === user.id && e.practiceId === selectedPractice);
  const totalHours = myEntries.reduce((sum, e) => sum + e.hours, 0);
  const confirmedHours = myEntries.filter(e => e.confirmed).reduce((sum, e) => sum + e.hours, 0);
  const practice = practices.find(p => p.id === selectedPractice);

  const handleAddEntry = () => {
    if (!newEntry.date || !newEntry.description || !newEntry.hours) return;
    const entry = {
      id: `d${Date.now()}`,
      studentId: user.id,
      practiceId: selectedPractice,
      date: newEntry.date,
      description: newEntry.description,
      hours: Number(newEntry.hours),
      confirmed: false,
      createdAt: new Date().toISOString(),
    };
    addDiaryEntry(entry);
    addActivity({
      id: `a${Date.now()}`,
      userId: user.id,
      userName: user.name.split(' ').map((n, i) => i === 0 ? n : n[0] + '.').join(' '),
      action: 'Добавил запись',
      details: `Дневник практики, ${newEntry.date}`,
      timestamp: new Date().toISOString(),
      type: 'diary',
    });
    addNotification({
      id: `n${Date.now()}`,
      userId: '4',
      title: 'Новая запись в дневнике',
      message: `${user.name} добавил запись за ${newEntry.date}`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });
    setNewEntry({ date: '', description: '', hours: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteDiaryEntry(id);
  };

  // Calendar view helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
    return days;
  };

  const calendarDate = practice ? new Date(practice.startDate) : new Date();
  const calendarDays = getDaysInMonth(calendarDate);
  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Practice selector */}
      <div className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label className={`block text-sm font-medium ${textSub} mb-2`}>Вид практики</label>
            <div className="relative">
              <select
                value={selectedPractice}
                onChange={e => setSelectedPractice(e.target.value)}
                className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border ${inputBg} focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
              >
                {userPractices.map(p => (
                  <option key={p.id} value={p.id}>{p.title} ({p.startDate} — {p.endDate})</option>
                ))}
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 ${textSub} pointer-events-none`} size={18} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('list')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-500'}`}>
              📋 Список
            </button>
            <button onClick={() => setViewMode('calendar')} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-700 text-gray-400' : 'bg-slate-100 text-slate-500'}`}>
              📅 Календарь
            </button>
          </div>
        </div>
        {practice && (
          <div className={`mt-3 flex flex-wrap gap-4 text-xs ${textSub}`}>
            <span>📅 {practice.startDate} — {practice.endDate}</span>
            <span>📋 {practice.type}</span>
            <span className={`px-2 py-0.5 rounded-full ${practice.status === 'active' ? 'bg-emerald-100 text-emerald-600' : practice.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
              {practice.status === 'active' ? '🟢 Активна' : practice.status === 'completed' ? '✅ Завершена' : '⏳ Предстоит'}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Calendar className="text-blue-500" size={20} />, bg: 'bg-blue-50 dark:bg-blue-900/30', value: myEntries.length, label: 'Записей' },
          { icon: <Clock className="text-amber-500" size={20} />, bg: 'bg-amber-50 dark:bg-amber-900/30', value: totalHours, label: 'Всего часов' },
          { icon: <CheckCircle className="text-emerald-500" size={20} />, bg: 'bg-emerald-50 dark:bg-emerald-900/30', value: confirmedHours, label: 'Подтверждено' },
        ].map((s, i) => (
          <div key={i} className={`${cardBg} rounded-2xl p-4 shadow-sm border`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>{s.icon}</div>
              <div>
                <p className={`text-2xl font-bold ${textMain}`}>{s.value}</p>
                <p className={`text-xs ${textSub}`}>{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {practice && (
        <div className={`${cardBg} rounded-2xl p-4 shadow-sm border`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${textMain}`}>Прогресс практики</span>
            <span className={`text-sm ${textSub}`}>{Math.min(100, Math.round((totalHours / 80) * 100))}%</span>
          </div>
          <div className={`w-full h-3 ${isDark ? 'bg-gray-700' : 'bg-slate-100'} rounded-full overflow-hidden`}>
            <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (totalHours / 80) * 100)}%` }} />
          </div>
          <p className={`text-xs ${textSub} mt-1`}>Ожидаемый объём: ~80 часов</p>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
          <h3 className={`font-semibold ${textMain} mb-4`}>{monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}</h3>
          <div className="grid grid-cols-7 gap-1">
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
              <div key={d} className={`text-center text-xs font-medium ${textSub} py-2`}>{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              if (!day) return <div key={i} />;
              const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEntry = myEntries.find(e => e.date === dateStr);
              return (
                <div key={i} className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs relative cursor-pointer transition-all ${
                  dayEntry
                    ? dayEntry.confirmed
                      ? isDark ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : isDark ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                    : isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-slate-50 text-slate-600'
                }`}>
                  <span className="font-medium">{day}</span>
                  {dayEntry && <span className="text-[10px]">{dayEntry.hours}ч</span>}
                </div>
              );
            })}
          </div>
          <div className={`flex gap-4 mt-4 text-xs ${textSub}`}>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" /> Подтверждено</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-200" /> На проверке</span>
          </div>
        </div>
      )}

      {/* Add entry button / form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className={`w-full py-3.5 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-2 ${isDark ? 'border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-900/20' : 'border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50'}`}
        >
          <Plus size={20} />
          Добавить запись
        </button>
      ) : (
        <div className={`${cardBg} rounded-2xl p-5 shadow-sm border-2 ${isDark ? 'border-blue-800' : 'border-blue-100'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${textMain}`}>✏️ Новая запись</h3>
            <button onClick={() => setShowForm(false)} className={textSub}><X size={18} /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm ${textSub} mb-1`}>Дата</label>
                <input type="date" value={newEntry.date} onChange={e => setNewEntry(p => ({ ...p, date: e.target.value }))} min={practice?.startDate} max={practice?.endDate}
                  className={`w-full px-3 py-2.5 rounded-xl border ${inputBg} focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none`} />
              </div>
              <div>
                <label className={`block text-sm ${textSub} mb-1`}>Часы (1-12)</label>
                <input type="number" min="1" max="12" value={newEntry.hours} onChange={e => setNewEntry(p => ({ ...p, hours: e.target.value }))} placeholder="8"
                  className={`w-full px-3 py-2.5 rounded-xl border ${inputBg} focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none`} />
              </div>
            </div>
            <div>
              <label className={`block text-sm ${textSub} mb-1`}>Описание выполненных работ</label>
              <textarea value={newEntry.description} onChange={e => setNewEntry(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Подробно опишите выполненную работу..."
                className={`w-full px-3 py-2.5 rounded-xl border ${inputBg} focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none resize-none`} />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-xl ${isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-500 hover:bg-slate-100'} transition text-sm`}>Отмена</button>
              <button onClick={handleAddEntry} className="px-5 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition text-sm font-medium">💾 Сохранить</button>
            </div>
          </div>
        </div>
      )}

      {/* Diary entries */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {myEntries.sort((a, b) => b.date.localeCompare(a.date)).map(entry => (
            <div key={entry.id} className={`${cardBg} rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all group`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <p className={`text-lg font-bold ${textMain}`}>{new Date(entry.date).getDate()}</p>
                    <p className={`text-xs ${textSub}`}>{new Date(entry.date).toLocaleDateString('ru-RU', { month: 'short' })}</p>
                  </div>
                  <div className={`h-10 w-px ${isDark ? 'bg-gray-700' : 'bg-slate-200'}`} />
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                      {new Date(entry.date).toLocaleDateString('ru-RU', { weekday: 'long' })}
                    </p>
                    <div className={`flex items-center gap-2 text-xs ${textSub}`}>
                      <span className="flex items-center gap-1"><Clock size={12} />{entry.hours} ч.</span>
                      {entry.rating && <span className="flex items-center gap-0.5">{Array.from({ length: entry.rating }).map((_, i) => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    entry.confirmed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'
                  }`}>
                    {entry.confirmed ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {entry.confirmed ? 'Подтверждено' : 'На проверке'}
                  </span>
                  {!entry.confirmed && (
                    <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'} leading-relaxed`}>{entry.description}</p>
              {entry.comment && (
                <div className={`mt-3 flex items-start gap-2 rounded-xl p-3 ${isDark ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                  <MessageSquare size={14} className={`${isDark ? 'text-blue-400' : 'text-blue-400'} mt-0.5 flex-shrink-0`} />
                  <div>
                    <p className={`text-xs font-medium ${isDark ? 'text-blue-300' : 'text-blue-600'} mb-0.5`}>Комментарий руководителя</p>
                    <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>{entry.comment}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {myEntries.length === 0 && (
            <div className={`text-center py-12 ${textSub}`}>
              <Calendar size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Записей пока нет</p>
              <p className="text-sm mt-1">Нажмите «Добавить запись» чтобы начать</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
