import ProjectKaart from "./ProjectKaart";

function ProjectenSectie({ projecten }) {
	return (
		<section className="projects" id="projects">
			<h2>Projects</h2>
			{projecten.length === 0 ? (
				<p className="projects__leeg">Nog geen projecten toegevoegd.</p>
			) : (
				<div className="card-grid">
					{projecten.map((project) => (
						<ProjectKaart key={project.id} {...project} />
					))}
				</div>
			)}
		</section>
	);
}

export default ProjectenSectie;
