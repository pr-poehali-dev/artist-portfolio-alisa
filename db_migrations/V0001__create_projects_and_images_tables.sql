-- Создание таблицы проектов
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы фотографий проектов
CREATE TABLE IF NOT EXISTS project_images (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    image_url TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных данных проектов
INSERT INTO projects (title, description, cover_image_url) VALUES
('Розовое платье', 'Театральная постановка о женской судьбе и выборе. Минималистичные декорации подчеркивают внутренний мир героини.', '/placeholder.svg'),
('Лубянский Гримёр', 'Драматический спектакль о художнике в эпоху перемен. Контрастные цветовые решения передают атмосферу времени.', '/placeholder.svg'),
('Лавр', 'Постановка по роману Евгения Водолазкина. Аскетичные декорации создают средневековую атмосферу.', '/placeholder.svg'),
('Я убил царя', 'Историческая драма о выборе и ответственности. Символизм в каждой детали оформления.', '/placeholder.svg'),
('Эзоп', 'Философская притча о силе слова. Минималистичное пространство усиливает акцент на тексте.', '/placeholder.svg'),
('Преступление и Наказание', 'Классика Достоевского на современной сцене. Тёмные тона передают атмосферу романа.', '/placeholder.svg'),
('Оборванец', 'История о человеке на краю общества. Сценография отражает внутренний разлом героя.', '/placeholder.svg'),
('Король умирает', 'Пьеса Эжена Ионеско о финале жизни. Абсурдистская эстетика в каждой детали.', '/placeholder.svg'),
('У премьер министра мало друзей', 'Политическая драма с острым социальным подтекстом. Строгие линии подчеркивают тему власти.', '/placeholder.svg'),
('Ватутина', 'Спектакль о женщине-герое. Монументальность образов в декорациях.', '/placeholder.svg'),
('Долгарева', 'Современная драма о поиске себя. Лаконичные декорации оставляют пространство для эмоций.', '/placeholder.svg'),
('МХАТ - Сочи', 'Постановка для филиала МХАТа в Сочи. Легкость и воздушность южного города в оформлении.', '/placeholder.svg'),
('МХАТ - 36 часов', 'Интенсивная драма о критическом моменте. Динамичные декорации следуют за развитием действия.', '/placeholder.svg'),
('Выбор героя', 'Философская постановка о моральном выборе. Каждая деталь оформления несёт смысловую нагрузку.', '/placeholder.svg');

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_position ON project_images(project_id, position);