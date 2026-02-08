import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { practices } from '../../data';
import { BarChart3, Clock, CheckCircle, Trophy, TrendingUp } from 'lucide-react';

export function ResultsPage() {
  const { user } = useAuth();
  const { diary, testResults, assignedTests } = useData();

  if (!user) return null;

  const myEntries = diary.filter(e => e.studentId === user.id);
  const totalHours = myEntries.reduce((s, e) => s + e.hours, 0);
  const confirmedHours = myEntries.filter(e => e.confirmed).reduce((s, e) => s + e.hours, 0);
  const myResults = testResults.filter(r => r.studentId === user.id);
  const avgScore = myResults.length > 0 ? Math.round(myResults.reduce((s, r) => s + (r.score / r.totalQuestions) * 100, 0) / myResults.length) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <Clock className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{totalHours}</p>
          <p className="text-sm text-slate-400">Всего часов</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <CheckCircle className="text-emerald-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{confirmedHours}</p>
          <p className="text-sm text-slate-400">Подтверждено</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
            <Trophy className="text-violet-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{myResults.length}</p>
          <p className="text-sm text-slate-400">Тестов пройдено</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <TrendingUp className="text-amber-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{avgScore}%</p>
          <p className="text-sm text-slate-400">Средний балл</p>
        </div>
      </div>

      {/* Practice progress */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-500" />
          Прогресс по практикам
        </h3>
        <div className="space-y-4">
          {practices.filter(p => p.group === user.group).map(p => {
            const entries = myEntries.filter(e => e.practiceId === p.id);
            const hrs = entries.reduce((s, e) => s + e.hours, 0);
            const startDate = new Date(p.startDate);
            const endDate = new Date(p.endDate);
            const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const expectedHours = totalDays * 6;
            const progress = Math.min(100, Math.round((hrs / expectedHours) * 100));

            return (
              <div key={p.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-600">{p.title}</span>
                  <span className="text-sm text-slate-400">{hrs} / {expectedHours} ч</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test results */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-violet-500" />
          Результаты тестов
        </h3>
        {myResults.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">Тесты ещё не пройдены</p>
        ) : (
          <div className="space-y-3">
            {myResults.map(r => {
              const test = assignedTests.find(t => t.id === r.testId);
              const percent = Math.round((r.score / r.totalQuestions) * 100);
              return (
                <div key={r.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${percent >= 70 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {percent}%
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-700 text-sm">{test?.title || 'Тест'}</p>
                    <p className="text-xs text-slate-400">{r.completedDate} • {r.score}/{r.totalQuestions} правильных</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
