
const card = document.getElementById("card");
const progressFill = document.getElementById("progressFill");

const TELEGRAM_SERVER = "https://our-little-adventure.alecsey96bel.workers.dev/";

let currentQuestion = 0;
let invitationPointerHandler = null;
async function sendTelegramNotification(answer) {
    try {
        const response = await fetch(TELEGRAM_SERVER, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                answer: answer
            })
        });

        if (!response.ok) {
            console.error("Ошибка отправки уведомления:", response.status);
        } else {
            console.log("Уведомление отправлено!");
        }

    } catch (error) {
        console.error("Не удалось отправить уведомление:", error);
    }
}
const questions = [
    {
        title: "Веришь в новогодние чудеса? ✨",
        text: "Говорят, желания, загаданные под Новый год, иногда сбываются. А ты уже загадала своё?",
        answers: ["Конечно! 🎄", "Ещё не придумала"]
    },
    {
        title: "Как насчёт маленького приключения? 💗",
        text: "Как тебе идея в новом году попробовать что-нибудь необычное и получить новые впечатления?",
        answers: ["Я только за! ❤️", "Звучит заманчиво 👀"]
    },
    {
        title: "Что ценишь в хороших моментах?",
        text: "Когда всё спонтанно или когда заранее продумано до мелочей?",
        answers: ["Люблю спонтанность!", "Когда всё запланировано 😊"]
    },
    {
        title: "И последний вопрос... 🥰",
        text: "Как думаешь, иногда самые приятные воспоминания начинаются с неожиданного предложения?",
        answers: ["Определённо! ❤️", "Возможно... 🙈"]
    }
];

// Начало приключения

document.getElementById("startButton").addEventListener("click", () => {
    currentQuestion = 0;
    showQuestion();
});

// Показ вопроса

function showQuestion() {
    const question = questions[currentQuestion];

    card.classList.add("changing");

    setTimeout(() => {
        card.innerHTML = `
            <div class="step-label">
                ВОПРОС ${currentQuestion + 1} / ${questions.length}
            </div>

            <div class="emoji">💗</div>

            <h1>${question.title}</h1>

            <p>${question.text}</p>

            <div class="answers">
                <button class="answer-btn" id="answer1">
                    ${question.answers[0]}
                </button>

                <button class="answer-btn secondary" id="answer2">
                    ${question.answers[1]}
                </button>
            </div>
        `;

        card.classList.remove("changing");

        progressFill.style.width =
            ((currentQuestion + 1) / (questions.length + 1) * 100) + "%";

        document.getElementById("answer1").addEventListener("click", nextQuestion);
        document.getElementById("answer2").addEventListener("click", nextQuestion);

    }, 250);
}

// Следующий вопрос

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showGreeting();
    }
}

// Новогоднее поздравление


function showGreeting() {
    card.innerHTML = `
        <div class="emoji">🎄</div>

        <div class="step-label">С Новым годом! ❤️</div>

        <h1>С праздником! ✨</h1>

        <p>
            С Новым годом! Пусть этот год станет для тебя
            по-настоящему особенным, светлым и добрым.
            От всей души желаю, чтобы в новом году
            сложилось всё, о чём ты давно мечтала.
        </p>

        <p>
            Особо хочу пожелать тебе удачи в делах и поисках себя.
            Пусть обязательно попадётся именно та работа,
            которая будет по душе — где тебя будут ценить,
            уважать и поддерживать, где задачи будут приносить
            искренний интерес, а не усталость, и где твой труд
            будет достойно вознаграждаться.
            Пусть у тебя всегда хватает энергии и вдохновения
            на то, что действительно зажигает глаза.
        </p>

        <p>
            Желаю тебе крепкого здоровья, душевного тепла
            и уюта в доме. Пусть рядом всегда будут надёжные,
            близкие люди, с которыми можно разделить и радость
            побед, и тихие вечерние разговоры.
            Пусть каждый месяц нового года приносит хорошие
            новости, приятные сюрпризы, новые поводы для гордости
            за себя и ощущение, что ты находишься именно там,
            где должна быть.
            Счастья тебе, гармонии и исполнения самых
            заветных желаний!
        </p>

        <button id="greetingButton">
            А теперь кое-что ещё... 👀
        </button>
    `;

    progressFill.style.width = "85%";

    document.getElementById("greetingButton").addEventListener("click", showInvitation);
}


// Приглашение с убегающей кнопкой

function showInvitation() {

    card.innerHTML = `
        <div class="emoji">❤️</div>

        <div class="step-label">Особенное приглашение</div>

        <h1>Пойдём гулять?</h1>

        <p>
            Я хотел бы пригласить тебя на небольшое зимнее приключение.

            Сначала предлагаю сходить вместе на каток,
            а после отправиться вкусно поесть азиатской еды.

            А вот куда именно мы отправимся...
            пусть пока останется маленьким секретом. 🤫
        </p>

        <p>Согласишься провести этот день со мной? 🥺</p>

        <div class="answers" id="invitationAnswers">
            <button class="answer-btn" id="yesButton">Да! ❤️</button>
            <button class="answer-btn secondary" id="noButton">Нет 🙈</button>
        </div>
    `;

    progressFill.style.width = "95%";

    document.getElementById("yesButton").addEventListener("click", () => {
    sendTelegramNotification("Да! ❤️");
    showFinal();
});

    const noButton = document.getElementById("noButton");
    const answers = document.getElementById("invitationAnswers");

    let lastMouseX = -1000;
    let lastMouseY = -1000;

    // Убираем старый обработчик, если он остался

    if (invitationPointerHandler) {
        document.removeEventListener("pointermove", invitationPointerHandler);
    }

    // Перемещение кнопки

    function escapeButton() {
        const area = answers.getBoundingClientRect();
        const button = noButton.getBoundingClientRect();

        const maxX = Math.max(0, area.width - button.width);
        const maxY = Math.max(0, area.height - button.height);

        let bestX = 0;
        let bestY = 0;
        let bestDistance = -1;

        // Выбираем самое далёкое положение

        for (let i = 0; i < 200; i++) {
            const x = Math.random() * maxX;
            const y = Math.random() * maxY;

            const centerX = area.left + x + button.width / 2;
            const centerY = area.top + y + button.height / 2;

            const distance = Math.hypot(
                centerX - lastMouseX,
                centerY - lastMouseY
            );

            if (distance > bestDistance) {
                bestDistance = distance;
                bestX = x;
                bestY = y;
            }
        }

        noButton.style.position = "absolute";
        noButton.style.left = bestX + "px";
        noButton.style.top = bestY + "px";
    }

    // Убегает при приближении курсора

    invitationPointerHandler = (event) => {
        if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
            return;
        }

        lastMouseX = event.clientX;
        lastMouseY = event.clientY;

        const button = noButton.getBoundingClientRect();

        const distance = Math.hypot(
            event.clientX - (button.left + button.width / 2),
            event.clientY - (button.top + button.height / 2)
        );

        if (distance < 190) {
            escapeButton();
        }
    };

    document.addEventListener("pointermove", invitationPointerHandler);

    // Убегает при наведении

    noButton.addEventListener("pointerenter", (event) => {
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        escapeButton();
    });

    // Убегает при попытке прикосновения

    noButton.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        escapeButton();
    });

    // Дополнительная защита от нажатия

    noButton.addEventListener("click", (event) => {
    event.preventDefault();

    sendTelegramNotification("Нет 🙈");

    escapeButton();
});
}

// Финальный экран после согласия

function showFinal() {

    // Отключаем слежение за курсором

    if (invitationPointerHandler) {
        document.removeEventListener("pointermove", invitationPointerHandler);
        invitationPointerHandler = null;
    }

    card.classList.add("changing");

    setTimeout(() => {

        card.innerHTML = `
            <div class="emoji">🥰</div>

            <div class="step-label">
                ДОГОВОРИЛИСЬ!
            </div>

            <h1>УРААА! ❤️</h1>

            <p>
                Кажется, этот год начинается
                очень даже хорошо!

                <br><br>

                Тогда договорились!
                Нас ждёт каток, вкусная азиатская еда
                и маленькое приключение.

                <br><br>

                Осталось дождаться нашей встречи.
                А место пока останется секретом... 🤫
            </p>

            <div class="emoji">⛸️🍜❤️</div>

            <h2 style="color: #ff9ac4;">
                До скорой встречи! 💗
            </h2>
        `;

        card.classList.remove("changing");
        progressFill.style.width = "100%";

    }, 250);
}
