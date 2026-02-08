import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { practices } from '../../data';
import {
  Layout, PlusCircle, Copy, Edit3, Trash2, Search,
  ChevronDown, GraduationCap, BarChart3, Users, Trophy,
  Star, BookOpen, ArrowRight, X, Plus, Save, Check
} from 'lucide-react';
import type { TestTemplate, TestQuestion } from '../../types';

const diffLabel: Record<string, string> = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' };
const diffColor: Record<string, string> = { easy: 'bg-green-50 text-green-600', medium: 'bg-amber-50 text-amber-600', hard: 'bg-red-50 text-red-600' };
const diffBorder: Record<string, string> = { easy: 'border-green-200', medium: 'border-amber-200', hard: 'border-red-200' };

export function TemplatesPage() {
  const { templates, addTemplate, deleteTemplate } = useData();
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState<string>('all');
  const [viewTemplate, setViewTemplate] = useState<string | null>(null);

  const filtered = templates.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.topic.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDiff === 'all' || t.difficulty === filterDiff;
    return matchSearch && matchDiff && t.isTemplate;
  });

  const handleDuplicate = (tmpl: TestTemplate) => {
    addTemplate({
      ...tmpl,
      id: `t${Date.now()}`,
      title: `${tmpl.title} (копия)`,
      questions: tmpl.questions.map(q => ({ ...q, id: `q${Date.now()}${Math.random()}` })),
    });
  };

  const activeTemplate = templates.find(t => t.id === viewTemplate);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Layout className="text-violet-500" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{templates.filter(t => t.isTemplate).length}</p>
              <p className="text-xs text-slate-400">Шаблонов</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{new Set(templates.map(t => t.topic)).size}</p>
              <p className="text-xs text-slate-400">Тем</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Star className="text-emerald-500" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{templates.reduce((s, t) => s + t.questions.length, 0)}</p>
              <p className="text-xs text-slate-400">Вопросов всего</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию или теме..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 text-sm"
          />
        </div>
        <div className="relative">
          <select
            value={filterDiff}
            onChange={e => setFilterDiff(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:border-blue-400 outline-none"
          >
            <option value="all">Все уровни</option>
            <option value="easy">Лёгкий</option>
            <option value="medium">Средний</option>
            <option value="hard">Сложный</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* View template modal */}
      {activeTemplate && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewTemplate(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="font-bold text-slate-800">{activeTemplate.title}</h3>
                <p className="text-sm text-slate-400">{activeTemplate.topic} • {activeTemplate.questions.length} вопросов</p>
              </div>
              <button onClick={() => setViewTemplate(null)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600">{activeTemplate.description}</p>
              {activeTemplate.questions.map((q, i) => (
                <div key={q.id} className="bg-slate-50 rounded-xl p-4">
                  <p className="font-medium text-slate-700 text-sm mb-2">
                    <span className="text-blue-500">{i + 1}.</span> {q.text}
                  </p>
                  <div className="space-y-1">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className={`text-sm px-3 py-1.5 rounded-lg ${oi === q.correctAnswer ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-500'}`}>
                        {oi === q.correctAnswer && <Check size={14} className="inline mr-1" />}
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(tmpl => (
          <div key={tmpl.id} className={`bg-white rounded-2xl p-5 shadow-sm border-2 ${diffBorder[tmpl.difficulty]} hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-700">{tmpl.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{tmpl.topic}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColor[tmpl.difficulty]}`}>
                {diffLabel[tmpl.difficulty]}
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-3 line-clamp-2">{tmpl.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{tmpl.questions.length} вопросов</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewTemplate(tmpl.id)}
                  title="Просмотр"
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <BookOpen size={16} />
                </button>
                <button
                  onClick={() => handleDuplicate(tmpl)}
                  title="Дублировать"
                  className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500 transition"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => deleteTemplate(tmpl.id)}
                  title="Удалить"
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Layout size={48} className="mx-auto mb-3 opacity-30" />
          <p>Шаблонов не найдено</p>
        </div>
      )}
    </div>
  );
}

export function CreateTestPage() {
  const { user } = useAuth();
  const { templates, addTemplate } = useData();
  const [mode, setMode] = useState<'template' | 'new'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleSelectTemplate = (tmplId: string) => {
    const tmpl = templates.find(t => t.id === tmplId);
    if (tmpl) {
      setSelectedTemplate(tmplId);
      setTitle(tmpl.title);
      setTopic(tmpl.topic);
      setDescription(tmpl.description);
      setDifficulty(tmpl.difficulty);
      setQuestions(tmpl.questions.map(q => ({ ...q, id: `q${Date.now()}${Math.random()}` })));
    }
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: `q${Date.now()}`,
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    }]);
  };

  const updateQuestion = (idx: number, field: string, value: string | number) => {
    setQuestions(prev => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      const opts = [...q.options];
      opts[oIdx] = value;
      return { ...q, options: opts };
    }));
  };

  const removeQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!title || questions.length === 0) return;
    addTemplate({
      id: `t${Date.now()}`,
      title,
      topic,
      description,
      topicMaterial: '',
      difficulty,
      questions,
      isTemplate: true,
      createdBy: user.id,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mode selector */}
      <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-100 flex">
        <button
          onClick={() => setMode('template')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === 'template' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Из шаблона
        </button>
        <button
          onClick={() => setMode('new')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${mode === 'new' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          С нуля
        </button>
      </div>

      {/* Template selector */}
      {mode === 'template' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Layout size={18} className="text-violet-500" />
            Выберите шаблон (создание теста в 1-2 клика)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.filter(t => t.isTemplate).map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selectedTemplate === tmpl.id
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-medium text-slate-700 text-sm">{tmpl.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${diffColor[tmpl.difficulty]}`}>
                    {diffLabel[tmpl.difficulty]}
                  </span>
                  <span className="text-xs text-slate-400">{tmpl.questions.length} вопросов</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Test form */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <Edit3 size={18} className="text-blue-500" />
          {mode === 'template' ? 'Редактирование теста' : 'Новый тест'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-slate-500 mb-1">Название</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1">Тема</label>
            <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-1">Описание</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 text-sm resize-none" />
        </div>

        <div>
          <label className="block text-sm text-slate-500 mb-1">Сложность</label>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${difficulty === d ? `${diffColor[d]} ring-2 ring-offset-1 ring-current` : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                {diffLabel[d]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {questions.map((q, qi) => (
          <div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-blue-500">Вопрос {qi + 1}</span>
              <button onClick={() => removeQuestion(qi)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition">
                <Trash2 size={16} />
              </button>
            </div>
            <input
              value={q.text}
              onChange={e => updateQuestion(qi, 'text', e.target.value)}
              placeholder="Текст вопроса..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 text-sm mb-3"
            />
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuestion(qi, 'correctAnswer', oi)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                      q.correctAnswer === oi ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 hover:border-emerald-300'
                    }`}
                  >
                    {q.correctAnswer === oi && <Check size={14} className="text-white" />}
                  </button>
                  <input
                    value={opt}
                    onChange={e => updateOption(qi, oi, e.target.value)}
                    placeholder={`Вариант ${oi + 1}`}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-400 outline-none text-slate-700 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={18} />
          Добавить вопрос
        </button>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!title || questions.length === 0}
          className="px-6 py-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saved ? <><Check size={18} /> Сохранено!</> : <><Save size={18} /> Сохранить тест</>}
        </button>
      </div>
    </div>
  );
}

export function AssignTestPage() {
  const { user } = useAuth();
  const { templates, assignTest, allUsers, addNotification, addActivity } = useData();
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assigned, setAssigned] = useState(false);

  if (!user) return null;

  const allGroups = [...new Set([
    'ИС-922', 'ИС-923', 'ИС-924',
    ...practices.map(p => p.group),
    ...allUsers.filter(u => u.role === 'student' && u.group).map(u => u.group!),
  ])].sort();
  const tmpl = templates.find(t => t.id === selectedTemplate);

  const handleAssign = () => {
    if (!tmpl || !assignTo || !deadline) return;
    const testTitle = `${tmpl.title} — ${assignTo}`;
    assignTest({
      id: `at${Date.now()}`,
      templateId: tmpl.id,
      title: testTitle,
      topic: tmpl.topic,
      topicMaterial: tmpl.topicMaterial,
      difficulty: tmpl.difficulty,
      questions: tmpl.questions,
      assignedTo: assignTo,
      assignedBy: user.id,
      assignedDate: new Date().toISOString().split('T')[0],
      deadline,
      timeLimit: tmpl.timeLimit,
      passingScore: tmpl.passingScore,
    });

    // Send notification to ALL students in the selected group (including newly registered)
    const studentsInGroup = allUsers.filter(u => u.role === 'student' && u.group === assignTo && u.approved);
    studentsInGroup.forEach(student => {
      addNotification({
        id: `n${Date.now()}_${student.id}`,
        userId: student.id,
        title: '📝 Назначен новый тест',
        message: `Вам назначен тест "${testTitle}". Дедлайн: ${deadline}`,
        type: 'warning',
        read: false,
        createdAt: new Date().toISOString(),
      });
    });

    addActivity({
      id: `a${Date.now()}`,
      userId: user.id,
      userName: user.name.split(' ').slice(0, 2).join(' '),
      action: 'Назначил тест',
      details: `${testTitle} → ${studentsInGroup.length} студентов`,
      timestamp: new Date().toISOString(),
      type: 'test',
    });

    setAssigned(true);
    setTimeout(() => {
      setAssigned(false);
      setSelectedTemplate('');
      setAssignTo('');
      setDeadline('');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <GraduationCap size={20} className="text-blue-500" />
          Назначение теста группе
        </h3>

        <div>
          <label className="block text-sm text-slate-500 mb-1.5">Выберите тест</label>
          <div className="relative">
            <select
              value={selectedTemplate}
              onChange={e => setSelectedTemplate(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-400 outline-none text-sm"
            >
              <option value="">— Выберите шаблон —</option>
              {templates.filter(t => t.isTemplate).map(t => (
                <option key={t.id} value={t.id}>{t.title} ({t.questions.length} вопросов)</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>

        {tmpl && (
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="font-medium text-slate-700 text-sm">{tmpl.title}</p>
            <p className="text-xs text-slate-400 mt-1">{tmpl.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColor[tmpl.difficulty]}`}>{diffLabel[tmpl.difficulty]}</span>
              <span className="text-xs text-slate-400">{tmpl.questions.length} вопросов</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-500 mb-1.5">Группа</label>
            <div className="relative">
              <select
                value={assignTo}
                onChange={e => setAssignTo(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-400 outline-none text-sm"
              >
                <option value="">— Группа —</option>
                {allGroups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-slate-500 mb-1.5">Дедлайн</label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-400 outline-none text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleAssign}
          disabled={!selectedTemplate || !assignTo || !deadline}
          className="w-full py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {assigned ? (
            <><Check size={18} /> Тест назначен!</>
          ) : (
            <><ArrowRight size={18} /> Назначить тест</>
          )}
        </button>
      </div>
    </div>
  );
}

export function StatisticsPage() {
  const { testResults, assignedTests } = useData();

  const totalTests = assignedTests.length;
  const totalAttempts = testResults.length;
  const avgScore = totalAttempts > 0
    ? Math.round(testResults.reduce((s, r) => s + (r.score / r.totalQuestions) * 100, 0) / totalAttempts)
    : 0;
  const passRate = totalAttempts > 0
    ? Math.round(testResults.filter(r => (r.score / r.totalQuestions) >= 0.7).length / totalAttempts * 100)
    : 0;

  const byTest = assignedTests.map(t => {
    const results = testResults.filter(r => r.testId === t.id);
    const avg = results.length > 0
      ? Math.round(results.reduce((s, r) => s + (r.score / r.totalQuestions) * 100, 0) / results.length)
      : 0;
    return { test: t, results, avg };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <PlusCircle className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{totalTests}</p>
          <p className="text-sm text-slate-400">Назначено тестов</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
            <Users className="text-violet-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{totalAttempts}</p>
          <p className="text-sm text-slate-400">Попыток</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <Trophy className="text-emerald-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{avgScore}%</p>
          <p className="text-sm text-slate-400">Средний балл</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <BarChart3 className="text-amber-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-800">{passRate}%</p>
          <p className="text-sm text-slate-400">Процент сдачи</p>
        </div>
      </div>

      {/* Per test stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-500" />
          Статистика по тестам
        </h3>
        <div className="space-y-4">
          {byTest.map(({ test, results, avg }) => (
            <div key={test.id} className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-slate-700 text-sm">{test.title}</p>
                  <p className="text-xs text-slate-400">{test.assignedTo} • {results.length} прохождений</p>
                </div>
                <span className={`text-lg font-bold ${avg >= 70 ? 'text-emerald-600' : 'text-red-500'}`}>{avg}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${avg >= 70 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                  style={{ width: `${avg}%` }}
                />
              </div>
              {results.length > 0 && (
                <div className="mt-3 space-y-1">
                  {results.map(r => (
                    <div key={r.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">{r.studentName}</span>
                      <span className={`font-medium ${(r.score / r.totalQuestions) >= 0.7 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {r.score}/{r.totalQuestions} ({Math.round((r.score / r.totalQuestions) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {byTest.length === 0 && (
            <p className="text-center py-8 text-slate-400">Тестов пока нет</p>
          )}
        </div>
      </div>
    </div>
  );
}
