import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import yaml from 'js-yaml';
import NotFound from './404';
import { allSongs, sluggify } from './songsData';

function getSongSlugFromUrl(path: string) {
  return path.replace(/^\//, '').replace(/\.yml$/, '');
}

function getAllSlugs() {
  return allSongs.map(song =>
    `${sluggify(song.artist)}-${sluggify(song.album)}-${sluggify(song.title)}`
  );
}

async function fetchLyrics(slug: string) {
  const response = await fetch(`/data/songs/${slug}.yml`);
  if (!response.ok) throw new Error('Lyrics not found');
  const text = await response.text();
  return yaml.load(text);
}

const Song: React.FC = () => {
  const location = useLocation();
  const [lyricsData, setLyricsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slug = getSongSlugFromUrl(location.pathname);
  const validSlugs = getAllSlugs();

  if (!validSlugs.includes(slug)) {
    return <NotFound />;
  }

  useEffect(() => {
    const slug = getSongSlugFromUrl(location.pathname);
    setLoading(true);
    setError(null);
    fetchLyrics(slug)
      .then(data => {
        setLyricsData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Lyrics not found.');
        setLoading(false);
      });
  }, [location.pathname]);

  return (
    <div style={{ margin: "0 auto", paddingTop: "64px", textAlign: "center" }}>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {lyricsData && (
        <div>
          <h1>{lyricsData.title}</h1>
          <h2>{lyricsData.artist} - {lyricsData.album}</h2>
          <div style={{ textAlign: 'left', margin: '0 auto', maxWidth: 600 }}>
            {Array.isArray(lyricsData.lyrics) ? (
              lyricsData.lyrics.map((entry: any, idx: number) =>
                entry.divider ? (
                  <hr key={idx} style={{ margin: "16px 0" }} />
                ) : (
                  <div key={idx} style={{ marginBottom: "12px" }}>
                    {/* <div><b>{entry.language?.toUpperCase()}</b></div> */}
                    <div>{entry.original}</div>
                    {entry.romanized && <div style={{ color: "#aaa" }}>{entry.romanized}</div>}
                    {entry.english && <div style={{ color: "#7fd" }}>{entry.english}</div>}
                    {entry.explanation && Array.isArray(entry.explanation) 
                    // && (
                    //   <ul style={{ fontSize: "0.95em", color: "#aaa", margin: "4px 0 0 16px" }}>
                    //     {entry.explanation.map((exp: string, i: number) => (
                    //       <li key={i}>{exp}</li>
                    //     ))}
                    //   </ul>
                    // )
                    }
                  </div>
                )
              )
            ) : (
              <pre>{lyricsData.lyrics}</pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Song;