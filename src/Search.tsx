import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Search.css";

const allSongs = [
  { artist: "Aimer", album: "Penny Rain", title: "Ref:rain", year: 2019, language: "Japanese" },
  { artist: "BABYMETAL", album: "METAL RESISTANCE", title: "No Rain No Rainbow", year: 2016, language: "Japanese" },
  { artist: "THE ORAL CIGARETTES", album: "FIXION", title: "Amy", year: 2016, language: "Japanese" },
  { artist: "THE ORAL CIGARETTES", album: "BLACK MEMORY", title: "Flower", year: 2017, language: "Japanese" },
  { artist: "Artist A", album: "Album A", title: "Some English Song", year: 2020, language: "English" },
  { artist: "Artist B", album: "Album B", title: "Chinese Melody", year: 2021, language: "Chinese" },
];

const languageFilters = ["All", "English", "Chinese", "Japanese"];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Search: React.FC = () => {
  const queryParams = useQuery();
  const initialQuery = queryParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState("All");

  const location = useLocation();
  useEffect(() => {
    setQuery(queryParams.get("q") || "");
  }, [location.search]);

  const filteredSongs = allSongs.filter(song => {
    const fields = [
      song.artist.toLowerCase(),
      song.album.toLowerCase(),
      song.title.toLowerCase()
    ];
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const matchesQuery = words.every(word =>
      fields.some(field => field.includes(word))
    );
    const matchesLanguage = language === "All" || song.language === language;
    return matchesQuery && matchesLanguage;
  });

  return (
    <div className="hero-section">
      <div className="hero-container text-box">
        <div className="search-box">
          <div className="search-bar-row">
            <input
              type="text"
              placeholder="Search by song, artist, or album..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="modern-search-input"
            />
          </div>
          <div className="filter-row">
            {languageFilters.map(l => (
              <button
                key={l}
                className={`filter-pill${language === l ? " active" : ""}`}
                onClick={() => setLanguage(l)}
              >
                {l}
              </button>
            ))}
          </div>
          <ul className="modern-songs-list">
            {filteredSongs.map((song, idx) => (
              <li key={idx} className="modern-song-item">
                <strong>{song.title}</strong> by {song.artist} ({song.album}, {song.year}) <span className="song-lang">{song.language}</span>
              </li>
            ))}
            {filteredSongs.length === 0 && <p>No results found.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Search;