// Element Selectors
const guessButton = document.querySelector("#guessButton");
const guessInput = document.querySelector("#guessInput");
const messageText = document.querySelector("#message");
const attemptsText = document.querySelector("#attempts");
const resetButton = document.querySelector("#resetButton");

// Variabelen
let randomNumber = Math.floor(Math.random() * 20) + 1;
console.log("Voor de developer: het getal is " + randomNumber);
let attempts = 0;

// ==========================================
// Logica Functies
// ==========================================

// Handelt een raadpoging af
const handleGuess = () => {
	// 1. Guard Clause: Controleer of het invoerveld leeg is
	if (guessInput.value === "") {
		messageText.textContent = "Voer eerst een getal in!";
		messageText.style.color = "orange";
		return; // Stop de functie direct
	}

	let userGuess = Number(guessInput.value);

	// 2. Guard Clause: Controleer of het getal tussen 1 en 20 ligt
	if (userGuess < 1 || userGuess > 20) {
		messageText.textContent = `Let op: Kies een getal tussen de 1 en 20! Jouw gok: ${userGuess}`;
		messageText.style.color = "orange";
		guessInput.value = "";
		return;
	}

	// Pogingen ophogen en tonen
	attempts = attempts + 1;
	attemptsText.textContent = `Aantal pogingen: ${attempts}`;

	// Evalueer de gok
	if (userGuess === randomNumber) {
		messageText.textContent = `Goed geraden! Het getal was ${randomNumber}.`;
		messageText.style.color = "green";
		resetButton.disabled = false;

		// Wacht 100ms zodat de browser de CSS-transitie kan starten en de knop focusbaar maakt
		setTimeout(() => {
			resetButton.focus();
		}, 100);
	} else if (userGuess > randomNumber) {
		messageText.textContent = `Jouw gok ${userGuess} was te hoog.`;
		messageText.style.color = "red";
	} else if (userGuess < randomNumber) {
		messageText.textContent = `Jouw gok ${userGuess} was te laag.`;
		messageText.style.color = "red";
	}

	// Maak het invoerveld weer leeg voor de volgende gok
	guessInput.value = "";
};

// Handelt het resetten van het spel af
const handleReset = () => {
	// 1. Een nieuw willekeurig getal bedenken
	randomNumber = Math.floor(Math.random() * 20) + 1;
	console.log("Nieuw potje! Het nieuwe getal is " + randomNumber);

	// 2. Aantal pogingen terug naar 0
	attempts = 0;
	attemptsText.textContent = "Aantal pogingen: 0";

	// 3. Tekstberichten leegmaken en invoerveld leegmaken
	messageText.textContent = "";
	guessInput.value = "";

	// 4. De reset knop weer uitschakelen voor het nieuwe potje
	resetButton.disabled = true;

	// 5. Direct de focus weer terugzetten op het invoerveld
	guessInput.focus();
};

// ==========================================
// Event Listeners (Koppeling)
// ==========================================

// Koppel de knoppen aan hun respectievelijke functies
guessButton.addEventListener("click", handleGuess);
resetButton.addEventListener("click", handleReset);

// Luister naar de 'Enter'-toets in het invoerveld om direct handleGuess aan te roepen
guessInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		handleGuess();
	}
});

// Regex (Regular Expression)
guessInput.addEventListener("input", () => {
	guessInput.value = guessInput.value.replace(/[^0-9]/g, "");
});
// Uitleg:
// De slashes /  / is een afbakening van de regex
// [0-9] betekent: "de range 0 tot en met 9"
// g staat voor: "global" (vervang alles, niet alleen de eerste)
// Het dakje ^ is een ontkenning (NOT)
// Dus [^0-9] betekent: "alles wat géén cijfer is"
