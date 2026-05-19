import { useState, useEffect } from "react";
function GebruikersLijst() {
	const [gebruikers, setGebruikers] = useState([]);
	const [isLaden, setIsLaden] = useState(true);
	const [fout, setFout] = useState(null);

	useEffect(() => {
		async function haalGebruikersOp() {
			try {
				const response = await fetch("https://jsonplaceholder.typicode.com/users");

				if (!response.ok) {
					throw new Error(`HTTP fout: ${response.status}`);
				}

				const data = await response.json();
				setGebruikers(data);
			} catch (err) {
				setFout(err.message);
			} finally {
				setIsLaden(false);
			}
		}

		haalGebruikersOp();
	}, []); // Lege array: draait eenmaal bij mount

	if (isLaden) return <p>Laden...</p>;
	if (fout) return <p>Fout: {fout}</p>;

	return (
		<ul>
			{gebruikers.map((g) => (
				<li key={g.id}>{g.name}</li>
			))}
		</ul>
	);
}

export default GebruikersLijst;
