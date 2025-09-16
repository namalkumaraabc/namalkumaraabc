import React from "react";
import "./App.css";

function App() {
  const movies = [
    {
      name: "F1 - The Movie",
      link: "https://mega.nz/example1",
      image: "images/f1-the-movie.png",
    },
    {
      name: "The Dark Knight",
      link: "https://mega.nz/example2",
      image: "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg",
    },
    {
      name: "Interstellar",
      link: "https://mega.nz/example3",
      image:
        "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    },
  ];

  return (
    <div className="app">
      <header className="header">🎬 Movie Hub</header>

      <div className="movie-grid">
        {movies.map((movie, index) => (
          <div key={index} className="movie-card">
            <img src={movie.image} alt={movie.name} className="movie-image" />
            <h2>{movie.name}</h2>
            <div className="button-container">
              <a
                href={movie.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mega-button"
              >
                Get Mega Link
              </a>
              <img src="images/mega.png" alt="Mega Logo" className="mega-logo" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;