import { useState, useEffect } from "react";

function WeerBericht() {
	const [stad, setStad] = useState("Rotterdam");
	const [isLaden, setIsLaden] = useState(true);
	const [data, setData] = useState(null);
	const [fout, setFout] = useState(null);

	useEffect(() => {
		async function haalWeerOp() {
			try {
				const response = await fetch("https://wttr.in/Rotterdam?format=3");
				const tekst = await response.text();
				setData(tekst);
			} catch (err) {
				setFout(err.message);
			} finally {
				setIsLaden(false);
			}
		}

		haalWeerOp();
	}, []);

	if (isLaden) return <p>Laden...</p>;
	if (fout) return <p>Fout: {fout}</p>;
	return <p>{data}</p>;
}

export default WeerBericht;
