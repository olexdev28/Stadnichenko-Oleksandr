const express = require('express')
const { Pool } = require('pg')

const app = express()
const PORT = 3001

app.use(express.json())

const pool = new Pool({
	host: 'localhost',
	user: 'postgres',
	password: '3009',
	database: 'library',
	port: 3000,
})

pool.connect(err => {
	if (err) {
		console.error('Помилка підключення до бази даних:', err.stack)
	} else {
		console.log('Успішно підключено до PostgreSQL (база library)')
	}
})

app.post('/books', async (req, res) => {
	try {
		const { title, author, published_year } = req.body

		if (!title || !author || !published_year) {
			return res.status(400).json({
				error: 'Усі поля (title, author, published_year) є обов’язковими',
			})
		}

		const result = await pool.query(
			'INSERT INTO books (title, author, published_year) VALUES ($1, $2, $3) RETURNING *',
			[title, author, published_year],
		)

		res.status(201).json(result.rows[0])
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ error: 'Помилка сервера при додаванні книги' })
	}
})

app.get('/books', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM books ORDER BY id ASC')
		res.json(result.rows)
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ error: 'Помилка сервера при отриманні списку книг' })
	}
})

app.get('/books/:id', async (req, res) => {
	try {
		const { id } = req.params
		const result = await pool.query('SELECT * FROM books WHERE id = $1', [id])

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Книгу не знайдено' })
		}

		res.json(result.rows[0])
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ error: 'Помилка сервера при пошуку книги' })
	}
})

app.put('/books/:id', async (req, res) => {
	try {
		const { id } = req.params
		const { title, author, published_year } = req.body

		if (!title || !author || !published_year) {
			return res.status(400).json({
				error: 'Усі поля (title, author, published_year) є обов’язковими',
			})
		}

		const result = await pool.query(
			'UPDATE books SET title = $1, author = $2, published_year = $3 WHERE id = $4 RETURNING *',
			[title, author, published_year, id],
		)

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Книгу для оновлення не знайдено' })
		}

		res.json(result.rows[0])
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ error: 'Помилка сервера при оновленні книги' })
	}
})

app.delete('/books/:id', async (req, res) => {
	try {
		const { id } = req.params
		const result = await pool.query(
			'DELETE FROM books WHERE id = $1 RETURNING *',
			[id],
		)

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Книгу для видалення не знайдено' })
		}

		res.json({ message: 'Книгу успішно видалено', deletedBook: result.rows[0] })
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ error: 'Помилка сервера при видаленні книги' })
	}
})

app.listen(PORT, () => {
	console.log(`Сервер запущено на http://localhost:${PORT}`)
})
