import React, { useState } from "react";
import "./Search.css";

const allSongs = [
  { title: "Ref:rain", artist: "Aimer", album: "Penny Rain", year: 2019, language: "Japanese" },
  { title: "No Rain No Rainbow", artist: "BABYMETAL", album: "METAL RESISTANCE", year: 2016, language: "Japanese" },
  { title: "Amy", artist: "THE ORAL CIGARETTES", album: "FIXION", year: 2016, language: "Japanese" },
  { title: "Flower", artist: "THE ORAL CIGARETTES", album: "BLACK MEMORY", year: 2017, language: "Japanese" },
  { title: "Some English Song", artist: "Artist A", album: "Album A", year: 2020, language: "English" },
  { title: "Chinese Melody", artist: "Artist B", album: "Album B", year: 2021, language: "Chinese" },
];

const languageFilters = ["All", "English", "Chinese", "Japanese"];

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("All");

  const filteredSongs = allSongs.filter(song => {
    const matchesQuery =
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase()) ||
      song.album.toLowerCase().includes(query.toLowerCase());
    const matchesLanguage = language === "All" || song.language === language;
    return matchesQuery && matchesLanguage;
  });

  return (
    <div className="search-outer">
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
          {filteredSongs.length === 0 && <li className="modern-song-item">No results found.</li>}
        </ul>
      </div>
    </div>
  );
};

export default Search;