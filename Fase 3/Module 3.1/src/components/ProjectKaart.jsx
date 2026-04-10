function ProjectKaart({ naam, beschrijving, technologieen, url }) {
	return (
		<article className="card">
			<div className="card__image" aria-hidden="true">
				🌐
			</div>
			<div className="card__body">
				<h3 className="card__title">{naam}</h3>
				<p className="card__description">{beschrijving}</p>
				<div className="card__tags">
					{technologieen.map((tech) => (
						<span key={tech} className="card__tag">
							{tech}
						</span>
					))}
				</div>
			</div>
			<footer className="card__footer">
				<a href={url} className="btn btn--sm" target="_blank" rel="noopener noreferrer">
					View project
				</a>
			</footer>
		</article>
	);
}

export default ProjectKaart;
