// src/App.jsx
import Navigatie from "./components/Navigatie";
import ProjectenSectie from "./components/ProjectenSectie";
import "./App.css";

function App() {
	return (
		<div className="page">
			<Navigatie />
			<main className="page-main">
				<ProjectenSectie />
			</main>
			<footer className="page-footer">
				<p>Built with React &mdash; &copy; 2026</p>
			</footer>
		</div>
	);
}

export default App;
