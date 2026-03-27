// Laad status element
const laadStatus = document.querySelector(".laad-status");

// GitHub gebruikersnaam - verander naar jouw eigen naam
const GITHUB_GEBRUIKER = "code-compendium";

let geladenProjecten = [];

async function haalGithubRepos(gebruiker) {
	const response = await fetch(
		`https://api.github.com/users/${gebruiker}/repos?sort=updated&per_page=6`,
	);

	if (!response.ok) {
		throw new Error(`GitHub API fout: ${response.status}`);
	}

	const repos = await response.json();

	const reposMetAlleTalen = await Promise.all(
		repos.map(async (repo) => {
			try {
				const talenResponse = await fetch(repo.languages_url);
				if (!talenResponse.ok) {
					return { ...repo, alleTalen: repo.language ? [repo.language] : [] };
				}
				const talenObject = await talenResponse.json();
				const alleTalen = Object.keys(talenObject);
				return { ...repo, alleTalen };
			} catch (fout) {
				console.error(`Kon talen voor \${repo.name} niet laden`, fout);
				return { ...repo, alleTalen: repo.language ? [repo.language] : [] };
			}
		}),
	);

	return reposMetAlleTalen;
}

function omzetNaarProjectData(repos) {
	return repos.map((repo) => ({
		naam: repo.name,
		beschrijving: repo.description || "Geen beschrijving beschikbaar.",
		technologieen:
			repo.alleTalen && repo.alleTalen.length > 0
				? repo.alleTalen
				: repo.language
					? [repo.language]
					: [],
		live: repo.homepage ? true : false,
		url: repo.html_url,
	}));
}

async function laadProjecten() {
	const grid = document.querySelector(".card-grid");
	if (!grid) return;

	laadStatus.textContent = "Projecten laden...";

	try {
		const repos = await haalGithubRepos(GITHUB_GEBRUIKER);
		geladenProjecten = omzetNaarProjectData(repos);

		// Kaarten renderen met de opgehaalde data
		renderKaarten(geladenProjecten);
		laadStatus.textContent = "";
	} catch (fout) {
		console.error("Kon projecten niet laden:", fout);
		laadStatus.innerHTML = `
      Kon projecten niet laden.
      <button onclick="laadProjecten()">Opnieuw proberen</button>
    `;

		// Fallback naar hardgecodeerde data
		geladenProjecten = projectData;
		renderKaarten(geladenProjecten);
	}
}

// Start het laden
laadProjecten();

// Filterlogica met array methods
const filterProjecten = (filter) => {
	if (filter === "all") return geladenProjecten;
	return geladenProjecten.filter((project) => project.technologieen.includes(filter));
};

// Kaarten renderen vanuit data
const renderKaarten = (projecten) => {
	const grid = document.querySelector(".card-grid");
	if (!grid) return;

	if (projecten.length === 0) {
		grid.innerHTML = `<p>Geen projecten gevonden.</p>`;
		return;
	}

	grid.innerHTML = projecten
		.map(
			(project) => `
    <article class="card">
      <div class="card__image" aria-hidden="true">🌐</div>
      <div class="card__body">
        <h3 class="card__title">${project.naam}</h3>
        <p class="card__description">${project.beschrijving}</p>
        <div class="card__tags">
          ${project.technologieen
						.map(
							(tech) => `
            <span class="card__tag">${tech}</span>
          `,
						)
						.join("")}
        </div>
      </div>
      <footer class="card__footer">
        <a
          href="${project.url}"
          class="btn btn--primary btn--sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
      </footer>
    </article>
  `,
		)
		.join("");
};

// Event delegation op de filterbalk
const filterBar = document.querySelector(".filter-bar");

if (filterBar) {
	filterBar.addEventListener("click", (event) => {
		const knop = event.target.closest(".filter-btn");
		if (!knop) return;

		// Actieve state verplaatsen
		filterBar.querySelectorAll(".filter-btn").forEach((btn) => {
			btn.classList.remove("filter-btn--active");
		});
		knop.classList.add("filter-btn--active");

		// Projecten filteren en renderen
		const filter = knop.dataset.filter;
		const gefilterd = filterProjecten(filter);
		renderKaarten(gefilterd);
	});
}

// Initieel alle projecten renderen
renderKaarten(geladenProjecten);

// Hamburger menu
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
	// Toggle de open class op de links
	navLinks.classList.toggle("nav__links--open");

	// Pas aria-expanded aan voor toegankelijkheid
	const isOpen = navLinks.classList.contains("nav__links--open");
	navToggle.setAttribute("aria-expanded", isOpen);
});

// Sluit het menu als er buiten geklikt wordt
document.addEventListener("click", (event) => {
	const klikBuitenMenu =
		!navLinks.contains(event.target) && !navToggle.contains(event.target);

	if (klikBuitenMenu && navLinks.classList.contains("nav__links--open")) {
		navLinks.classList.remove("nav__links--open");
		navToggle.setAttribute("aria-expanded", false);
	}
});

// Sluit het menu bij Escape
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && navLinks.classList.contains("nav__links--open")) {
		navLinks.classList.remove("nav__links--open");
		navToggle.setAttribute("aria-expanded", false);
		navToggle.focus(); // Stuur focus terug naar de toggle knop
	}
});

// Event delegation op het kaartenraster
const cardGrid = document.querySelector(".card-grid");

if (cardGrid) {
	cardGrid.addEventListener("click", (event) => {
		const kaart = event.target.closest(".card");
		if (!kaart) return; // Klik was niet op of binnen een kaart

		// Voeg een "active" state toe aan de geklekte kaart
		// Verwijder eerst van alle andere kaarten
		document.querySelectorAll(".card").forEach((k) => {
			k.classList.remove("card--active");
		});

		kaart.classList.add("card--active");
		console.log("Kaart geselecteerd:", kaart.querySelector(".card__title").textContent);
	});
}
