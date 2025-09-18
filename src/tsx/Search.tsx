import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import '../css/Search.css'
import { allSongs, sluggify } from '../ts/songsData';

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
    <div>
      <div className="search-box">
        <div className="search-bar-row">
          <input
            type="text"
            placeholder="Search by artist, album, or song..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="modern-search-input"/>
        </div>
        <div className="filter-row">
          {languageFilters.map(l => (
            <button
              key={l}
              className={`filter-pill${language === l ? " active" : ""}`}
              onClick={() => setLanguage(l)}>
              {l}
            </button>
          ))}
        </div>
        <ul className="modern-songs-list">
          {filteredSongs.map((song, idx) => {
            const slug = `/${sluggify(song.artist)}-${sluggify(song.album)}-${sluggify(song.title)}`;
            return (
              <Link to={slug} className="modern-song-link">
                <li key={idx} className="modern-song-item">
                  <span>{song.artist}: <strong>{song.title}</strong></span> <span className="song-lang">{song.album}</span>
                </li>
              </Link>
            );
          })}
          {filteredSongs.length === 0 && <p>No results found.</p>}
        </ul>
      </div>
    </div>
  );
};

export default Search;