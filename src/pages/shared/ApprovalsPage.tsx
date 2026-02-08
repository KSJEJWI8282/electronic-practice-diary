import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserCheck, UserX, Clock, Shield } from 'lucide-react';

export function ApprovalsPage() {
  const { user, theme } = useAuth();
  const { pendingRegistrations, approveRegistration, rejectRegistration, addActivity } = useData();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';

  if (!user) return null;

  const canApprove = (regRole: string) => {
    if (user.role === 'supervisor' && regRole === 'teacher') return true;
    if (user.role === 'teacher' && regRole === 'student') return true;
    if (user.role === 'supervisor' && regRole === 'student') return true;
    return false;
  };

  const pending = pendingRegistrations.filter(p => p.status === 'pending' && canApprove(p.role));
  const processed = pendingRegistrations.filter(p => p.status !== 'pending');

  const roleLabels: Record<string, string> = { student: 'Студент', teacher: 'Преподаватель', supervisor: 'Руководитель' };
  const roleColors: Record<string, string> = {
    student: isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-600',
    teacher: isDark ? 'bg-violet-900/30 text-violet-300' : 'bg-violet-50 text-violet-600',
    supervisor: isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-600',
  };

  const handleApprove = (id: string) => {
    approveRegistration(id);
    addActivity({ id: `a${Date.now()}`, userId: user.id, userName: user.name.split(' ').slice(0, 2).join(' '), action: 'Одобрил регистрацию', details: pendingRegistrations.find(p => p.id === id)?.name || '', timestamp: new Date().toISOString(), type: 'approval' });
  };

  const handleReject = (id: string) => {
    rejectRegistration(id);
    addActivity({ id: `a${Date.now()}`, userId: user.id, userName: user.name.split(' ').slice(0, 2).join(' '), action: 'Отклонил регистрацию', details: pendingRegistrations.find(p => p.id === id)?.name || '', timestamp: new Date().toISOString(), type: 'approval' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl p-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-3"><Shield size={28} /> Заявки на регистрацию</h2>
        <p className="text-white/70">{pending.length} ожидают одобрения</p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className={`font-semibold ${textMain} flex items-center gap-2`}><Clock size={18} className="text-amber-500" /> Ожидающие</h3>
          {pending.map(p => (
            <div key={p.id} className={`${cardBg} rounded-2xl p-5 shadow-sm border card-hover animate-fadeIn`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${roleColors[p.role]}`}>
                  {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${textMain}`}>{p.name}</p>
                  <p className={`text-sm ${textSub}`}>{p.email}{p.group ? ` • ${p.group}` : ''}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[p.role]}`}>{roleLabels[p.role]}</span>
                    <span className={`text-xs ${textSub}`}>{p.requestDate}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleApprove(p.id)} className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition flex items-center gap-1">
                    <UserCheck size={14} /> Одобрить
                  </button>
                  <button onClick={() => handleReject(p.id)} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition flex items-center gap-1">
                    <UserX size={14} /> Отклонить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pending.length === 0 && (
        <div className={`text-center py-12 ${textSub}`}>
          <UserCheck size={48} className="mx-auto mb-3 opacity-30" />
          <p>Нет заявок на рассмотрение</p>
        </div>
      )}

      {processed.length > 0 && (
        <div className="space-y-3">
          <h3 className={`font-semibold ${textMain}`}>Обработанные</h3>
          {processed.map(p => (
            <div key={p.id} className={`${cardBg} rounded-2xl p-4 shadow-sm border opacity-60`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${roleColors[p.role]}`}>
                  {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${textMain}`}>{p.name} — {p.email}</p>
                  <p className={`text-xs ${textSub}`}>{roleLabels[p.role]}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === 'approved' ? (isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600') : (isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600')}`}>
                  {p.status === 'approved' ? '✅ Одобрено' : '❌ Отклонено'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
