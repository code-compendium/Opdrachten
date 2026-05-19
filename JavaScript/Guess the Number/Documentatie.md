# Coding Compendium: Guess the Number

## Professioneel Naslagwerk & Leerpunten

Dit document dient als naslagwerk voor de geavanceerde technieken en concepten die we hebben behandeld en geïmplementeerd tijdens de optimalisatie van het spel **Guess the Number**. We zijn hierbij diep ingegaan op browser-rendering, code-architectuur, toegankelijkheid (UX) en invoerbeveiliging.

## 1. Performance & Layout Stabiliteit (Reflow vs Repaint)

Een vloeiende gebruikerservaring (UX) valt of staat met hoe de browser de pagina opbouwt. We hebben hier gekeken naar twee belangrijke processen in de browser: **Reflow** (lay-out berekenen) en **Repaint** (kleuren en pixels tekenen).

### Het probleem met `display: none`

Als je een element verbergt met `display: none`, haal je het volledig uit de lay-out-boom van de browser. Zodra je het toont, dwing je de browser tot een complete **Reflow** (de browser moet opnieuw berekenen waar _elk_ element op het scherm moet staan) en vervolgens een **Repaint**. Dit is relatief zwaar en kan schokken veroorzaken.

### Oplossing 1: De Symmetrische Grid-methode (0% Reflows)

Om de 'Raad'-knop perfect gecentreerd te houden en de 'Opnieuw'-knop er vloeiend naast te laten glijden, hebben we een slimme CSS Grid-lay-out opgezet:

```css
.button-container {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
}

.button-container::before {
	content: "";
	display: block;
}
```

- **Hoe het werkt:**
  1. De linkerkolom is een leeg CSS pseudo-element (`::before`) met een flexibele breedte van `1fr`.
  2. De middelste kolom is exact zo breed als de 'Raad'-knop (`auto`).
  3. De rechterkolom is de 'Opnieuw'-knop met een flexibele breedte van `1fr`.
  4. Omdat de linker- en rechterkolom allebei exact `1fr` breed zijn, wordt de 'Raad'-knop **altijd perfect in het midden** gehouden!
- **Waarom dit performant is:** De lay-out van de kolommen verandert nooit. De 'Opnieuw'-knop verschijnt en verdwijnt puur op basis van `opacity`, `visibility` en `transform`. Deze eigenschappen worden direct door de videokaart (GPU) berekend (Compositing). Dit kost de browser **0% Reflows**.

### Oplossing 2: Vaste breedte voor de container

Wanneer de melding "Goed geraden!" of "Het getal is te laag" in het `<p id="message">` element verschijnt, verandert de hoogte van dit element van `0px` naar de teksthoogte. Dit duwt de rest van de pagina naar beneden (verticale layout shift).

We hebben dit opgelost door:

1. De `.container` een stabiele, vaste responsive breedte te geven via `width: clamp(20rem, 75%, 50rem)` (of `max-width`).
2. Ruimte te reserveren voor de tekst in CSS, zelfs als er nog geen tekst staat:
   ```css
   #message {
   	min-height: 1.5em; /* Reserveert altijd exact 1 regel hoogte */
   	margin-top: 1rem;
   }
   ```

---

## 2. Keyboard & Focus-beheer (De Event Loop)

Een goede web-app moet volledig met het toetsenbord te besturen zijn. We wilden dat de speler na het indrukken van "Opnieuw" direct weer kon typen.

### De Focus Race Condition

Toen we probeerden de 'Opnieuw'-knop te focussen zodra de speler won, liepen we tegen een browser-quirk aan: de knop bleef onzichtbaar.

- **De Oorzaak:** JavaScript is _single-threaded_ en voert code synchroon uit. Toen we direct na `resetButton.disabled = false;` de functie `resetButton.focus()` aanriepen, had de browser de CSS-transitie (`visibility` en `opacity`) nog niet verwerkt. Voor de browser was de knop nog onzichtbaar, waardoor de `.focus()`-aanroep werd geweigerd.
- **De Oplossing (De Event Loop omzeilen):**
  Door een minimale vertraging in te bouwen met `setTimeout`, tillen we de `.focus()`-actie over de huidige berekeningsronde van de browser heen:
  ```javascript
  setTimeout(() => {
  	resetButton.focus();
  }, 100);
  ```
  Tegen de tijd dat die 100 milliseconden voorbij zijn, is de browser klaar met de layout-berekening, is de knop technisch "zichtbaar" en accepteert hij de focus vlekkeloos.

---

## 3. Input Beveiliging & Regex (Regular Expressions)

Gebruikers kunnen fouten maken. Het is de taak van de ontwikkelaar om het invoerveld zo te beveiligen dat er alleen geldige gegevens ingevoerd kunnen worden.

### Het probleem met `<input type="number">`

Hoewel `type="number"` logisch klinkt, respecteren browsers de `maxlength` attribuut hierop niet. Bovendien kunnen gebruikers tekens zoals `-`, `+`, `e` en decimalen typen.

### De Moderne Oplossing

We hebben de input veranderd naar `type="text"` met `inputmode="numeric"`.

- **`type="text"`** zorgt ervoor dat `maxlength="2"` perfect wordt gerespecteerd.
- **`inputmode="numeric"`** zorgt ervoor dat mobiele apparaten nog steeds het numerieke toetsenbord tonen.

Vervolgens hebben we een `input` listener toegevoegd die bij elke toetsaanslag direct alle niet-numerieke tekens wegfiltert via een **Regular Expression (Regex)**:

```javascript
guessInput.addEventListener("input", () => {
	guessInput.value = guessInput.value.replace(/[^0-9]/g, "");
});
```

### Regex Ontleding: `/[^0-9]/g`

| Onderdeel | Naam                | Betekenis                                                          |
| :-------- | :------------------ | :----------------------------------------------------------------- |
| `/ ... /` | **Slashes**         | De afbakening van de Regex (zoals quotes bij een string).          |
| `[ ... ]` | **Karakterset**     | Zoek naar één karakter dat binnen deze groep valt.                 |
| `0-9`     | **Bereik**          | Alle cijfers van 0 tot en met 9.                                   |
| `^`       | **Dakje (Negatie)** | Betekent **NOT** (alleen als het vooraan staat in `[...]`).        |
| `[^0-9]`  | **Gekoppeld**       | Zoek naar alles wat **GÉÉN** cijfer is (letters, spaties, tekens). |
| `g`       | **Global Flag**     | Zoek door de _hele_ tekst, niet alleen naar de eerste match.       |

De code vervangt elk karakter dat voldoet aan `/[^0-9]/g` door `""` (niets), waardoor letters en tekens direct verdwijnen!

---

## 4. Code Architectuur: Modulair & Clean Code

Om de code professioneel en uitbreidbaar te maken, hebben we een aantal refactoring best-practices toegepast.

### Guard Clauses (Het Early Return Pattern)

In plaats van grote, diep geneste `if-else` structuren, gebruiken we **Guard Clauses**. Dit zijn kleine checks aan het begin van een functie die direct stoppen met `return` als de invoer niet klopt.

- **Slecht (Diep genest):**
  ```javascript
  if (input !== "") {
  	if (input >= 1 && input <= 20) {
  		// Hoofdlogica hier...
  	}
  }
  ```
- **Goed (Guard Clauses):**
  ```javascript
  if (guessInput.value === "") return;
  if (userGuess < 1 || userGuess > 20) return;
  // Hoofdlogica start hier direct op het basisniveau!
  ```
- **Voordeel:** De code is vele malen makkelijker te lezen omdat de "succesvolle route" (happy path) niet diep ingesprongen staat.

### Benoemde Functies vs Inline Callbacks

We hebben de anonieme inline functies uit de `.addEventListener` gehaald en veranderd in losse pijlfuncties (_arrow functions_):

```javascript
const handleGuess = () => { ... };
const handleReset = () => { ... };

guessButton.addEventListener("click", handleGuess);
resetButton.addEventListener("click", handleReset);
```

Hierdoor is de code veel beter herbruikbaar. We kunnen `handleGuess()` nu immers ook direct aanroepen in de toetsenbord-listener!

### Developer Errors vs User Errors

Tijdens onze discussie hebben we een belangrijk onderscheid gemaakt:

1. **Developer Errors (Bugs):** Fouten die de ontwikkelaar maakt (zoals typefouten in selectors of ID's). Dit los je op tijdens het bouwen door goed je console te bekijken.
2. **User Errors (Runtime Exceptions):** Fouten die de gebruiker maakt (lege velden, verkeerde getallen). Dit **moet** je altijd in je code afvangen met Guard Clauses om te voorkomen dat de app vastloopt.

---

## Samenvatting van Leerdoelen behaald:

- [x] **Browser-rendering geoptimaliseerd** (0% Reflow Grid-layout).
- [x] **Toegankelijkheid verbeterd** (volledige besturing via toetsenbord en numpad).
- [x] **Browser Event Loop beheerst** (asynchroon focusbeheer met `setTimeout`).
- [x] **Security & Validatie versterkt** (maxlength handhaving en Regex-invoerfiltering).
- [x] **Architectuur geprofessionaliseerd** (Guard Clauses en Modulaire functies).
