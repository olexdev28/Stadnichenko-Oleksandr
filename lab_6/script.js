// Отримуємо елементи з DOM
const background = document.getElementById('backgroundClr') // Заголовок
const colorInput = document.getElementById('colorInput') // Поле введення
const changeColorButton = document.getElementById('changeColor') // Кнопка

// Додаємо обробник події для кнопки
changeColorButton.addEventListener('click', function () {
	const newColor = colorInput.value.trim() // Отримуємо значення з поля та обрізаємо зайві пробіли

	if (newColor) {
		// Перевіряємо, чи введене значення не порожнє
		background.style.backgroundColor = newColor // Змінюємо колір заголовка
	}
})
