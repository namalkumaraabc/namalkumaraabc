import React, { useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilm, faHeart, faArrowUp } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [query, setQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Default hardcoded movies
  const defaultMovies = [
    {
      name: "The Batman",
      description:
        "The 2022 reboot starring Robert Pattinson as a younger, darker Batman investigating Gotham’s corruption while facing the Riddler.",
      link: "https://en.wikipedia.org/wiki/The_Batman_(film)",
      image:
        "https://upload.wikimedia.org/wikipedia/en/f/ff/The_Batman_%28film%29_poster.jpg",
    },
    {
      name: "Interstellar",
      description:
        "A 2014 epic sci-fi film where astronauts travel through a wormhole in search of a new habitable planet.",
      link: "https://en.wikipedia.org/wiki/Interstellar_(film)",
      image:
        "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    },
    {
      name: "The Matrix",
      description:
        "A 1999 sci-fi classic about a dystopian future where reality is a simulated illusion controlled by machines.",
      link: "https://en.wikipedia.org/wiki/The_Matrix",
      image: "https://upload.wikimedia.org/wikipedia/en/d/db/The_Matrix.png",
    },
    {
      name: "Batman Begins",
      description:
        "The 2005 film that rebooted the Batman franchise, exploring Bruce Wayne’s journey to becoming Gotham’s protector.",
      link: "https://en.wikipedia.org/wiki/Batman_Begins",
      image:
        "https://upload.wikimedia.org/wikipedia/en/a/af/Batman_Begins_Poster.jpg",
    },
    {
      name: "The Dark Knight",
      description:
        "Christopher Nolan's 2008 superhero masterpiece where Batman faces off against the Joker in Gotham City.",
      link: "https://en.wikipedia.org/wiki/The_Dark_Knight",
      image:
        "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg",
    },
    {
      name: "The Dark Knight Rises",
      description:
        "The 2012 epic conclusion to Nolan’s Batman trilogy, where Bruce Wayne faces Bane and his toughest challenges yet.",
      link: "https://en.wikipedia.org/wiki/The_Dark_Knight_Rises",
      image:
        "https://upload.wikimedia.org/wikipedia/en/8/83/Dark_knight_rises_poster.jpg",
    },
    {
      name: "Inception",
      description:
        "A 2010 sci-fi thriller about dream invasion and manipulation, directed by Christopher Nolan.",
      link: "https://en.wikipedia.org/wiki/Inception",
      image:
        "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
    },
    {
      name: "Avatar",
      description:
        "James Cameron’s 2009 sci-fi blockbuster set on the alien world of Pandora, blending action and environmental themes.",
      link: "https://en.wikipedia.org/wiki/Avatar_(2009_film)",
      image:
        "https://upload.wikimedia.org/wikipedia/en/d/d6/Avatar_%282009_film%29_poster.jpg",
    },
    {
      name: "F1 - The Movie",
      description:
        "A 2025 action-packed sports drama set in the high-octane world of Formula 1 racing.",
      link: "https://en.wikipedia.org/wiki/F1_(film)",
      image:
        "https://upload.wikimedia.org/wikipedia/en/3/38/F1_%282025_film%29.png",
    },
  ];

  const fetchMovies = async (query) => {
    const res = await fetch("/.netlify/functions/getMovies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    console.log(data);
    return data;
  };

  async function fetchWikiPoster(wikiLink) {
    try {
      const title = wikiLink.split("/wiki/")[1];
      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
      const res = await fetch(url);
      const data = await res.json();
      const pages = data.query.pages;
      const page = Object.values(pages)[0];
      return page?.thumbnail?.source || "./images/dummy.png";
    } catch (err) {
      console.error("Wiki API fetch error:", err);
      return "";
    }
  }

  const handleSearch = async () => {
    const searchTerm = query.trim();
    if (!searchTerm) {
      setFilteredMovies([]);
      return;
    }

    setIsSearching(true); // start search

    const geminiMovies = await fetchMovies(searchTerm);

    const moviesWithImages = await Promise.all(
      geminiMovies.map(async (movie) => ({
        ...movie,
        image: await fetchWikiPoster(movie.link),
      }))
    );

    setFilteredMovies([...moviesWithImages, ...defaultMovies]);
    setIsSearching(false); // search complete
  };

  const moviesToDisplay =
    filteredMovies.length > 0 ? filteredMovies : defaultMovies;

  return (
    <div className="app">
      <header className="header">
        <FontAwesomeIcon icon={faFilm} className="movie-icon" /> Movie Hub
      </header>
      <p className="site-description">
        Movie Hub is your ultimate destination to explore the world of cinema.
        Search for any movie and instantly get its Wikipedia summary, poster,
        and links to related films. Whether you're a casual viewer or a film
        enthusiast, discover new movies, revisit classics, and stay updated with
        trending titles. All in one place!
      </p>
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            className="search-box-input"
            placeholder="Enter a movie name to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="search-button-container">
          <button
            onClick={async (e) => {
              e.preventDefault();
              await handleSearch();
            }}
            className="search-button"
          >
            <FontAwesomeIcon icon={faArrowUp} className="search-arrow" />
          </button>
        </div>
      </div>

      {/* 🔹 Search status */}
      <div className="search-status">{isSearching && <p>Searching</p>}</div>

      <div className="movie-grid">
        {moviesToDisplay.map((movie, index) => (
          <div key={index} className="movie-card">
            <img src={movie.image} alt={movie.name} className="movie-image" />
            <h2>{movie.name}</h2>
            <p className="movie-description">{movie.description}</p>
            <div className="button-container">
              <a
                href={movie.link}
                target="_blank"
                rel="noopener noreferrer"
                className="wiki-button"
              >
                <img
                  src="images/wiki.png"
                  alt="wiki Logo"
                  className="wiki-logo"
                />{" "}
                Show Wiki
              </a>
            </div>
          </div>
        ))}
      </div>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Movie Hub | Built with{" "}
          <FontAwesomeIcon icon={faHeart} className="heart-icon" /> using React
        </p>
      </footer>
    </div>
  );
}

export default App;
