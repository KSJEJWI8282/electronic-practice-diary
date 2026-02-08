import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { FolderOpen, Download, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

export function StudentFilesPage() {
  const { user, theme } = useAuth();
  const { files, updateFileStatus, addNotification, addActivity, allUsers } = useData();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700';

  const [filterStudent, setFilterStudent] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviewComment, setReviewComment] = useState<Record<string, string>>({});

  if (!user) return null;

  const students = allUsers.filter((u: any) => u.role === 'student');
  const filtered = files.filter(f => {
    const matchStudent = filterStudent === 'all' || f.studentId === filterStudent;
    const matchStatus = filterStatus === 'all' || f.status === filterStatus;
    return matchStudent && matchStatus;
  });

  const statusInfo: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    pending: { icon: <Clock size={14} />, label: 'Ожидает', color: isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600' },
    reviewed: { icon: <Eye size={14} />, label: 'Просмотрен', color: isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600' },
    approved: { icon: <CheckCircle size={14} />, label: 'Одобрен', color: isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600' },
    rejected: { icon: <XCircle size={14} />, label: 'Отклонён', color: isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600' },
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.pdf')) return '📄';
    if (name.endsWith('.docx')) return '📝';
    if (name.endsWith('.pptx')) return '📊';
    if (name.endsWith('.zip')) return '📦';
    if (name.endsWith('.png') || name.endsWith('.jpg')) return '🖼️';
    return '📁';
  };

  const handleUpdateStatus = (fId: string, status: 'approved' | 'rejected' | 'reviewed', studentId: string) => {
    const comment = reviewComment[fId] || '';
    updateFileStatus(fId, status, comment);
    addNotification({ id: `n${Date.now()}`, userId: studentId, title: status === 'approved' ? 'Файл одобрен' : status === 'rejected' ? 'Файл отклонён' : 'Файл просмотрен', message: comment || `Статус файла обновлён`, type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info', read: false, createdAt: new Date().toISOString() });
    addActivity({ id: `a${Date.now()}`, userId: user!.id, userName: user!.name.split(' ').slice(0, 2).join(' '), action: `Обновил статус файла → ${statusInfo[status].label}`, details: files.find(f => f.id === fId)?.name || '', timestamp: new Date().toISOString(), type: 'file' });
    setReviewComment(p => ({ ...p, [fId]: '' }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-3"><FolderOpen size={28} /> Файлы студентов</h2>
        <p className="text-white/70">{files.length} файлов • {files.filter(f => f.status === 'pending').length} ожидают проверки</p>
      </div>

      <div className={`${cardBg} rounded-2xl p-4 shadow-sm border flex flex-col sm:flex-row gap-3`}>
        <select value={filterStudent} onChange={e => setFilterStudent(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border ${inputBg}`}>
          <option value="all">Все студенты</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={`px-4 py-2.5 rounded-xl border ${inputBg}`}>
          <option value="all">Все статусы</option>
          <option value="pending">Ожидает</option>
          <option value="reviewed">Просмотрен</option>
          <option value="approved">Одобрен</option>
          <option value="rejected">Отклонён</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate)).map(f => {
          const si = statusInfo[f.status];
          return (
            <div key={f.id} className={`${cardBg} rounded-2xl p-5 shadow-sm border card-hover animate-fadeIn`}>
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getFileIcon(f.name)}</div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${textMain}`}>{f.name}</p>
                  <p className={`text-sm ${textSub} mt-0.5`}>
                    {f.studentName} • {f.size} • {f.uploadDate}
                  </p>
                  {f.reviewComment && <p className={`text-xs mt-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>💬 {f.reviewComment}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${si.color}`}>{si.icon} {si.label}</span>
                  <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-slate-100'} transition`}><Download size={16} className={textSub} /></button>
                </div>
              </div>
              {f.status === 'pending' && (
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2 flex-1">
                    <input
                      value={reviewComment[f.id] || ''}
                      onChange={e => setReviewComment(p => ({ ...p, [f.id]: e.target.value }))}
                      placeholder="Комментарий к файлу..."
                      className={`flex-1 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateStatus(f.id, 'approved', f.studentId)} className="px-3 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition flex items-center gap-1">
                      <CheckCircle size={14} /> Одобрить
                    </button>
                    <button onClick={() => handleUpdateStatus(f.id, 'rejected', f.studentId)} className="px-3 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition flex items-center gap-1">
                      <XCircle size={14} /> Отклонить
                    </button>
                    <button onClick={() => handleUpdateStatus(f.id, 'reviewed', f.studentId)} className={`px-3 py-2 rounded-xl text-sm font-medium ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} transition flex items-center gap-1`}>
                      <Eye size={14} /> Просмотрен
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className={`text-center py-12 ${textSub}`}>
            <FolderOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p>Файлов не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
