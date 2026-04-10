function Navigatie({ naam }) {
	return (
		<header className="page-header">
			<nav className="nav">
				<a href="/" className="nav__logo">
					{naam || "MyPortfolio"}
				</a>
				<ul className="nav__links">
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
				<a href="#contact" className="btn">
					Hire me
				</a>
			</nav>
		</header>
	);
}

export default Navigatie;
