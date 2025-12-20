document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guessInput');
    const checkButton = document.getElementById('checkButton');
    const resetButton = document.getElementById('resetButton');
    const message = document.getElementById('message');
    const cluesContainer = document.getElementById('clues');
    const langButton = document.getElementById('langButton');

    let randomNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    let gameWon = false;
    let currentLang = 'en'; // Дефолтный язык

    // Объект со всеми переводами
    const translations = {
        en: {
            gameTitle: "🎉 Guess The Number Game! 🎉",
            prompt: "Try to guess a number from 1 to 100!",
            placeholder: "Enter your guess...",
            checkButton: "✅ Check!",
            resetButton: "🔄 Reset Game",
            cluesTitle: "Clues:",
            achievementsTitle: "Your Achievements",
            achievement1Text: "Genius Guess: Guess the number in 1 attempt",
            achievement2Text: "Easy Peasy: Guess the number in less than 5 attempts",
            achievement3Text: "I Did It: Win for the first time",
            reportBugButton: "Report a bug",
            langToggle: "Рус", // Кнопка показывает "Рус", чтобы переключиться на русский
            tooHigh: "Your guess is too high!",
            tooLow: "Your guess is too low!",
            wonMessage: (number, attempts) => `🎉 Correct! You guessed the number ${number}. Attempts: ${attempts} 🎉`,
            alreadyWon: "You already won! Click Reset Game to play again.",
            invalidInput: "Please enter a valid number between 1 and 100.",
            clueLess: (num) => `1) The number is definitely less than ${num}`,
            clueMore: (num) => `1) The number is definitely more than ${num}`,
            clueSquare: (num) => `2) This number is closest to the square of ${num}`,
            clueEven: "4) This number is even",
            clueOdd: "4) This number is odd",
            cluePrime: "5) This number is prime",
            clueNotPrime: "5) This number is not prime",
            // Добавляй сюда все остальные сообщения
        },
        ru: {
            gameTitle: "🎉 Игра «Угадай число!» 🎉",
            prompt: "Попробуй угадать число от 1 до 100!",
            placeholder: "Введи число...",
            checkButton: "✅ Проверить!",
            resetButton: "🔄 Сбросить игру",
            cluesTitle: "Подсказки:",
            achievementsTitle: "Твои Достижения",
            achievement1Text: "Очень просто для гения: Угадать число с 1 раза",
            achievement2Text: "Это было просто: Угадать число до 5 попыток",
            achievement3Text: "Я сделал это: Угадать впервые",
            reportBugButton: "Сообщить о баге",
            langToggle: "Eng", // Кнопка показывает "Eng", чтобы переключиться на английский
            tooHigh: "Твое число слишком большое!",
            tooLow: "Твое число слишком маленькое!",
            wonMessage: (number, attempts) => `🎉 Верно! Ты угадал число ${number}. Количество попыток: ${attempts} 🎉`,
            alreadyWon: "Ты уже выиграл! Нажми Сбросить игру, чтобы начать заново.",
            invalidInput: "Пожалуйста, введи число от 1 до 100.",
            clueLess: (num) => `1) Число точно меньше ${num}`,
            clueMore: (num) => `1) Число точно больше ${num}`,
            clueSquare: (num) => `2) Это число ближе всего к квадрату числа ${num}`,
            clueEven: "4) Это число чётное",
            clueOdd: "4) Это число нечётное",
            cluePrime: "5) Это число простое",
            clueNotPrime: "5) Это число не простое",
            // Добавляй сюда все остальные сообщения
        }
    };

    // Функция для обновления всех текстов на странице
    function updateTexts() {
        document.getElementById('gameTitle').textContent = translations[currentLang].gameTitle;
        document.querySelector('h1[data-key="gameTitle"]').textContent = translations[currentLang].gameTitle; // Обновляем h1 тоже, если есть
        document.querySelector('p[data-key="prompt"]').textContent = translations[currentLang].prompt;
        guessInput.placeholder = translations[currentLang].placeholder;
        checkButton.textContent = translations[currentLang].checkButton;
        resetButton.textContent = translations[currentLang].resetButton;
        document.querySelector('p[data-key="cluesTitle"]').textContent = translations[currentLang].cluesTitle;
        document.querySelector('h2[data-key="achievementsTitle"]').textContent = translations[currentLang].achievementsTitle;
        document.querySelector('span[data-key="achievement1Text"]').textContent = translations[currentLang].achievement1Text;
        document.querySelector('span[data-key="achievement2Text"]').textContent = translations[currentLang].achievement2Text;
        document.querySelector('span[data-key="achievement3Text"]').textContent = translations[currentLang].achievement3Text;
        document.getElementById('reportBugButton').textContent = translations[currentLang].reportBugButton;
        langButton.textContent = translations[currentLang].langToggle;
        // ... и так далее для всех элементов, которые нужно переводить
    }

    // Обработчик для кнопки переключения языка
    langButton.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ru' : 'en';
        updateTexts();
        // При переключении языка, возможно, нужно обновить и сообщения, которые уже были показаны
        // Или сбросить игру, чтобы все сообщения были на новом языке
        resetGame(); // Сброс игры при смене языка для консистентности
    });

    // --- Остальная логика игры --- 

    function generateClues(targetNumber) {
        cluesContainer.innerHTML = ''; // Очищаем старые подсказки

        // Подсказка 1: Диапазон
        const rangeClue = Math.random() < 0.5
            ? translations[currentLang].clueLess(targetNumber + Math.floor(Math.random() * 10) + 1)
            : translations[currentLang].clueMore(targetNumber - Math.floor(Math.random() * 10) - 1);
        const clue1 = document.createElement('p');
        clue1.textContent = rangeClue;
        cluesContainer.appendChild(clue1);

        // Подсказка 2: Ближайший квадрат
        const squareRoot = Math.sqrt(targetNumber);
        const closestSquare = Math.round(squareRoot);
        const clue2 = document.createElement('p');
        clue2.textContent = translations[currentLang].clueSquare(closestSquare);
        cluesContainer.appendChild(clue2);

        // Подсказка 3: Четное/Нечетное
        const parityClue = targetNumber % 2 === 0
            ? translations[currentLang].clueEven
            : translations[currentLang].clueOdd;
        const clue3 = document.createElement('p');
        clue3.textContent = parityClue;
        cluesContainer.appendChild(clue3);

        // Подсказка 4: Простое/Составное
        function isPrime(num) {
            for (let i = 2, s = Math.sqrt(num); i <= s; i++)
                if (num % i === 0) return false;
            return num > 1;
        }
        const primeClue = isPrime(targetNumber)
            ? translations[currentLang].cluePrime
            : translations[currentLang].clueNotPrime;
        const clue4 = document.createElement('p');
        clue4.textContent = primeClue;
        cluesContainer.appendChild(clue4);

        // Дополнительная подсказка (пример)
        const clue5 = document.createElement('p');
        if (targetNumber % 5 === 0) {
            clue5.textContent = translations[currentLang].clueMore(targetNumber - 5); // Пример, если делится на 5
        } else {
            clue5.textContent = translations[currentLang].clueLess(targetNumber + 5); // Пример
        }
        cluesContainer.appendChild(clue5);
    }

    // Инициализация игры
    function initializeGame() {
        randomNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        gameWon = false;
        message.textContent = '';
        guessInput.value = '';
        cluesContainer.innerHTML = ''; // Очищаем подсказки
        generateClues(randomNumber); // Генерируем новые подсказки
        updateTexts(); // Обновляем тексты при инициализации
    }

    // Функция для сброса игры
    function resetGame() {
        initializeGame();
    }

    checkButton.addEventListener('click', () => {
        if (gameWon) {
            message.textContent = translations[currentLang].alreadyWon;
            return;
        }

        const userGuess = parseInt(guessInput.value);

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            message.textContent = translations[currentLang].invalidInput;
            return;
        }

        attempts++;

        if (userGuess === randomNumber) {
            message.textContent = translations[currentLang].wonMessage(randomNumber, attempts);
            gameWon = true;
            // Обновляем достижения
            if (attempts === 1) {
                document.getElementById('achievement1').querySelector('.icon').textContent = '✅';
            }
            if (attempts <= 5) {
                document.getElementById('achievement2').querySelector('.icon').textContent = '✅';
            }
            document.getElementById('achievement3').querySelector('.icon').textContent = '✅'; // Выиграл впервые
        } else if (userGuess < randomNumber) {
            message.textContent = translations[currentLang].tooLow;
        } else {
            message.textContent = translations[currentLang].tooHigh;
        }
        guessInput.value = ''; // Очищаем поле ввода
    });

    resetButton.addEventListener('click', resetGame);

    // Первая инициализация игры при загрузке страницы
    initializeGame();
});
