import Navigatie from "./components/Navigatie";
import HeroSectie from "./components/HeroSectie";
import ProjectenSectie from "./components/ProjectenSectie";
import "./App.css";

const projecten = [
	{
		id: 1,
		naam: "Portfolio Website",
		beschrijving: "A responsive portfolio built with HTML and CSS.",
		technologieen: ["HTML", "CSS"],
		url: "#",
	},
	{
		id: 2,
		naam: "Webshop UI",
		beschrijving: "A product overview page with filtering.",
		technologieen: ["HTML", "CSS", "JavaScript"],
		url: "#",
	},
	{
		id: 3,
		naam: "Dashboard",
		beschrijving: "An analytics dashboard with charts.",
		technologieen: ["React", "TypeScript"],
		url: "#",
	},
];

const profiel = {
	naam: "Jouw Naam",
	titel: "Frontend Developer",
	omschrijving: "I build fast, accessible and beautiful interfaces.",
};
function App() {
	return (
		<div className="page">
			<Navigatie naam={profiel.naam} />
			<main className="page-main">
				<HeroSectie profiel={profiel} aantalProjecten={projecten.length} />
				<ProjectenSectie projecten={projecten} />
			</main>
			<footer className="page-footer">
				<p>Built with React &mdash; &copy; 2026</p>
			</footer>
		</div>
	);
}

export default App;
