window.onload = () => {
	const submit = document.querySelector('#submit')
	const resetBtn = document.querySelector('#reset')
	const resultDiv = document.querySelector('#result')
	const carbohydrateField = document.querySelector('#carbohydrate')
	const insulinDiv = document.querySelector('#insulin-div')
	const insulinField = document.querySelector('#insulin')
	const errorDiv = document.querySelector('#errorDiv')
	const XE = 12

	resetBtn &&
		resetBtn.addEventListener('click', () => {
			localStorage.removeItem('data')
			location.reload()
		})

	// Если в localStorage есть коэффицент инсулина то выведим его
	if (localStorage.getItem('data')) {
		const data = JSON.parse(localStorage.getItem('data'))
		const { result } = data
		insulinDiv.classList.add('hidden')

		resultDiv.textContent = result
	}

	// Посчитать
	if (submit) {
		errorDiv.classList.add('hidden')

		submit.addEventListener('click', (e) => {
			e.preventDefault()

			// if we have insulin in localStorage

			// if we dont have insulin in localStorage
			if (!localStorage.getItem('data')) {
				insulinField.classList.remove('hidden')

				if (carbohydrateField.value && insulinField.value) {
					calculateDataFirstTime()
				}
			} else {
				if (carbohydrateField.value) {
					calculateDataFields()
				} else {
					errorDiv.classList.remove('hidden')
				}
			}
		})

		const calculateDataFirstTime = () => {
			// Посчитаем наш инсулин
			const calculate = calculateInsulinHandler(carbohydrateField.value, insulinField.value)

			if (calculate) {
				const data = {
					carbohydrate: carbohydrateField.value,
					insulin: insulinField.value,
					result: calculate.toFixed(2),
				}

				localStorage.setItem('data', JSON.stringify(data))

				resultDiv.textContent = calculate

				carbohydrateField.value = ''
				insulinField.value = ''
				insulinField.classList.add('hidden')
			} else {
				// Обнулим поля формы
				carbohydrateField.value = ''
				insulinField.value = ''

				resultDiv.textContent = 'Что то пошло не так! Обратитесь в тех поддержку'
				insulinField.classList.remove('hidden')
			}
		}

		const calculateDataFields = () => {
			const calculate = calculateInsulinHandler(carbohydrateField.value)

			const ins = localStorage.getItem('data')

			const { insulin } = JSON.parse(ins)

			localStorage.setItem(
				'data',
				JSON.stringify({
					carbohydrate: carbohydrateField.value,
					insulin: insulin,
					result: calculate,
				})
			)

			// вывели результат
			resultDiv.textContent = calculate
			carbohydrateField.value = ''

			insulinField.classList.add('hidden')
			errorDiv.classList.add('hidden')
		}

		// калькулятор инсулина
		const calculateInsulinHandler = (carbohydrate, insulin) => {
			if (localStorage.getItem('data')) {
				const data = JSON.parse(localStorage.getItem('data'))
				return parseFloat((carbohydrate / XE) * data.insulin).toFixed(2)
			} else {
				return parseFloat((carbohydrate / XE) * insulin)
			}
		}
	}
}
