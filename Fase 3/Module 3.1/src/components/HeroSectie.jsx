function HeroSectie({ profiel, aantalProjecten }) {
	const { naam, titel, omschrijving } = profiel;

	return (
		<section className="hero">
			<div className="hero__content">
				<p className="hero__label">Beschikbaar voor werk</p>
				<h1 className="hero__naam">{naam}</h1>
				<p className="hero__titel">{titel}</p>
				<p className="hero__omschrijving">{omschrijving}</p>
				<div className="hero__acties">
					<a href="#projects" className="btn btn--primary">
						Bekijk projecten ({aantalProjecten})
					</a>
					<a href="#contact" className="btn btn--outline">
						Contact
					</a>
				</div>
			</div>
		</section>
	);
}

export default HeroSectie;
