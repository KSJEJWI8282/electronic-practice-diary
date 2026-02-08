export type Language = 'ru' | 'kz' | 'en';

const translations: Record<string, Record<Language, string>> = {
  // App
  'app.name': { ru: 'ShoKnus', kz: 'ShoKnus', en: 'ShoKnus' },
  'app.subtitle': { ru: 'Электронный дневник практики', kz: 'Практиканың электрондық күнделігі', en: 'Electronic Practice Diary' },
  'app.version': { ru: 'Версия 3.0', kz: '3.0 нұсқасы', en: 'Version 3.0' },
  'app.copyright': { ru: '© 2025 ShoKnus — Электронный дневник практики студента', kz: '© 2025 ShoKnus — Студенттің практика күнделігі', en: '© 2025 PracticeOnline — Student Practice Diary' },

  // Auth
  'auth.login': { ru: 'Войти в систему', kz: 'Жүйеге кіру', en: 'Sign In' },
  'auth.logout': { ru: 'Выйти из системы', kz: 'Жүйеден шығу', en: 'Sign Out' },
  'auth.register': { ru: 'Регистрация', kz: 'Тіркелу', en: 'Register' },
  'auth.email': { ru: 'Электронная почта', kz: 'Электрондық пошта', en: 'Email' },
  'auth.password': { ru: 'Пароль', kz: 'Құпия сөз', en: 'Password' },
  'auth.confirmPassword': { ru: 'Подтвердите пароль', kz: 'Құпия сөзді растаңыз', en: 'Confirm Password' },
  'auth.fullName': { ru: 'ФИО', kz: 'Аты-жөні', en: 'Full Name' },
  'auth.group': { ru: 'Группа', kz: 'Топ', en: 'Group' },
  'auth.quickLogin': { ru: 'Быстрый вход', kz: 'Жылдам кіру', en: 'Quick Login' },
  'auth.byEmail': { ru: 'По email', kz: 'Email арқылы', en: 'By Email' },
  'auth.loginLoading': { ru: 'Входим...', kz: 'Кіруде...', en: 'Signing in...' },
  'auth.registerPending': { ru: 'Ваша заявка отправлена на одобрение', kz: 'Сіздің өтінішіңіз мақұлдауға жіберілді', en: 'Your request has been sent for approval' },
  'auth.selectRole': { ru: 'Выберите роль', kz: 'Рөлді таңдаңыз', en: 'Select Role' },

  // Roles
  'role.student': { ru: 'Студент', kz: 'Студент', en: 'Student' },
  'role.supervisor': { ru: 'Руководитель практики', kz: 'Практика жетекшісі', en: 'Practice Supervisor' },
  'role.teacher': { ru: 'Преподаватель', kz: 'Оқытушы', en: 'Teacher' },

  // Navigation
  'nav.dashboard': { ru: 'Главная', kz: 'Басты бет', en: 'Dashboard' },
  'nav.diary': { ru: 'Дневник практики', kz: 'Практика күнделігі', en: 'Practice Diary' },
  'nav.files': { ru: 'Отчёты и файлы', kz: 'Есептер мен файлдар', en: 'Reports & Files' },
  'nav.tests': { ru: 'Тесты', kz: 'Тесттер', en: 'Tests' },
  'nav.results': { ru: 'Мои результаты', kz: 'Менің нәтижелерім', en: 'My Results' },
  'nav.grades': { ru: 'Дневник оценок', kz: 'Бағалар күнделігі', en: 'Grade Book' },
  'nav.profile': { ru: 'Профиль', kz: 'Профиль', en: 'Profile' },
  'nav.students': { ru: 'Студенты', kz: 'Студенттер', en: 'Students' },
  'nav.review': { ru: 'Проверка дневников', kz: 'Күнделіктерді тексеру', en: 'Review Diaries' },
  'nav.studentFiles': { ru: 'Файлы студентов', kz: 'Студенттердің файлдары', en: 'Student Files' },
  'nav.confirm': { ru: 'Подтверждение часов', kz: 'Сағаттарды растау', en: 'Confirm Hours' },
  'nav.comments': { ru: 'Комментарии', kz: 'Пікірлер', en: 'Comments' },
  'nav.testResults': { ru: 'Результаты тестов', kz: 'Тест нәтижелері', en: 'Test Results' },
  'nav.activity': { ru: 'Журнал действий', kz: 'Әрекеттер журналы', en: 'Activity Log' },
  'nav.templates': { ru: 'Шаблоны тестов', kz: 'Тест үлгілері', en: 'Test Templates' },
  'nav.createTest': { ru: 'Создать тест', kz: 'Тест құру', en: 'Create Test' },
  'nav.assignTest': { ru: 'Назначить тест', kz: 'Тест тағайындау', en: 'Assign Test' },
  'nav.statistics': { ru: 'Статистика', kz: 'Статистика', en: 'Statistics' },
  'nav.telegram': { ru: 'Telegram бот', kz: 'Telegram бот', en: 'Telegram Bot' },
  'nav.approvals': { ru: 'Заявки на вход', kz: 'Кіру өтінімдері', en: 'Approval Requests' },

  // Common
  'common.save': { ru: 'Сохранить', kz: 'Сақтау', en: 'Save' },
  'common.cancel': { ru: 'Отмена', kz: 'Болдырмау', en: 'Cancel' },
  'common.delete': { ru: 'Удалить', kz: 'Жою', en: 'Delete' },
  'common.edit': { ru: 'Редактировать', kz: 'Өзгерту', en: 'Edit' },
  'common.add': { ru: 'Добавить', kz: 'Қосу', en: 'Add' },
  'common.search': { ru: 'Поиск...', kz: 'Іздеу...', en: 'Search...' },
  'common.all': { ru: 'Все', kz: 'Барлығы', en: 'All' },
  'common.hours': { ru: 'часов', kz: 'сағат', en: 'hours' },
  'common.confirmed': { ru: 'Подтверждено', kz: 'Расталды', en: 'Confirmed' },
  'common.pending': { ru: 'На проверке', kz: 'Тексеруде', en: 'Pending' },
  'common.noData': { ru: 'Данных пока нет', kz: 'Деректер жоқ', en: 'No data yet' },
  'common.lightTheme': { ru: 'Светлая тема', kz: 'Жарық тема', en: 'Light Theme' },
  'common.darkTheme': { ru: 'Тёмная тема', kz: 'Қараңғы тема', en: 'Dark Theme' },
  'common.notifications': { ru: 'Уведомления', kz: 'Хабарландырулар', en: 'Notifications' },
  'common.readAll': { ru: 'Прочитать все', kz: 'Барлығын оқу', en: 'Read All' },
  'common.welcome': { ru: 'Добро пожаловать', kz: 'Қош келдіңіз', en: 'Welcome' },
  'common.progress': { ru: 'Прогресс', kz: 'Прогресс', en: 'Progress' },
  'common.total': { ru: 'Всего', kz: 'Барлығы', en: 'Total' },
  'common.date': { ru: 'Дата', kz: 'Күні', en: 'Date' },
  'common.description': { ru: 'Описание', kz: 'Сипаттама', en: 'Description' },
  'common.status': { ru: 'Статус', kz: 'Мәртебе', en: 'Status' },
  'common.actions': { ru: 'Действия', kz: 'Әрекеттер', en: 'Actions' },
  'common.score': { ru: 'Балл', kz: 'Балл', en: 'Score' },

  // Grades
  'grades.title': { ru: 'Дневник оценок', kz: 'Бағалар күнделігі', en: 'Grade Book' },
  'grades.scale': { ru: '100-балльная шкала', kz: '100-балдық шкала', en: '100-point scale' },
  'grades.excellent': { ru: 'Отлично', kz: 'Өте жақсы', en: 'Excellent' },
  'grades.good': { ru: 'Хорошо', kz: 'Жақсы', en: 'Good' },
  'grades.satisfactory': { ru: 'Удовлетворительно', kz: 'Қанағаттанарлық', en: 'Satisfactory' },
  'grades.unsatisfactory': { ru: 'Неудовлетворительно', kz: 'Қанағаттанарлықсыз', en: 'Unsatisfactory' },

  // Telegram
  'telegram.title': { ru: 'Настройка Telegram бота', kz: 'Telegram ботын баптау', en: 'Telegram Bot Setup' },
  'telegram.enabled': { ru: 'Бот активирован', kz: 'Бот белсендірілді', en: 'Bot Enabled' },
  'telegram.token': { ru: 'Токен бота', kz: 'Бот токені', en: 'Bot Token' },
  'telegram.chatId': { ru: 'ID чата', kz: 'Чат ID', en: 'Chat ID' },
  'telegram.notifications': { ru: 'Уведомления', kz: 'Хабарландырулар', en: 'Notifications' },
  'telegram.testConnection': { ru: 'Проверить подключение', kz: 'Қосылымды тексеру', en: 'Test Connection' },
  'telegram.instructions': { ru: 'Инструкция по настройке', kz: 'Баптау нұсқаулығы', en: 'Setup Instructions' },
};

export function t(key: string, lang: Language = 'ru'): string {
  return translations[key]?.[lang] || translations[key]?.['ru'] || key;
}

export const languageNames: Record<Language, string> = {
  ru: 'Русский',
  kz: 'Қазақша',
  en: 'English',
};

export const languageFlags: Record<Language, string> = {
  ru: '🇷🇺',
  kz: '🇰🇿',
  en: '🇬🇧',
};
