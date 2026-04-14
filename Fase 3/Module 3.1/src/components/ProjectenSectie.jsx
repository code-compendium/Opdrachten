import { useState } from "react";
import ProjectKaart from "./ProjectKaart";
import FilterBalk from "./FilterBalk";

function filterProjecten(projecten, filter) {
	if (filter === "all") return projecten;
	return projecten.filter((p) => p.technologieen.includes(filter));
}

function ProjectenSectie({ projecten }) {
	const [actieveFilter, setActieveFilter] = useState("all");

	const zichtbareProjecten = filterProjecten(projecten, actieveFilter);

	return (
		<section className="projects" id="projects">
			<h2>Projects</h2>

			<FilterBalk actief={actieveFilter} onFilterWijziging={setActieveFilter} />

			{zichtbareProjecten.length === 0 ? (
				<p className="projects__leeg">Geen projecten gevonden voor deze filter.</p>
			) : (
				<div className="card-grid">
					{zichtbareProjecten.map((project) => (
						<ProjectKaart key={project.id} {...project} />
					))}
				</div>
			)}

			<p className="projects__teller">
				{zichtbareProjecten.length} van {projecten.length} projecten
			</p>
		</section>
	);
}

export default ProjectenSectie;
