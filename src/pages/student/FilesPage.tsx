import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { FileText, Upload, Download, Trash2, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';

export function FilesPage() {
  const { user, theme } = useAuth();
  const { files, addFile, deleteFile, addNotification, addActivity } = useData();
  const [showUpload, setShowUpload] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('application/pdf');

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-slate-200 text-slate-700';

  if (!user) return null;

  const myFiles = files.filter(f => f.studentId === user.id);

  const handleUpload = () => {
    if (!fileName) return;
    addFile({
      id: `f${Date.now()}`,
      studentId: user.id,
      studentName: user.name,
      practiceId: 'p1',
      name: fileName,
      type: fileType,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 10 + 0.5).toFixed(1)} МБ`,
      status: 'pending',
    });
    addActivity({
      id: `a${Date.now()}`,
      userId: user.id,
      userName: user.name.split(' ').map((n, i) => i === 0 ? n : n[0] + '.').join(' '),
      action: 'Загрузил файл',
      details: fileName,
      timestamp: new Date().toISOString(),
      type: 'file',
    });
    addNotification({
      id: `n${Date.now()}`,
      userId: '4',
      title: 'Новый файл загружен',
      message: `${user.name} загрузил "${fileName}"`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });
    setFileName('');
    setShowUpload(false);
  };

  const getFileIcon = (name: string) => {
    if (name.endsWith('.pdf')) return { color: isDark ? 'text-red-400 bg-red-900/30' : 'text-red-500 bg-red-50', emoji: '📄' };
    if (name.endsWith('.docx') || name.endsWith('.doc')) return { color: isDark ? 'text-blue-400 bg-blue-900/30' : 'text-blue-500 bg-blue-50', emoji: '📝' };
    if (name.endsWith('.pptx') || name.endsWith('.ppt')) return { color: isDark ? 'text-orange-400 bg-orange-900/30' : 'text-orange-500 bg-orange-50', emoji: '📊' };
    if (name.endsWith('.zip') || name.endsWith('.rar')) return { color: isDark ? 'text-amber-400 bg-amber-900/30' : 'text-amber-500 bg-amber-50', emoji: '📦' };
    if (name.endsWith('.png') || name.endsWith('.jpg')) return { color: isDark ? 'text-emerald-400 bg-emerald-900/30' : 'text-emerald-500 bg-emerald-50', emoji: '🖼️' };
    return { color: isDark ? 'text-gray-400 bg-gray-700' : 'text-slate-500 bg-slate-50', emoji: '📁' };
  };

  const statusInfo = {
    pending: { icon: <Clock size={14} />, label: 'На рассмотрении', color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    reviewed: { icon: <Eye size={14} />, label: 'Просмотрен', color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    approved: { icon: <CheckCircle size={14} />, label: 'Одобрен', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
    rejected: { icon: <XCircle size={14} />, label: 'Отклонён', color: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { value: myFiles.length, label: 'Всего', color: 'text-blue-500' },
          { value: myFiles.filter(f => f.status === 'pending').length, label: 'На проверке', color: 'text-amber-500' },
          { value: myFiles.filter(f => f.status === 'approved').length, label: 'Одобрено', color: 'text-emerald-500' },
          { value: myFiles.filter(f => f.status === 'rejected').length, label: 'Отклонено', color: 'text-red-500' },
        ].map((s, i) => (
          <div key={i} className={`${cardBg} rounded-2xl p-3 shadow-sm border text-center`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className={`text-xs ${textSub}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upload */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`font-semibold ${textMain} mb-4`}>📤 Загрузка файлов</h3>
        {!showUpload ? (
          <button onClick={() => setShowUpload(true)}
            className={`w-full py-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center gap-2 ${isDark ? 'border-gray-600 hover:border-blue-500 hover:bg-blue-900/10' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'}`}>
            <Upload size={32} className={isDark ? 'text-gray-500' : 'text-slate-300'} />
            <p className={`${textMain} font-medium`}>Нажмите для загрузки файла</p>
            <p className={`text-xs ${textSub}`}>PDF, DOCX, PPTX, ZIP, PNG до 50 МБ</p>
          </button>
        ) : (
          <div className={`space-y-3 ${isDark ? 'bg-gray-700/50' : 'bg-slate-50'} rounded-xl p-4`}>
            <input type="text" value={fileName} onChange={e => setFileName(e.target.value)} placeholder="Имя файла (например: Отчёт_итоговый.pdf)"
              className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none`} />
            <select value={fileType} onChange={e => setFileType(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} focus:border-blue-400 outline-none`}>
              <option value="application/pdf">PDF документ</option>
              <option value="application/docx">Word документ (.docx)</option>
              <option value="application/pptx">Презентация (.pptx)</option>
              <option value="application/zip">Архив (.zip)</option>
              <option value="image/png">Изображение (.png)</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowUpload(false)} className={`px-4 py-2 rounded-xl ${isDark ? 'text-gray-400 hover:bg-gray-600' : 'text-slate-500 hover:bg-white'} transition text-sm`}>Отмена</button>
              <button onClick={handleUpload} className="px-5 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition text-sm font-medium flex items-center gap-2">
                <Upload size={16} /> Загрузить
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Files list */}
      <div className="space-y-2">
        {myFiles.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate)).map(f => {
          const fIcon = getFileIcon(f.name);
          const sInfo = statusInfo[f.status];
          return (
            <div key={f.id} className={`${cardBg} rounded-2xl p-4 shadow-sm border flex items-center gap-4 hover:shadow-md transition-shadow`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${fIcon.color}`}>
                {fIcon.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${textMain} truncate`}>{f.name}</p>
                <div className={`flex items-center gap-3 text-xs ${textSub} mt-0.5`}>
                  <span>{f.size}</span>
                  <span>{f.uploadDate}</span>
                </div>
                {f.reviewComment && (
                  <p className={`text-xs mt-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>💬 {f.reviewComment}</p>
                )}
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sInfo.color}`}>
                {sInfo.icon} {sInfo.label}
              </span>
              <div className="flex gap-1">
                <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700 text-gray-500 hover:text-blue-400' : 'hover:bg-blue-50 text-slate-400 hover:text-blue-500'} transition`}>
                  <Download size={16} />
                </button>
                {f.status === 'pending' && (
                  <button onClick={() => deleteFile(f.id)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-red-900/30 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'} transition`}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {myFiles.length === 0 && (
          <div className={`text-center py-12 ${textSub}`}>
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p>Файлов пока нет</p>
          </div>
        )}
      </div>
    </div>
  );
}
