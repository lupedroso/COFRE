
// ELEMENTOS DO HTML

const guessInput = document.getElementById("guess");
const message = document.getElementById("message");
const attemptNumber = document.getElementById("attemptNumber");
const attemptText = document.getElementById("attemptText");
const attemptFill = document.getElementById("attemptFill");
const safe = document.getElementById("safe");
const safeCaption = document.getElementById("safeCaption");
const overview = document.getElementById("overview");
const gamePanel = document.querySelector(".game-panel");
const tryButton = document.getElementById("tryButton");

// VARIÁVEIS DO JOGO

let secretNumber;
let attempts;
let maxAttempts = 7;
let gameFinished;

// INICIAR O JOGO

function startGame() {

    // Gera um número aleatório entre 1 e 50
    secretNumber = Math.floor(Math.random() * 50) + 1;

    attempts = 0;
    gameFinished = false;

    guessInput.value = "";
    guessInput.disabled = false;
    tryButton.disabled = false;

    message.textContent = "Digite um número de 1 a 50 para começar.";
    message.className = "message";

    safe.classList.remove("open");

    safeCaption.innerHTML =
        '<span class="status-dot"></span> COFRE BLOQUEADO';

    overview.classList.remove("show");
    gamePanel.classList.remove("alert");

    updateAttempts();

    guessInput.focus();
}

// ATUALIZAR TENTATIVAS

function updateAttempts() {

    const remaining = maxAttempts - attempts;

    attemptNumber.textContent =
        String(attempts).padStart(2, "0") + " / 07";

    attemptText.textContent =
        remaining + (remaining === 1
            ? " tentativa disponível"
            : " tentativas disponíveis");

    attemptFill.style.width =
        (remaining / maxAttempts * 100) + "%";
}

// VERIFICAR SENHA

function checkPassword() {

    if (gameFinished) {
        return;
    }

    const guess = guessInput.value.trim();
    const number = Number(guess);

    // Verificar se o campo está vazio

    if (guess === "") {
        message.textContent = "Digite um número antes de tentar!";
        message.className = "message warning";
        return;
    }

    // Verificar se o número está entre 1 e 50

    if (!Number.isInteger(number) || number < 1 || number > 50) {
        message.textContent = "Digite somente números inteiros de 1 a 50!";
        message.className = "message error";
        guessInput.value = "";
        guessInput.focus();
        return;
    }

    // Contabilizar tentativa

    attempts++;
    updateAttempts();

    // SE ACERTAR

    if (number === secretNumber) {

        gameFinished = true;

        message.textContent = "Senha correta! Abrindo o cofre...";
        message.className = "message success";

        safe.classList.add("open");

        safeCaption.innerHTML =
            '<span class="status-dot"></span> COFRE DESBLOQUEADO';

        guessInput.disabled = true;
        tryButton.disabled = true;

        // Mostrar a caixa suspensa depois da animação

        setTimeout(() => {

            document.getElementById("resultAttempts").textContent =
                attempts;

            overview.classList.add("show");

        }, 1100);

        return;
    }

    // SE ERRAR

    if (number < secretNumber) {

        message.textContent = "A senha é maior!";
        message.className = "message warning";

    } else {

        message.textContent = "A senha é menor!";
        message.className = "message warning";

    }

    // ALERTA QUANDO RESTAREM APENAS 2 TENTATIVAS

    const remaining = maxAttempts - attempts;

    if (remaining === 2) {

        message.textContent += " ⚠ ATENÇÃO! Restam apenas 2 tentativas!";

        gamePanel.classList.remove("alert");

        // Reinicia a animação do alerta
        void gamePanel.offsetWidth;

        gamePanel.classList.add("alert");

    } else if (remaining === 1) {

        message.textContent += " ⚠ Última tentativa!";

    }

    // SE ESGOTAR AS 7 TENTATIVAS

    if (attempts >= maxAttempts) {

        gameFinished = true;

        message.textContent =
            "Você esgotou suas tentativas! A senha era " +
            secretNumber + ".";

        message.className = "message error";

        guessInput.disabled = true;
        tryButton.disabled = true;

        safeCaption.innerHTML =
            '<span class="status-dot"></span> ACESSO BLOQUEADO';

    }

    guessInput.value = "";

    if (!gameFinished) {
        guessInput.focus();
    }
}

// REINICIAR E GERAR OUTRA SENHA

function restartGame() {
    startGame();
}

// PERMITIR USAR A TECLA ENTER

guessInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        checkPassword();
    }

});

// COMEÇAR AUTOMATICAMENTE

startGame();
