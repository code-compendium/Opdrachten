import ProjectKaart from "./ProjectKaart";

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

function ProjectenSectie() {
	return (
		<section className="projects" id="projects">
			<h2>Projects</h2>
			<div className="card-grid">
				{projecten.map((project) => (
					<ProjectKaart key={project.id} {...project} />
				))}
			</div>
		</section>
	);
}

export default ProjectenSectie;
