import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Send, Bot, Settings, CheckCircle, AlertCircle, Link, Copy, ExternalLink } from 'lucide-react';

export function TelegramPage() {
  const { theme } = useAuth();
  const { telegramSettings, updateTelegramSettings } = useData();
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700';
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTestConnection = () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      setTestResult('error');
    } else {
      setTestResult('success');
    }
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const notifLabels: Record<string, string> = {
    newEntry: 'Новая запись в дневнике',
    confirmedHours: 'Подтверждение часов',
    newComment: 'Новый комментарий',
    testAssigned: 'Назначение теста',
    testCompleted: 'Прохождение теста',
    fileUploaded: 'Загрузка файла',
    gradeAdded: 'Выставление оценки',
    registrationRequest: 'Заявка на регистрацию',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-2xl p-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg animate-fadeInUp">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-3"><Bot size={28} /> Telegram Bot</h2>
        <p className="text-white/70">Настройка уведомлений через Telegram</p>
      </div>

      {/* Status */}
      <div className={`${cardBg} rounded-2xl p-5 shadow-sm border`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${telegramSettings.enabled ? (isDark ? 'bg-emerald-900/30' : 'bg-emerald-50') : (isDark ? 'bg-gray-700' : 'bg-slate-100')}`}>
              <Send size={22} className={telegramSettings.enabled ? 'text-emerald-500' : textSub} />
            </div>
            <div>
              <p className={`font-semibold ${textMain}`}>Статус бота</p>
              <p className={`text-sm ${telegramSettings.enabled ? 'text-emerald-500' : textSub}`}>
                {telegramSettings.enabled ? '✅ Активен' : '⏸️ Отключён'}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={telegramSettings.enabled} onChange={e => updateTelegramSettings({ enabled: e.target.checked })} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      {/* Configuration */}
      <div className={`${cardBg} rounded-2xl p-5 shadow-sm border space-y-4`}>
        <h3 className={`font-semibold ${textMain} flex items-center gap-2`}><Settings size={18} className="text-blue-500" /> Конфигурация</h3>
        <div>
          <label className={`block text-sm font-medium ${textSub} mb-1.5`}>Bot Token</label>
          <div className="flex gap-2">
            <input type="password" value={telegramSettings.botToken} onChange={e => updateTelegramSettings({ botToken: e.target.value })} placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v..." className={`flex-1 px-4 py-2.5 rounded-xl border ${inputBg} font-mono text-sm`} />
            <button onClick={() => handleCopy(telegramSettings.botToken)} className={`px-3 rounded-xl ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-slate-100 hover:bg-slate-200'} transition`}>
              {copied ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} className={textSub} />}
            </button>
          </div>
        </div>
        <div>
          <label className={`block text-sm font-medium ${textSub} mb-1.5`}>Chat ID</label>
          <input value={telegramSettings.chatId} onChange={e => updateTelegramSettings({ chatId: e.target.value })} placeholder="-1001234567890" className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} font-mono text-sm`} />
        </div>
        <div>
          <label className={`block text-sm font-medium ${textSub} mb-1.5`}>Webhook URL</label>
          <input value={telegramSettings.webhookUrl} onChange={e => updateTelegramSettings({ webhookUrl: e.target.value })} placeholder="https://your-server.com/api/telegram/webhook" className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} font-mono text-sm`} />
        </div>
        <div className="flex gap-2">
          <button onClick={handleTestConnection} className="px-5 py-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition font-medium flex items-center gap-2">
            <Link size={16} /> Проверить подключение
          </button>
          {testResult === 'success' && <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium"><CheckCircle size={16} /> Успешно!</span>}
          {testResult === 'error' && <span className="flex items-center gap-1 text-red-500 text-sm font-medium"><AlertCircle size={16} /> Заполните токен и ID</span>}
        </div>
      </div>

      {/* Notification types */}
      <div className={`${cardBg} rounded-2xl p-5 shadow-sm border space-y-3`}>
        <h3 className={`font-semibold ${textMain} flex items-center gap-2`}><Send size={18} className="text-violet-500" /> Типы уведомлений</h3>
        {Object.entries(notifLabels).map(([key, label]) => (
          <label key={key} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-slate-50 hover:bg-slate-100'} transition cursor-pointer`}>
            <span className={`text-sm ${textMain}`}>{label}</span>
            <input
              type="checkbox"
              checked={(telegramSettings.notifications as Record<string, boolean>)[key]}
              onChange={e => updateTelegramSettings({ notifications: { ...telegramSettings.notifications, [key]: e.target.checked } })}
              className="w-4 h-4 accent-blue-500 rounded"
            />
          </label>
        ))}
      </div>

      {/* Instructions */}
      <div className={`${cardBg} rounded-2xl p-5 shadow-sm border space-y-3`}>
        <h3 className={`font-semibold ${textMain} flex items-center gap-2`}><ExternalLink size={18} className="text-amber-500" /> Инструкция по настройке</h3>
        <div className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
            <p className="font-medium mb-1">1. Создание бота</p>
            <p>Откройте <code className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-600' : 'bg-slate-200'} text-xs`}>@BotFather</code> в Telegram → <code className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-600' : 'bg-slate-200'} text-xs`}>/newbot</code> → введите имя → скопируйте токен</p>
          </div>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
            <p className="font-medium mb-1">2. Получение Chat ID</p>
            <p>Добавьте бота в группу → отправьте сообщение → откройте <code className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-600' : 'bg-slate-200'} text-xs`}>https://api.telegram.org/bot{'<TOKEN>'}/getUpdates</code></p>
          </div>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
            <p className="font-medium mb-1">3. Настройка Webhook</p>
            <p>Укажите URL вашего сервера для приёма обновлений. Бот будет отправлять уведомления о событиях в системе.</p>
          </div>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
            <p className="font-medium mb-1">4. Команды бота</p>
            <p><code className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-600' : 'bg-slate-200'} text-xs`}>/start</code> — начало работы</p>
            <p><code className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-600' : 'bg-slate-200'} text-xs`}>/status</code> — статус практики</p>
            <p><code className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-600' : 'bg-slate-200'} text-xs`}>/hours</code> — сводка часов</p>
            <p><code className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-600' : 'bg-slate-200'} text-xs`}>/tests</code> — список тестов</p>
            <p><code className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-600' : 'bg-slate-200'} text-xs`}>/grades</code> — мои оценки</p>
          </div>
        </div>
      </div>
    </div>
  );
}
