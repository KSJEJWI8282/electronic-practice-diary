import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ListChecks, Clock, CheckCircle, ArrowRight, ChevronLeft, Timer, AlertTriangle } from 'lucide-react';

export function TestsPage() {
  const { user, theme } = useAuth();
  const { assignedTests, testResults, addTestResult, addNotification, addActivity } = useData();
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lastScore, setLastScore] = useState({ score: 0, total: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';

  if (!user) return null;

  const myTests = assignedTests.filter(t => t.assignedTo === user.group);
  const completedIds = testResults.filter(r => r.studentId === user.id).map(r => r.testId);
  const currentTest = myTests.find(t => t.id === activeTest);

  useEffect(() => {
    if (currentTest?.timeLimit && activeTest && !submitted) {
      setTimeLeft(currentTest.timeLimit * 60);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeTest, submitted]);

  const handleSubmit = () => {
    if (!currentTest) return;
    if (timerRef.current) clearInterval(timerRef.current);
    let score = 0;
    const answerList: number[] = [];
    currentTest.questions.forEach(q => {
      const ans = answers[q.id] ?? -1;
      answerList.push(ans);
      if (ans === q.correctAnswer) score++;
    });
    const timeSpent = currentTest.timeLimit ? currentTest.timeLimit - Math.floor(timeLeft / 60) : 0;
    addTestResult({
      id: `tr${Date.now()}`,
      testId: currentTest.id,
      studentId: user.id,
      studentName: user.name,
      score,
      totalQuestions: currentTest.questions.length,
      completedDate: new Date().toISOString().split('T')[0],
      answers: answerList,
      timeSpent,
    });
    addActivity({
      id: `a${Date.now()}`, userId: user.id,
      userName: user.name.split(' ').map((n, i) => i === 0 ? n : n[0] + '.').join(' '),
      action: 'Прошёл тест', details: `${currentTest.title} — ${Math.round((score / currentTest.questions.length) * 100)}%`,
      timestamp: new Date().toISOString(), type: 'test',
    });
    addNotification({
      id: `n${Date.now()}`, userId: '5', title: 'Тест пройден',
      message: `${user.name} прошёл "${currentTest.title}" — ${score}/${currentTest.questions.length}`,
      type: 'success', read: false, createdAt: new Date().toISOString(),
    });
    setLastScore({ score, total: currentTest.questions.length });
    setSubmitted(true);
  };

  const diffLabel: Record<string, string> = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' };
  const diffColor: Record<string, string> = { easy: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400', medium: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', hard: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  if (submitted) {
    const percent = Math.round((lastScore.score / lastScore.total) * 100);
    const passed = percent >= (currentTest?.passingScore || 70);
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className={`w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold shadow-lg ${passed ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'}`}>
          {percent}%
        </div>
        <h2 className={`text-2xl font-bold ${textMain} mb-2`}>
          {passed ? '🎉 Тест пройден!' : '❌ Тест не пройден'}
        </h2>
        <p className={`${textSub} mb-1`}>Правильных ответов: {lastScore.score} из {lastScore.total}</p>
        <p className={`text-sm font-medium ${passed ? 'text-emerald-500' : 'text-red-500'}`}>
          Проходной балл: {currentTest?.passingScore || 70}%
        </p>

        {/* Show correct answers */}
        {currentTest && (
          <div className="mt-8 text-left space-y-3">
            <h3 className={`font-semibold ${textMain}`}>Разбор ответов:</h3>
            {currentTest.questions.map((q, i) => {
              const userAnswer = answers[q.id] ?? -1;
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={q.id} className={`${cardBg} rounded-xl p-4 border`}>
                  <p className={`text-sm font-medium ${textMain} mb-2`}>
                    <span className={isCorrect ? 'text-emerald-500' : 'text-red-500'}>{isCorrect ? '✓' : '✕'}</span> {i + 1}. {q.text}
                  </p>
                  <div className="space-y-1">
                    {q.options.map((opt, oi) => (
                      <p key={oi} className={`text-xs px-3 py-1.5 rounded-lg ${
                        oi === q.correctAnswer ? (isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-50 text-emerald-700') :
                        oi === userAnswer ? (isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700') :
                        isDark ? 'text-gray-500' : 'text-slate-400'
                      }`}>
                        {oi === q.correctAnswer && '✓ '}{oi === userAnswer && oi !== q.correctAnswer && '✕ '}{opt}
                      </p>
                    ))}
                  </div>
                  {q.explanation && <p className={`text-xs mt-2 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>💡 {q.explanation}</p>}
                </div>
              );
            })}
          </div>
        )}

        <button onClick={() => { setActiveTest(null); setSubmitted(false); setAnswers({}); }}
          className="mt-6 px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-medium">
          К списку тестов
        </button>
      </div>
    );
  }

  if (currentTest) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => { setActiveTest(null); setAnswers({}); if (timerRef.current) clearInterval(timerRef.current); }}
            className={`flex items-center gap-2 ${textSub} hover:${textMain} transition text-sm`}>
            <ChevronLeft size={16} /> Назад
          </button>
          {currentTest.timeLimit && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${timeLeft < 60 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'} font-mono font-bold text-sm`}>
              <Timer size={16} /> {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <div className={`${cardBg} rounded-2xl p-6 shadow-sm border`}>
          <h2 className={`text-lg font-bold ${textMain} mb-1`}>{currentTest.title}</h2>
          <p className={`text-sm ${textSub} mb-6`}>{currentTest.questions.length} вопросов • {diffLabel[currentTest.difficulty]}</p>

          {/* Progress */}
          <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-slate-100'} rounded-full mb-6 overflow-hidden`}>
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(answers).length / currentTest.questions.length) * 100}%` }} />
          </div>

          <div className="space-y-6">
            {currentTest.questions.map((q, qi) => (
              <div key={q.id} className={`${isDark ? 'bg-gray-700/50' : 'bg-slate-50'} rounded-xl p-5`}>
                <p className={`font-medium ${textMain} mb-3`}>
                  <span className="text-blue-500 mr-2">{qi + 1}.</span>{q.text}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <label key={oi} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border-2 ${
                      answers[q.id] === oi
                        ? isDark ? 'border-blue-500 bg-blue-900/30' : 'border-blue-400 bg-blue-50'
                        : isDark ? 'border-transparent bg-gray-800 hover:border-gray-600' : 'border-transparent bg-white hover:border-slate-200'
                    }`}>
                      <input type="radio" name={q.id} checked={answers[q.id] === oi}
                        onChange={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))}
                        className="accent-blue-500" />
                      <span className={`text-sm ${textMain}`}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className={`text-sm ${textSub}`}>Отвечено: {Object.keys(answers).length} / {currentTest.questions.length}</p>
            <button onClick={handleSubmit}
              disabled={Object.keys(answers).length < currentTest.questions.length}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
              Завершить тест <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`${cardBg} rounded-2xl p-4 shadow-sm border text-center`}>
          <p className={`text-2xl font-bold text-blue-500`}>{myTests.length}</p>
          <p className={`text-xs ${textSub}`}>Назначено</p>
        </div>
        <div className={`${cardBg} rounded-2xl p-4 shadow-sm border text-center`}>
          <p className={`text-2xl font-bold text-emerald-500`}>{completedIds.length}</p>
          <p className={`text-xs ${textSub}`}>Пройдено</p>
        </div>
        <div className={`${cardBg} rounded-2xl p-4 shadow-sm border text-center`}>
          <p className={`text-2xl font-bold text-amber-500`}>{myTests.length - completedIds.length}</p>
          <p className={`text-xs ${textSub}`}>Осталось</p>
        </div>
      </div>

      {myTests.length === 0 && (
        <div className={`text-center py-12 ${textSub}`}>
          <ListChecks size={48} className="mx-auto mb-3 opacity-30" />
          <p>Назначенных тестов пока нет</p>
        </div>
      )}

      {myTests.map(test => {
        const done = completedIds.includes(test.id);
        const result = testResults.find(r => r.testId === test.id && r.studentId === user.id);
        const pct = result ? Math.round((result.score / result.totalQuestions) * 100) : 0;
        const isOverdue = !done && new Date(test.deadline) < new Date();
        return (
          <div key={test.id} className={`${cardBg} rounded-2xl p-5 shadow-sm border hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className={`font-semibold ${textMain}`}>{test.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColor[test.difficulty]}`}>{diffLabel[test.difficulty]}</span>
                  {isOverdue && <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1"><AlertTriangle size={10} /> Просрочен</span>}
                </div>
                <p className={`text-sm ${textSub} mb-2`}>Тема: {test.topic} • {test.questions.length} вопросов</p>
                <div className={`flex items-center gap-4 text-xs ${textSub} flex-wrap`}>
                  <span className="flex items-center gap-1"><Clock size={12} /> До: {test.deadline}</span>
                  {test.timeLimit && <span className="flex items-center gap-1"><Timer size={12} /> {test.timeLimit} мин</span>}
                  {test.passingScore && <span>Проходной: {test.passingScore}%</span>}
                </div>
              </div>
              {done ? (
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium ${pct >= (test.passingScore || 70) ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300'}`}>
                    <CheckCircle size={14} /> {result?.score}/{result?.totalQuestions} ({pct}%)
                  </span>
                </div>
              ) : (
                <button onClick={() => setActiveTest(test.id)}
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition flex items-center gap-1 flex-shrink-0">
                  Пройти <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
