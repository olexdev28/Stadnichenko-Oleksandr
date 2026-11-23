CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    published_year INTEGER NOT NULL
);

INSERT INTO books (title, author, published_year) VALUES
('Кобзар', 'Тарас Шевченко', 1840),
('Тіні забутих предків', 'Михайло Коцюбинський', 1911),
('Clean Code', 'Robert C. Martin', 2008),
('The Pragmatic Programmer', 'Andrew Hunt', 1999);