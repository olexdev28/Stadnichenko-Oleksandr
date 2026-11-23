const express = require('express')
require('dotenv').config()
const pool = require('./db')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/api/students', async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM students ORDER BY id ASC')
		res.json(result.rows)
	} catch (err) {
		console.error(err.message)
		res
			.status(500)
			.json({ error: 'Помилка сервера при отриманні списку студентів' })
	}
})

app.get('/api/students/:id', async (req, res) => {
	try {
		const { id } = req.params
		const result = await pool.query('SELECT * FROM students WHERE id = $1', [
			id,
		])

		if (result.rows.length === 0) {
			return res.status(404).json({ error: 'Студента не знайдено' })
		}

		res.json(result.rows[0])
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ error: 'Помилка сервера при пошуку студента' })
	}
})

app.post('/api/students', async (req, res) => {
	try {
		const { name, age, major } = req.body

		if (!name || !age || !major) {
			return res
				.status(400)
				.json({ error: 'Усі поля (name, age, major) є обов’язковими' })
		}

		const result = await pool.query(
			'INSERT INTO students (name, age, major) VALUES ($1, $2, $3) RETURNING *',
			[name, age, major],
		)

		res.status(201).json(result.rows[0])
	} catch (err) {
		console.error(err.message)
		res
			.status(500)
			.json({ error: 'Помилка сервера при створенні запису студента' })
	}
})

app.put('/api/students/:id', async (req, res) => {
	try {
		const { id } = req.params
		const { name, age, major } = req.body

		if (!name || !age || !major) {
			return res
				.status(400)
				.json({ error: 'Усі поля (name, age, major) є обов’язковими' })
		}

		const result = await pool.query(
			'UPDATE students SET name = $1, age = $2, major = $3 WHERE id = $4 RETURNING *',
			[name, age, major, id],
		)

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ error: 'Студента для оновлення не знайдено' })
		}

		res.json(result.rows[0])
	} catch (err) {
		console.error(err.message)
		res
			.status(500)
			.json({ error: 'Помилка сервера при оновленні даних студента' })
	}
})

app.delete('/api/students/:id', async (req, res) => {
	try {
		const { id } = req.params
		const result = await pool.query(
			'DELETE FROM students WHERE id = $1 RETURNING *',
			[id],
		)

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ error: 'Студента для видалення не знайдено' })
		}

		res.json({
			message: 'Студента успішно видалено',
			deletedStudent: result.rows[0],
		})
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ error: 'Помилка сервера при видаленні студента' })
	}
})

app.listen(PORT, () => {
	console.log(`Сервер запущено на http://localhost:${PORT}`)
})
