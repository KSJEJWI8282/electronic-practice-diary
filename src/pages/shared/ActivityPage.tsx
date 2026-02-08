import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Activity, Filter } from 'lucide-react';

export function ActivityPage() {
  const { theme } = useAuth();
  const { activityLog } = useData();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? activityLog : activityLog.filter(a => a.type === filter);
  const typeIcons: Record<string, string> = { diary: '📝', file: '📁', test: '✅', comment: '💬', system: '⚙️', grade: '⭐', approval: '🔑' };
  const typeColors: Record<string, string> = {
    diary: isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600',
    file: isDark ? 'bg-violet-900/30 text-violet-300' : 'bg-violet-50 text-violet-600',
    test: isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-600',
    comment: isDark ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-600',
    system: isDark ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600',
    grade: isDark ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-50 text-orange-600',
    approval: isDark ? 'bg-pink-900/30 text-pink-300' : 'bg-pink-50 text-pink-600',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-3"><Activity size={28} /> Журнал действий</h2>
        <p className="text-white/60">Все события системы</p>
      </div>

      <div className={`${cardBg} rounded-2xl p-4 shadow-sm border flex items-center gap-2 flex-wrap`}>
        <Filter size={16} className={textSub} />
        {['all', 'diary', 'file', 'test', 'comment', 'grade', 'approval'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === f ? 'bg-blue-500 text-white' : isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
            {f === 'all' ? 'Все' : typeIcons[f]} {f === 'all' ? '' : f === 'diary' ? 'Дневник' : f === 'file' ? 'Файлы' : f === 'test' ? 'Тесты' : f === 'comment' ? 'Комментарии' : f === 'grade' ? 'Оценки' : 'Доступ'}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((a, i) => (
          <div key={a.id} className={`${cardBg} rounded-2xl p-4 shadow-sm border card-hover flex items-center gap-4 animate-fadeIn`} style={{ animationDelay: `${i * 0.03}s` }}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${typeColors[a.type] || typeColors.system}`}>
              {typeIcons[a.type] || '⚙️'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${textMain}`}><span className="font-semibold">{a.userName}</span> — {a.action}</p>
              <p className={`text-xs ${textSub} mt-0.5`}>{a.details}</p>
            </div>
            <span className={`text-xs ${textSub} flex-shrink-0`}>
              {new Date(a.timestamp).toLocaleDateString('ru-RU')} {new Date(a.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {filtered.length === 0 && <p className={`text-center py-12 ${textSub}`}>Нет записей</p>}
      </div>
    </div>
  );
}
