import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Award, TrendingUp, Star, Plus, X } from 'lucide-react';
import { t } from '../../i18n';

export function GradesPage() {
  const { user, theme, language } = useAuth();
  const { grades, addGrade, addNotification, addActivity, allUsers } = useData();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700';

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', category: 'Практика', subcategory: '', score: '', comment: '' });
  const [filterStudent, setFilterStudent] = useState('all');

  if (!user) return null;

  const isStudent = user.role === 'student';
  const students = allUsers.filter((u: any) => u.role === 'student');
  const myGrades = isStudent ? grades.filter(g => g.studentId === user.id) : filterStudent === 'all' ? grades : grades.filter(g => g.studentId === filterStudent);
  const avgScore = myGrades.length > 0 ? Math.round(myGrades.reduce((s, g) => s + g.score, 0) / myGrades.length) : 0;

  const getGradeLabel = (score: number) => {
    if (score >= 90) return { label: t('grades.excellent', language), color: 'text-emerald-500', bg: isDark ? 'bg-emerald-900/30' : 'bg-emerald-50' };
    if (score >= 75) return { label: t('grades.good', language), color: 'text-blue-500', bg: isDark ? 'bg-blue-900/30' : 'bg-blue-50' };
    if (score >= 50) return { label: t('grades.satisfactory', language), color: 'text-amber-500', bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50' };
    return { label: t('grades.unsatisfactory', language), color: 'text-red-500', bg: isDark ? 'bg-red-900/30' : 'bg-red-50' };
  };

  const handleAdd = () => {
    if (!formData.studentId || !formData.subcategory || !formData.score) return;
    const score = Math.min(100, Math.max(0, Number(formData.score)));
    addGrade({
      id: `g${Date.now()}`, studentId: formData.studentId, category: formData.category,
      subcategory: formData.subcategory, score, maxScore: 100, date: new Date().toISOString().split('T')[0],
      comment: formData.comment, givenBy: user.id,
    });
    const student = allUsers.find((u: any) => u.id === formData.studentId);
    addNotification({ id: `n${Date.now()}`, userId: formData.studentId, title: 'Новая оценка', message: `${formData.subcategory}: ${score}/100`, type: score >= 50 ? 'success' : 'warning', read: false, createdAt: new Date().toISOString() });
    addActivity({ id: `a${Date.now()}`, userId: user.id, userName: user.name.split(' ').slice(0, 2).join(' '), action: 'Поставил оценку', details: `${student?.name?.split(' ')[0]} — ${score}/100 (${formData.subcategory})`, timestamp: new Date().toISOString(), type: 'grade' });
    setFormData({ studentId: '', category: 'Практика', subcategory: '', score: '', comment: '' });
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className={`rounded-2xl p-6 bg-gradient-to-r ${isStudent ? 'from-amber-500 to-orange-600' : 'from-violet-500 to-purple-600'} text-white shadow-lg animate-fadeInUp`}>
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-3"><Award size={28} /> {t('grades.title', language)}</h2>
        <p className="text-white/70">{t('grades.scale', language)}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
        {[
          { v: myGrades.length, l: t('common.total', language), c: 'text-blue-500' },
          { v: `${avgScore}/100`, l: 'Средний балл', c: avgScore >= 75 ? 'text-emerald-500' : avgScore >= 50 ? 'text-amber-500' : 'text-red-500' },
          { v: myGrades.filter(g => g.score >= 90).length, l: t('grades.excellent', language), c: 'text-emerald-500' },
          { v: myGrades.filter(g => g.score < 50).length, l: t('grades.unsatisfactory', language), c: 'text-red-500' },
        ].map((s, i) => (
          <div key={i} className={`${cardBg} rounded-2xl p-4 shadow-sm border card-hover animate-fadeIn`}>
            <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
            <p className={`text-xs ${textSub}`}>{s.l}</p>
          </div>
        ))}
      </div>

      {!isStudent && (
        <div className={`${cardBg} rounded-2xl p-4 shadow-sm border flex flex-col sm:flex-row gap-3`}>
          <select value={filterStudent} onChange={e => setFilterStudent(e.target.value)} className={`flex-1 px-4 py-2.5 rounded-xl border ${inputBg}`}>
            <option value="all">Все студенты</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.group})</option>)}
          </select>
          <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition font-medium flex items-center gap-2">
            <Plus size={16} /> Добавить оценку
          </button>
        </div>
      )}

      {showForm && !isStudent && (
        <div className={`${cardBg} rounded-2xl p-5 shadow-sm border animate-scaleIn`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${textMain}`}>Новая оценка</h3>
            <button onClick={() => setShowForm(false)} className={textSub}><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={formData.studentId} onChange={e => setFormData(p => ({ ...p, studentId: e.target.value }))} className={`px-3 py-2.5 rounded-xl border ${inputBg}`}>
              <option value="">Выберите студента</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className={`px-3 py-2.5 rounded-xl border ${inputBg}`}>
              <option value="Практика">Практика</option>
              <option value="Тесты">Тесты</option>
              <option value="Отчётность">Отчётность</option>
              <option value="Дисциплина">Дисциплина</option>
            </select>
            <input value={formData.subcategory} onChange={e => setFormData(p => ({ ...p, subcategory: e.target.value }))} placeholder="Подкатегория" className={`px-3 py-2.5 rounded-xl border ${inputBg}`} />
            <input type="number" min="0" max="100" value={formData.score} onChange={e => setFormData(p => ({ ...p, score: e.target.value }))} placeholder="Балл (0-100)" className={`px-3 py-2.5 rounded-xl border ${inputBg}`} />
          </div>
          <textarea value={formData.comment} onChange={e => setFormData(p => ({ ...p, comment: e.target.value }))} placeholder="Комментарий..." rows={2} className={`w-full mt-3 px-3 py-2.5 rounded-xl border ${inputBg} resize-none`} />
          <button onClick={handleAdd} className="mt-3 px-5 py-2.5 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition font-medium">Сохранить</button>
        </div>
      )}

      {/* Grade distribution bar */}
      {myGrades.length > 0 && (
        <div className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
          <h3 className={`font-semibold ${textMain} mb-3 flex items-center gap-2`}><TrendingUp size={18} className="text-blue-500" /> Распределение оценок</h3>
          <div className="flex h-8 rounded-xl overflow-hidden">
            {[
              { min: 90, max: 100, color: 'bg-emerald-500', label: '90-100' },
              { min: 75, max: 89, color: 'bg-blue-500', label: '75-89' },
              { min: 50, max: 74, color: 'bg-amber-500', label: '50-74' },
              { min: 0, max: 49, color: 'bg-red-500', label: '0-49' },
            ].map(range => {
              const count = myGrades.filter(g => g.score >= range.min && g.score <= range.max).length;
              const pct = (count / myGrades.length) * 100;
              if (pct === 0) return null;
              return (
                <div key={range.label} className={`${range.color} flex items-center justify-center transition-all`} style={{ width: `${pct}%` }}>
                  <span className="text-white text-xs font-medium">{count}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {['90-100', '75-89', '50-74', '0-49'].map((r, i) => (
              <span key={r} className={`text-xs flex items-center gap-1 ${textSub}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-red-500'][i]}`} /> {r}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {myGrades.sort((a, b) => b.date.localeCompare(a.date)).map(g => {
          const gl = getGradeLabel(g.score);
          const student = allUsers.find((u: any) => u.id === g.studentId);
          const grader = allUsers.find((u: any) => u.id === g.givenBy);
          return (
            <div key={g.id} className={`${cardBg} rounded-2xl p-4 shadow-sm border card-hover flex items-center gap-4`}>
              <div className={`w-14 h-14 rounded-2xl ${gl.bg} flex items-center justify-center`}>
                <span className={`text-xl font-bold ${gl.color}`}>{g.score}</span>
              </div>
              <div className="flex-1 min-w-0">
                {!isStudent && <p className={`text-sm font-semibold ${textMain}`}>{student?.name}</p>}
                <p className={`text-sm ${textMain}`}>{g.category} → {g.subcategory}</p>
                <div className={`flex items-center gap-3 text-xs ${textSub} mt-0.5`}>
                  <span>{g.date}</span>
                  <span>Преподаватель: {grader?.name?.split(' ').slice(0, 2).join(' ')}</span>
                </div>
                {g.comment && <p className={`text-xs mt-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>💬 {g.comment}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${gl.bg} ${gl.color}`}>
                  <Star size={12} /> {gl.label}
                </span>
              </div>
            </div>
          );
        })}
        {myGrades.length === 0 && (
          <div className={`text-center py-12 ${textSub}`}>
            <Award size={48} className="mx-auto mb-3 opacity-30" />
            <p>{t('common.noData', language)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
