import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import '../src/app/css/Search.css'
import { allSongs, sluggify } from '../src/app/ts/songsData';
import Head from 'next/head';
import '../src/app/css/Filter.css';

const languageFilters = ["All", "English", "Chinese", "Japanese"];

const Search: React.FC = () => {
  const router = useRouter();
  const initialQuery = typeof router.query.q === "string" ? router.query.q : "";
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState("All");

  useEffect(() => {
    setQuery(typeof router.query.q === "string" ? router.query.q : "");
  }, [router.query.q]);

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
    <>
      <Head>
        <title>Leerically | Search</title>
        <meta name="description" content="Search for song lyrics by artist, album, or song title." />
      </Head>
      <div className="search-box">
        <div className="search-bar-row">
          <input
            type="text"
            placeholder="Search by artist, album, or song title..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"/>
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
        <ul className="songs-list">
          {filteredSongs.map((song, idx) => {
            const slug = `/${sluggify(song.artist)}-${sluggify(song.album)}-${sluggify(song.title)}`;
            return (
              <li className="song-item" key={idx}>
                <Link href={slug} className="song-link" title={`${song.artist} - ${song.title} (${song.album})`}>
                  <span className="song-main">
                    {song.artist}: <strong>{song.title}</strong>
                  </span> 
                  <span className="song-album">
                    {song.album}
                  </span>
                </Link>
              </li>
            );
          })}
          {filteredSongs.length === 0 && <p>No results found.</p>}
        </ul>
      </div>
    </>
  );
};

export default Search;