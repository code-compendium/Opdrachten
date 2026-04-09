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

function App() {
	return (
		<div>
			<header>
				<nav>
					<a href="/">MyPortfolio</a>
					<ul>
						<li>
							<a href="#projects">Projects</a>
						</li>
						<li>
							<a href="#about">About</a>
						</li>
						<li>
							<a href="#contact">Contact</a>
						</li>
					</ul>
				</nav>
			</header>

			<main>
				<section id="projects">
					<h2>Projects</h2>
					<div>
						{projecten.map((project) => (
							<article key={project.id}>
								<h3>{project.naam}</h3>
								<p>{project.beschrijving}</p>
								<p>{project.technologieen.join(", ")}</p>
								<a href={project.url}>View project</a>
							</article>
						))}
					</div>
				</section>
			</main>

			<footer>
				<p>Built with React &mdash; &copy; 2026</p>
			</footer>
		</div>
	);
}

export default App;
