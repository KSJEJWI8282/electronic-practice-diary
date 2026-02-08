import type { User, Practice, DiaryEntry, UploadedFile, TestTemplate, AssignedTest, TestResult, Notification, ActivityLog, Grade, PendingRegistration } from './types';

export const users: User[] = [
  { id: '1', name: 'Иванов Алексей Петрович', role: 'student', group: 'ИС-922', email: 'ivanov@college.ru', phone: '+7 (999) 111-22-33', telegramId: '@ivanov_alex', registeredDate: '2024-09-01', approved: true },
  { id: '2', name: 'Петрова Мария Сергеевна', role: 'student', group: 'ИС-922', email: 'petrova@college.ru', phone: '+7 (999) 222-33-44', telegramId: '@petrova_m', registeredDate: '2024-09-01', approved: true },
  { id: '3', name: 'Сидоров Дмитрий Игоревич', role: 'student', group: 'ИС-923', email: 'sidorov@college.ru', phone: '+7 (999) 333-44-55', registeredDate: '2024-09-01', approved: true },
  { id: '6', name: 'Кузнецова Елена Андреевна', role: 'student', group: 'ИС-922', email: 'kuznetsova@college.ru', phone: '+7 (999) 444-55-66', registeredDate: '2024-09-01', approved: true },
  { id: '7', name: 'Васильев Никита Олегович', role: 'student', group: 'ИС-923', email: 'vasilev@college.ru', registeredDate: '2024-09-01', approved: true },
  { id: '4', name: 'Козлова Анна Владимировна', role: 'supervisor', email: 'kozlova@college.ru', phone: '+7 (999) 555-66-77', telegramId: '@kozlova_av', registeredDate: '2023-01-15', approved: true },
  { id: '5', name: 'Морозов Игорь Николаевич', role: 'teacher', email: 'morozov@college.ru', phone: '+7 (999) 666-77-88', telegramId: '@morozov_in', registeredDate: '2022-08-20', approved: true },
];

export const pendingRegistrations: PendingRegistration[] = [
  { id: 'pr1', name: 'Новиков Артём Игоревич', email: 'novikov@gmail.com', password: '123456', role: 'student', group: 'ИС-924', requestDate: '2025-09-10', status: 'pending' },
  { id: 'pr2', name: 'Фёдорова Светлана Юрьевна', email: 'fedorova@gmail.com', password: '123456', role: 'teacher', requestDate: '2025-09-12', status: 'pending' },
];

export const practices: Practice[] = [
  { id: 'p1', type: 'Учебная', title: 'Учебная практика (ознакомительная)', startDate: '2025-09-01', endDate: '2025-09-14', group: 'ИС-922', supervisorId: '4', status: 'active' },
  { id: 'p2', type: 'Производственная', title: 'Производственная практика (по профилю)', startDate: '2025-10-01', endDate: '2025-10-28', group: 'ИС-922', supervisorId: '4', status: 'upcoming' },
  { id: 'p3', type: 'Учебная', title: 'Учебная практика (IT-инфраструктура)', startDate: '2025-11-01', endDate: '2025-11-14', group: 'ИС-923', supervisorId: '4', status: 'active' },
  { id: 'p4', type: 'Преддипломная', title: 'Преддипломная практика', startDate: '2026-03-01', endDate: '2026-04-30', group: 'ИС-922', supervisorId: '4', status: 'upcoming' },
];

export const diaryEntries: DiaryEntry[] = [
  { id: 'd1', studentId: '1', practiceId: 'p1', date: '2025-09-01', description: 'Ознакомление с предприятием. Прохождение инструктажа по технике безопасности. Знакомство с рабочим местом и коллективом.', hours: 6, confirmed: true, comment: 'Хорошее начало! Продолжайте в том же духе.', rating: 5, createdAt: '2025-09-01T09:00:00' },
  { id: 'd2', studentId: '1', practiceId: 'p1', date: '2025-09-02', description: 'Изучение организационной структуры предприятия. Работа с документацией отдела. Настройка рабочего окружения.', hours: 8, confirmed: true, createdAt: '2025-09-02T09:00:00' },
  { id: 'd3', studentId: '1', practiceId: 'p1', date: '2025-09-03', description: 'Изучение информационных систем предприятия. Работа с базами данных. Анализ бизнес-процессов.', hours: 7, confirmed: false, createdAt: '2025-09-03T09:00:00' },
  { id: 'd4', studentId: '1', practiceId: 'p1', date: '2025-09-04', description: 'Разработка модуля отчётности. Тестирование функционала. Составление технической документации.', hours: 8, confirmed: false, createdAt: '2025-09-04T09:00:00' },
  { id: 'd5', studentId: '1', practiceId: 'p1', date: '2025-09-05', description: 'Оптимизация запросов к базе данных. Рефакторинг кода. Подготовка промежуточного отчёта.', hours: 6, confirmed: false, createdAt: '2025-09-05T09:00:00' },
  { id: 'd6', studentId: '2', practiceId: 'p1', date: '2025-09-01', description: 'Первый день практики. Инструктаж. Знакомство с наставником и командой разработки.', hours: 6, confirmed: true, comment: 'Отличный старт!', createdAt: '2025-09-01T09:00:00' },
  { id: 'd7', studentId: '2', practiceId: 'p1', date: '2025-09-02', description: 'Изучение стека технологий компании. Настройка IDE и системы контроля версий.', hours: 7, confirmed: true, createdAt: '2025-09-02T09:00:00' },
  { id: 'd8', studentId: '2', practiceId: 'p1', date: '2025-09-03', description: 'Работа с React и TypeScript. Создание компонентов пользовательского интерфейса.', hours: 8, confirmed: false, createdAt: '2025-09-03T09:00:00' },
  { id: 'd9', studentId: '3', practiceId: 'p3', date: '2025-11-01', description: 'Ознакомление с IT-инфраструктурой организации. Изучение сетевого оборудования.', hours: 6, confirmed: false, createdAt: '2025-11-01T09:00:00' },
  { id: 'd10', studentId: '3', practiceId: 'p3', date: '2025-11-02', description: 'Настройка виртуальных машин. Работа с VMware. Установка серверных ОС.', hours: 8, confirmed: false, createdAt: '2025-11-02T09:00:00' },
  { id: 'd11', studentId: '6', practiceId: 'p1', date: '2025-09-01', description: 'Ознакомление с рабочим местом. Получение доступа к системам предприятия.', hours: 6, confirmed: true, createdAt: '2025-09-01T09:00:00' },
  { id: 'd12', studentId: '6', practiceId: 'p1', date: '2025-09-02', description: 'Изучение корпоративной почты и системы документооборота. Работа с 1С.', hours: 7, confirmed: false, createdAt: '2025-09-02T09:00:00' },
];

export const uploadedFiles: UploadedFile[] = [
  { id: 'f1', studentId: '1', studentName: 'Иванов Алексей Петрович', practiceId: 'p1', name: 'Отчёт_неделя_1.pdf', type: 'application/pdf', uploadDate: '2025-09-07', size: '2.4 МБ', status: 'approved', reviewComment: 'Отчёт принят, хорошая работа.' },
  { id: 'f2', studentId: '1', studentName: 'Иванов Алексей Петрович', practiceId: 'p1', name: 'Скриншоты_работы.zip', type: 'application/zip', uploadDate: '2025-09-05', size: '15.1 МБ', status: 'reviewed' },
  { id: 'f3', studentId: '2', studentName: 'Петрова Мария Сергеевна', practiceId: 'p1', name: 'Дневник_практики.docx', type: 'application/docx', uploadDate: '2025-09-03', size: '1.8 МБ', status: 'pending' },
  { id: 'f4', studentId: '2', studentName: 'Петрова Мария Сергеевна', practiceId: 'p1', name: 'Презентация_проекта.pptx', type: 'application/pptx', uploadDate: '2025-09-06', size: '5.2 МБ', status: 'pending' },
  { id: 'f5', studentId: '3', studentName: 'Сидоров Дмитрий Игоревич', practiceId: 'p3', name: 'Схема_сети.png', type: 'image/png', uploadDate: '2025-11-02', size: '3.7 МБ', status: 'pending' },
  { id: 'f6', studentId: '6', studentName: 'Кузнецова Елена Андреевна', practiceId: 'p1', name: 'Итоговый_отчёт.pdf', type: 'application/pdf', uploadDate: '2025-09-10', size: '4.1 МБ', status: 'pending' },
];

export const testTemplates: TestTemplate[] = [
  {
    id: 't1', title: 'Охрана труда и техника безопасности', topic: 'Охрана труда',
    description: 'Базовый тест по правилам охраны труда и технике безопасности на рабочем месте',
    topicMaterial: '## Охрана труда и техника безопасности\n\n**Охрана труда** — система сохранения жизни и здоровья работников в процессе трудовой деятельности.\n\n### Основные понятия:\n- **Инструктаж** — обязательная процедура ознакомления работников с правилами безопасности\n- **СИЗ** — средства индивидуальной защиты\n- **Несчастный случай** — событие, произошедшее при выполнении трудовых обязанностей\n\n### Виды инструктажей:\n1. Вводный — при приёме на работу\n2. Первичный — на рабочем месте\n3. Повторный — не реже 1 раза в 6 месяцев\n4. Внеплановый — при изменении условий\n5. Целевой — при выполнении разовых работ\n\n### Правила работы за компьютером:\n- Расстояние от глаз до монитора: 50-70 см\n- Перерывы каждые 45-60 минут\n- Правильная осанка и положение рук\n- Освещение рабочего места\n\n### При пожаре:\n1. Сообщить руководителю\n2. Вызвать пожарную службу (101)\n3. Эвакуироваться по плану\n4. Не пользоваться лифтом',
    difficulty: 'easy', isTemplate: true, createdAt: '2025-01-15', timeLimit: 15, passingScore: 70,
    questions: [
      { id: 'q1', text: 'Что необходимо сделать в первую очередь при обнаружении пожара?', options: ['Начать тушить самостоятельно', 'Сообщить руководителю и вызвать пожарную службу', 'Покинуть здание не предупреждая никого', 'Продолжить работу'], correctAnswer: 1, explanation: 'При пожаре необходимо немедленно сообщить руководителю и вызвать пожарную службу по номеру 101.' },
      { id: 'q2', text: 'Как часто проводится повторный инструктаж по технике безопасности?', options: ['Раз в год', 'Не реже 1 раза в 6 месяцев', 'Только при приёме на работу', 'Каждый месяц'], correctAnswer: 1, explanation: 'Повторный инструктаж проводится не реже 1 раза в 6 месяцев.' },
      { id: 'q3', text: 'Что такое СИЗ?', options: ['Система информационной защиты', 'Средства индивидуальной защиты', 'Стандарт измерения загрязнений', 'Служба инженерной защиты'], correctAnswer: 1 },
      { id: 'q4', text: 'Какое минимальное расстояние от глаз до монитора рекомендуется?', options: ['20 см', '40 см', '50-70 см', '1 метр'], correctAnswer: 2 },
      { id: 'q5', text: 'Кто несёт ответственность за соблюдение правил охраны труда?', options: ['Только работодатель', 'Только работник', 'Работодатель и работник совместно', 'Профсоюз'], correctAnswer: 2 },
    ],
  },
  {
    id: 't2', title: 'Основы информационной безопасности', topic: 'Информационная безопасность',
    description: 'Тест по основам защиты информации и кибербезопасности',
    topicMaterial: '## Основы информационной безопасности\n\n**Информационная безопасность** — состояние защищённости информации от несанкционированного доступа.\n\n### Основные угрозы:\n- **Фишинг** — получение данных через поддельные сайты/письма\n- **Вирусы** — вредоносное ПО\n- **DDoS-атаки** — перегрузка серверов\n- **Социальная инженерия** — манипуляция людьми\n\n### Правила безопасности:\n1. Сложные пароли (от 12 символов, буквы + цифры + спецсимволы)\n2. Двухфакторная аутентификация (2FA)\n3. Обновление ПО\n4. Резервное копирование данных\n5. Использование HTTPS\n\n### Протоколы:\n- **HTTP** — незащищённый протокол (порт 80)\n- **HTTPS** — защищённый протокол с SSL/TLS (порт 443)\n- **SSH** — безопасный удалённый доступ (порт 22)\n\n### Шифрование:\n- Симметричное (AES) — один ключ\n- Асимметричное (RSA) — пара ключей\n- Хеширование (SHA, MD5) — необратимое преобразование',
    difficulty: 'medium', isTemplate: true, createdAt: '2025-01-20', timeLimit: 20, passingScore: 70,
    questions: [
      { id: 'q6', text: 'Что такое фишинг?', options: ['Вид компьютерного вируса', 'Метод социальной инженерии для получения конфиденциальных данных', 'Программа для шифрования данных', 'Антивирусное ПО'], correctAnswer: 1 },
      { id: 'q7', text: 'Какой пароль является наиболее надёжным?', options: ['123456', 'password', 'Qw3rTy!@#2024xZ', 'admin'], correctAnswer: 2 },
      { id: 'q8', text: 'Что такое двухфакторная аутентификация?', options: ['Два пароля', 'Подтверждение входа двумя разными способами', 'Два логина', 'Две попытки входа'], correctAnswer: 1 },
      { id: 'q9', text: 'Какой протокол обеспечивает безопасное соединение в браузере?', options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'], correctAnswer: 2 },
      { id: 'q10', text: 'Что такое бэкап?', options: ['Вирус', 'Резервное копирование данных', 'Удаление данных', 'Шифрование диска'], correctAnswer: 1 },
    ],
  },
  {
    id: 't3', title: 'Введение в профессию', topic: 'Введение в профессию',
    description: 'Тест на знание основ IT-профессий и компетенций специалиста по информационным системам',
    topicMaterial: '## Введение в профессию\n\n**Информационные системы и программирование** — направление подготовки специалистов в области IT.\n\n### Основные профессии:\n- Системный администратор\n- Программист (Frontend, Backend, Full-stack)\n- Тестировщик (QA)\n- Аналитик данных\n- Специалист по информационной безопасности\n\n### Ключевые технологии:\n- **Языки программирования**: Python, JavaScript, Java, C#\n- **Базы данных**: MySQL, PostgreSQL, MongoDB\n- **Web**: HTML, CSS, JavaScript, React, Angular\n- **IDE**: VS Code, IntelliJ IDEA, Visual Studio\n\n### Жизненный цикл ПО:\n1. Анализ требований\n2. Проектирование\n3. Разработка\n4. Тестирование\n5. Внедрение\n6. Сопровождение\n\n### Soft Skills:\n- Командная работа\n- Критическое мышление\n- Коммуникативные навыки\n- Самообучение',
    difficulty: 'easy', isTemplate: true, createdAt: '2025-02-01', timeLimit: 15, passingScore: 60,
    questions: [
      { id: 'q11', text: 'Что входит в обязанности системного администратора?', options: ['Только установка Windows', 'Обслуживание серверов, сетей и рабочих станций', 'Только ремонт принтеров', 'Разработка сайтов'], correctAnswer: 1 },
      { id: 'q12', text: 'Какой язык используется для разметки веб-страниц?', options: ['Python', 'HTML', 'C++', 'SQL'], correctAnswer: 1 },
      { id: 'q13', text: 'Что такое IDE?', options: ['Интернет-протокол', 'Интегрированная среда разработки', 'Система управления базами данных', 'Операционная система'], correctAnswer: 1 },
      { id: 'q14', text: 'Какой этап ЖЦПО идёт после анализа требований?', options: ['Тестирование', 'Проектирование', 'Внедрение', 'Сопровождение'], correctAnswer: 1 },
    ],
  },
  {
    id: 't4', title: 'Работа с документацией', topic: 'Документация',
    description: 'Тест по правилам ведения технической и проектной документации в IT',
    topicMaterial: '## Работа с документацией\n\n### Виды документации:\n- **Техническое задание (ТЗ)** — описание требований к системе\n- **Техническая документация** — описание архитектуры и кода\n- **Пользовательская документация** — руководства для конечных пользователей\n\n### Стандарты:\n- **ГОСТ 19** — Единая система программной документации (ЕСПД)\n- **ГОСТ 34** — Автоматизированные системы\n- **ISO 9001** — Система менеджмента качества\n\n### Инструменты:\n- README.md — описание проекта\n- Changelog — журнал изменений\n- Wiki — база знаний проекта\n- Swagger/OpenAPI — документация API\n\n### Хорошие практики:\n1. Документируй код комментариями\n2. Веди README актуальным\n3. Описывай API эндпоинты\n4. Создавай диаграммы архитектуры',
    difficulty: 'medium', isTemplate: true, createdAt: '2025-02-10', timeLimit: 20, passingScore: 70,
    questions: [
      { id: 'q15', text: 'Какой стандарт регламентирует оформление программной документации?', options: ['ГОСТ 19 (ЕСПД)', 'ГОСТ 34', 'ISO 9001', 'Все перечисленные'], correctAnswer: 0 },
      { id: 'q16', text: 'Что должно содержать техническое задание?', options: ['Только код программы', 'Требования к системе, сроки, описание функционала', 'Только дизайн-макеты', 'Резюме разработчика'], correctAnswer: 1 },
      { id: 'q17', text: 'Для чего нужен README файл в проекте?', options: ['Для хранения паролей', 'Для описания проекта и инструкций', 'Для конфигурации сервера', 'Для логирования ошибок'], correctAnswer: 1 },
      { id: 'q18', text: 'Что такое changelog?', options: ['Лог ошибок', 'Журнал изменений проекта', 'Файл конфигурации', 'База данных'], correctAnswer: 1 },
    ],
  },
  {
    id: 't5', title: 'Этика и коммуникации на практике', topic: 'Этика и коммуникации',
    description: 'Тест по профессиональной этике и навыкам делового общения',
    topicMaterial: '## Этика и коммуникации\n\n### Деловой этикет:\n- Обращение по имени-отчеству\n- Пунктуальность\n- Дресс-код\n- Конфиденциальность\n\n### Правила коммуникации:\n1. Уважительное общение\n2. Конструктивная обратная связь\n3. Активное слушание\n4. Чёткое изложение мыслей\n\n### При опоздании:\n- Предупредить руководителя заранее\n- Объяснить причину\n- Компенсировать время\n\n### Использование техники:\n- Рабочий компьютер — только для работы\n- Личные устройства — в перерывах с разрешения\n- Соблюдение политики ИБ компании',
    difficulty: 'easy', isTemplate: true, createdAt: '2025-02-15', timeLimit: 10, passingScore: 60,
    questions: [
      { id: 'q19', text: 'Как следует обращаться к руководителю практики?', options: ['По имени', 'По имени и отчеству', 'По фамилии', 'Как угодно'], correctAnswer: 1 },
      { id: 'q20', text: 'Что делать, если вы опаздываете на практику?', options: ['Не приходить вообще', 'Предупредить руководителя заранее', 'Прийти тихо и сесть', 'Написать в соцсетях'], correctAnswer: 1 },
      { id: 'q21', text: 'Можно ли использовать рабочий компьютер в личных целях?', options: ['Да, всегда', 'Нет, только для работы', 'Только в перерыв с разрешения', 'Только для соцсетей'], correctAnswer: 2 },
    ],
  },
  {
    id: 't6', title: 'Основы IT-инфраструктуры', topic: 'IT-инфраструктура',
    description: 'Тест по основам серверного оборудования, сетей и облачных технологий',
    topicMaterial: '## Основы IT-инфраструктуры\n\n### Сетевые понятия:\n- **IP-адрес** — уникальный идентификатор устройства в сети\n- **DNS** — система доменных имён\n- **DHCP** — автоматическая выдача IP\n- **VLAN** — виртуальная локальная сеть\n\n### Модель OSI (7 уровней):\n1. Физический\n2. Канальный\n3. **Сетевой** — маршрутизация (IP)\n4. Транспортный (TCP/UDP)\n5. Сеансовый\n6. Представления\n7. Прикладной (HTTP, FTP)\n\n### Порты:\n- 21 — FTP\n- 22 — SSH\n- 80 — HTTP\n- 443 — HTTPS\n- 3306 — MySQL\n\n### RAID:\n- **RAID 0** — чередование (скорость, нет отказоустойчивости)\n- **RAID 1** — зеркалирование (отказоустойчивость)\n- **RAID 5** — чередование с контролем чётности\n- **RAID 10** — комбинация RAID 1+0\n\n### Виртуализация:\n- VMware, Hyper-V, KVM\n- Docker — контейнеризация\n- Kubernetes — оркестрация контейнеров',
    difficulty: 'hard', isTemplate: true, createdAt: '2025-03-01', timeLimit: 25, passingScore: 75,
    questions: [
      { id: 'q22', text: 'Что такое VLAN?', options: ['Виртуальный сервер', 'Виртуальная локальная сеть', 'Протокол передачи данных', 'Тип кабеля'], correctAnswer: 1 },
      { id: 'q23', text: 'Какой порт по умолчанию использует HTTP?', options: ['21', '22', '80', '443'], correctAnswer: 2 },
      { id: 'q24', text: 'Что такое DNS?', options: ['Система доменных имён', 'Протокол безопасности', 'Файловая система', 'Тип базы данных'], correctAnswer: 0 },
      { id: 'q25', text: 'Какой уровень модели OSI отвечает за маршрутизацию?', options: ['Канальный', 'Сетевой', 'Транспортный', 'Прикладной'], correctAnswer: 1 },
      { id: 'q26', text: 'Что такое RAID 1?', options: ['Чередование дисков', 'Зеркалирование дисков', 'Объединение дисков', 'Шифрование дисков'], correctAnswer: 1 },
    ],
  },
  {
    id: 't7', title: 'Работа с ПО предприятия', topic: 'ПО предприятия',
    description: 'Тест по работе с корпоративным программным обеспечением',
    topicMaterial: '## Работа с ПО предприятия\n\n### Типы корпоративного ПО:\n- **ERP** — планирование ресурсов предприятия (1С, SAP)\n- **CRM** — управление взаимоотношениями с клиентами (Bitrix24, Salesforce)\n- **ECM/СЭД** — электронный документооборот\n- **BI** — бизнес-аналитика (Power BI, Tableau)\n\n### Система контроля версий:\n- **Git** — распределённая СКВ\n- GitHub, GitLab, Bitbucket — хостинг репозиториев\n- Основные команды: git clone, commit, push, pull, merge\n\n### Управление проектами:\n- **Jira** — система управления задачами\n- **Trello** — канбан-доски\n- **Confluence** — корпоративная wiki\n\n### Методологии:\n- Agile — гибкая разработка\n- Scrum — спринты и стендапы\n- Kanban — визуализация потока',
    difficulty: 'medium', isTemplate: true, createdAt: '2025-03-10', timeLimit: 20, passingScore: 70,
    questions: [
      { id: 'q27', text: 'Что такое ERP-система?', options: ['Антивирус', 'Система планирования ресурсов предприятия', 'Текстовый редактор', 'Операционная система'], correctAnswer: 1 },
      { id: 'q28', text: 'Для чего используется CRM-система?', options: ['Для управления серверами', 'Для управления взаимоотношениями с клиентами', 'Для разработки ПО', 'Для бухгалтерского учёта'], correctAnswer: 1 },
      { id: 'q29', text: 'Что такое система контроля версий?', options: ['Антивирус', 'Инструмент для отслеживания изменений в коде', 'Файловый менеджер', 'Браузер'], correctAnswer: 1 },
      { id: 'q30', text: 'Какая программа является системой управления проектами?', options: ['Photoshop', 'Excel', 'Jira', 'Блокнот'], correctAnswer: 2 },
    ],
  },
];

export const assignedTests: AssignedTest[] = [
  { id: 'at1', templateId: 't1', title: 'Охрана труда — ИС-922', topic: 'Охрана труда', topicMaterial: testTemplates[0].topicMaterial, difficulty: 'easy', questions: testTemplates[0].questions, assignedTo: 'ИС-922', assignedBy: '5', assignedDate: '2025-09-01', deadline: '2025-09-07', timeLimit: 15, passingScore: 70 },
  { id: 'at2', templateId: 't2', title: 'Информационная безопасность — ИС-922', topic: 'Информационная безопасность', topicMaterial: testTemplates[1].topicMaterial, difficulty: 'medium', questions: testTemplates[1].questions, assignedTo: 'ИС-922', assignedBy: '5', assignedDate: '2025-09-05', deadline: '2025-09-14', timeLimit: 20, passingScore: 70 },
  { id: 'at3', templateId: 't6', title: 'IT-инфраструктура — ИС-923', topic: 'IT-инфраструктура', topicMaterial: testTemplates[5].topicMaterial, difficulty: 'hard', questions: testTemplates[5].questions, assignedTo: 'ИС-923', assignedBy: '5', assignedDate: '2025-11-01', deadline: '2025-11-10', timeLimit: 25, passingScore: 75 },
];

export const testResults: TestResult[] = [
  { id: 'tr1', testId: 'at1', studentId: '1', studentName: 'Иванов Алексей Петрович', score: 4, totalQuestions: 5, completedDate: '2025-09-03', answers: [1, 1, 1, 2, 0], timeSpent: 8 },
  { id: 'tr2', testId: 'at1', studentId: '2', studentName: 'Петрова Мария Сергеевна', score: 5, totalQuestions: 5, completedDate: '2025-09-02', answers: [1, 1, 1, 2, 2], timeSpent: 12 },
  { id: 'tr3', testId: 'at1', studentId: '6', studentName: 'Кузнецова Елена Андреевна', score: 3, totalQuestions: 5, completedDate: '2025-09-04', answers: [1, 0, 1, 2, 0], timeSpent: 10 },
  { id: 'tr4', testId: 'at2', studentId: '1', studentName: 'Иванов Алексей Петрович', score: 4, totalQuestions: 5, completedDate: '2025-09-10', answers: [1, 2, 1, 2, 1], timeSpent: 15 },
];

export const initialGrades: Grade[] = [
  { id: 'g1', studentId: '1', category: 'Практика', subcategory: 'Дневник практики', score: 85, maxScore: 100, date: '2025-09-07', comment: 'Хорошее ведение дневника', givenBy: '4' },
  { id: 'g2', studentId: '1', category: 'Тесты', subcategory: 'Охрана труда', score: 80, maxScore: 100, date: '2025-09-03', givenBy: '5' },
  { id: 'g3', studentId: '1', category: 'Тесты', subcategory: 'Информационная безопасность', score: 80, maxScore: 100, date: '2025-09-10', givenBy: '5' },
  { id: 'g4', studentId: '1', category: 'Практика', subcategory: 'Отчётность', score: 90, maxScore: 100, date: '2025-09-07', comment: 'Отличный отчёт', givenBy: '4' },
  { id: 'g5', studentId: '2', category: 'Тесты', subcategory: 'Охрана труда', score: 100, maxScore: 100, date: '2025-09-02', givenBy: '5' },
  { id: 'g6', studentId: '2', category: 'Практика', subcategory: 'Дневник практики', score: 92, maxScore: 100, date: '2025-09-05', givenBy: '4' },
  { id: 'g7', studentId: '6', category: 'Тесты', subcategory: 'Охрана труда', score: 60, maxScore: 100, date: '2025-09-04', givenBy: '5' },
  { id: 'g8', studentId: '3', category: 'Практика', subcategory: 'Дневник практики', score: 75, maxScore: 100, date: '2025-11-03', givenBy: '4' },
];

export const initialNotifications: Notification[] = [
  { id: 'n1', userId: '1', title: 'Часы подтверждены', message: 'Руководитель подтвердил 6 часов за 01.09.2025', type: 'success', read: false, createdAt: '2025-09-02T10:00:00' },
  { id: 'n2', userId: '1', title: 'Новый комментарий', message: 'Козлова А.В. оставила комментарий к записи от 01.09', type: 'info', read: false, createdAt: '2025-09-02T11:00:00' },
  { id: 'n3', userId: '1', title: 'Назначен тест', message: 'Вам назначен тест "Охрана труда — ИС-21"', type: 'warning', read: true, createdAt: '2025-09-01T12:00:00' },
  { id: 'n4', userId: '4', title: 'Новая запись', message: 'Иванов А.П. добавил запись в дневник за 05.09', type: 'info', read: false, createdAt: '2025-09-05T09:30:00' },
  { id: 'n5', userId: '4', title: 'Загружен файл', message: 'Петрова М.С. загрузила "Презентация_проекта.pptx"', type: 'info', read: false, createdAt: '2025-09-06T14:00:00' },
  { id: 'n6', userId: '5', title: 'Тест пройден', message: 'Иванов А.П. прошёл тест "Охрана труда" — 80%', type: 'success', read: false, createdAt: '2025-09-03T16:00:00' },
  { id: 'n7', userId: '4', title: 'Заявка на регистрацию', message: 'Новиков А.И. запросил доступ к системе (студент)', type: 'warning', read: false, createdAt: '2025-09-10T08:00:00' },
  { id: 'n8', userId: '5', title: 'Новая оценка', message: 'Козлова А.В. поставила оценку 85/100 студенту Иванов А.П.', type: 'info', read: false, createdAt: '2025-09-07T15:00:00' },
];

export const initialActivityLog: ActivityLog[] = [
  { id: 'a1', userId: '1', userName: 'Иванов А.П.', action: 'Добавил запись', details: 'Дневник практики, 05.09.2025', timestamp: '2025-09-05T09:30:00', type: 'diary' },
  { id: 'a2', userId: '1', userName: 'Иванов А.П.', action: 'Загрузил файл', details: 'Отчёт_неделя_1.pdf', timestamp: '2025-09-07T10:00:00', type: 'file' },
  { id: 'a3', userId: '4', userName: 'Козлова А.В.', action: 'Подтвердила часы', details: 'Иванов А.П., 01.09.2025 — 6ч', timestamp: '2025-09-02T10:00:00', type: 'diary' },
  { id: 'a4', userId: '1', userName: 'Иванов А.П.', action: 'Прошёл тест', details: 'Охрана труда — 80%', timestamp: '2025-09-03T16:00:00', type: 'test' },
  { id: 'a5', userId: '5', userName: 'Морозов И.Н.', action: 'Назначил тест', details: 'Информационная безопасность → ИС-922', timestamp: '2025-09-05T08:00:00', type: 'test' },
  { id: 'a6', userId: '2', userName: 'Петрова М.С.', action: 'Загрузила файл', details: 'Презентация_проекта.pptx', timestamp: '2025-09-06T14:00:00', type: 'file' },
  { id: 'a7', userId: '4', userName: 'Козлова А.В.', action: 'Оставила комментарий', details: 'К записи Иванова А.П. от 01.09', timestamp: '2025-09-02T11:00:00', type: 'comment' },
  { id: 'a8', userId: '4', userName: 'Козлова А.В.', action: 'Поставила оценку', details: 'Иванов А.П. — 85/100 (Дневник)', timestamp: '2025-09-07T15:00:00', type: 'grade' },
];
