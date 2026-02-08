import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { t } from '../i18n';
import { User, Mail, Phone, Send, Shield, Save, Check, RotateCcw, Camera, Upload } from 'lucide-react';

export function ProfilePage() {
  const { user, theme, language, updateProfile } = useAuth();
  const { showToast } = useData();
  const [saved, setSaved] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [tgId, setTgId] = useState(user?.telegramId || '');
  const fileRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100';
  const textMain = isDark ? 'text-white' : 'text-slate-800';
  const textSub = isDark ? 'text-gray-400' : 'text-slate-400';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700';

  if (!user) return null;

  const roleLabels: Record<string, string> = { student: t('role.student', language), supervisor: t('role.supervisor', language), teacher: t('role.teacher', language) };
  const roleGradients: Record<string, string> = { student: 'from-blue-500 to-indigo-600', supervisor: 'from-emerald-500 to-teal-600', teacher: 'from-violet-500 to-purple-600' };

  const handleSave = () => {
    updateProfile({ phone, telegramId: tgId });
    setSaved(true);
    showToast('Профиль обновлён', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateProfile({ avatar: dataUrl });
      showToast('Аватар обновлён', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className={`${cardBg} rounded-2xl shadow-sm border overflow-hidden animate-fadeInUp`}>
        <div className={`h-28 bg-gradient-to-r ${roleGradients[user.role]} relative`}>
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="relative inline-block group">
            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${roleGradients[user.role]} flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 ${isDark ? 'border-gray-800' : 'border-white'} overflow-hidden`}>
              {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition opacity-0 group-hover:opacity-100">
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
          <h2 className={`text-xl font-bold ${textMain} mt-3`}>{user.name}</h2>
          <p className={textSub}>{roleLabels[user.role]}</p>
          {user.group && <p className={`text-sm ${textSub} mt-1`}>📚 {t('auth.group', language)}: {user.group}</p>}
          <p className={`text-xs ${textSub} mt-1`}>📅 {language === 'ru' ? 'В системе с' : language === 'kz' ? 'Жүйеде' : 'Since'}: {user.registeredDate}</p>
        </div>
      </div>

      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border animate-fadeIn`}>
        <h3 className={`font-semibold ${textMain} mb-4 flex items-center gap-2`}><User size={18} className="text-blue-500" /> {language === 'ru' ? 'Контактная информация' : language === 'kz' ? 'Байланыс ақпараты' : 'Contact Info'}</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${textSub} mb-1.5 flex items-center gap-2`}><Mail size={14} /> Email</label>
            <input value={user.email} readOnly className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} opacity-60 cursor-not-allowed`} />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textSub} mb-1.5 flex items-center gap-2`}><Phone size={14} /> {language === 'ru' ? 'Телефон' : language === 'kz' ? 'Телефон' : 'Phone'}</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (999) 000-00-00" className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none`} />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textSub} mb-1.5 flex items-center gap-2`}><Send size={14} /> Telegram</label>
            <input value={tgId} onChange={e => setTgId(e.target.value)} placeholder="@username" className={`w-full px-4 py-2.5 rounded-xl border ${inputBg} focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none`} />
          </div>
          <div>
            <label className={`block text-sm font-medium ${textSub} mb-2 flex items-center gap-2`}><Upload size={14} /> {language === 'ru' ? 'Аватар' : 'Avatar'}</label>
            <button onClick={() => fileRef.current?.click()} className={`px-4 py-2.5 rounded-xl border-2 border-dashed ${isDark ? 'border-gray-600 text-gray-400 hover:border-blue-500' : 'border-slate-200 text-slate-400 hover:border-blue-300'} transition text-sm flex items-center gap-2`}>
              <Camera size={16} /> {language === 'ru' ? 'Загрузить фото' : language === 'kz' ? 'Сурет жүктеу' : 'Upload photo'}
            </button>
          </div>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition font-medium text-sm flex items-center gap-2">
            {saved ? <><Check size={16} /> {language === 'ru' ? 'Сохранено!' : 'Saved!'}</> : <><Save size={16} /> {t('common.save', language)}</>}
          </button>
        </div>
      </div>

      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border animate-fadeIn`}>
        <h3 className={`font-semibold ${textMain} mb-4 flex items-center gap-2`}><Shield size={18} className="text-violet-500" /> {language === 'ru' ? 'Безопасность' : 'Security'}</h3>
        <div className="space-y-3">
          <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
            <p className={`text-sm font-medium ${textMain}`}>{language === 'ru' ? 'Роль в системе' : 'System Role'}</p>
            <p className={`text-xs ${textSub} mt-1`}>{roleLabels[user.role]}</p>
          </div>
          <button onClick={handleReset} className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-500 hover:bg-red-50'}`}>
            <RotateCcw size={16} /> {language === 'ru' ? 'Сбросить все данные' : 'Reset all data'}
          </button>
        </div>
      </div>
    </div>
  );
}
