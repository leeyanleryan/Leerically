import React, { useState } from 'react';
import yaml from 'js-yaml';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs/promises';
import path from 'path';
import NotFound from './404';
import { allSongs, sluggify } from '../src/app/ts/songsData';
import '../src/app/css/Song.css';

type LyricsEntry = {
  divider: boolean;
  language: string;
  original: string;
  romanized: string;
  english: string;
  explanation: string[];
};

type LyricsData = {
  title: string;
  artist: string;
  album: string;
  languages: string[];
  lyrics: LyricsEntry[] | string;
};

type SongProps = {
  lyricsData: LyricsData;
  wordBanks: Record<string, any>;
};

function getAllSlugs() {
  return allSongs.map(song =>
    `${sluggify(song.artist)}-${sluggify(song.album)}-${sluggify(song.title)}`
  );
}

async function fetchLyrics(slug: string) {
  const filePath = path.join(process.cwd(), 'public', 'data', 'songs', `${slug}.yml`);
  try {
    const file = await fs.readFile(filePath, 'utf8');
    return yaml.load(file) as LyricsData;
  } catch {
    throw new Error('Lyrics not found');
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllSlugs();
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const lyricsData = await fetchLyrics(params!.slug as string);
  const wordBanks: Record<string, any> = {};
  for (const lang of lyricsData.languages) {
    const filePath = path.join(process.cwd(), 'public', 'data', 'word-banks', `${lang}.yml`);
    try {
      const file = await fs.readFile(filePath, 'utf8');
      wordBanks[lang] = yaml.load(file);
    } catch {
      wordBanks[lang] = null;
    }
  }
  return {
    props: {
      lyricsData,
      wordBanks,
    },
  };
};

const Song: React.FC<SongProps> = ({ lyricsData, wordBanks }) => {
  if (!lyricsData) { return <NotFound />; }

  const [openExplanations, setOpenExplanations] = useState<Record<number, boolean>>({});

  function getWordExplanation(word: string, lang: string, func: string) {
    let expl_ori = word;
    let expl_rom = "";
    let expl_eng = "";
    let expl = wordBanks[lang][expl_ori];
    if (!expl) {
      return {
        original: expl_ori,
        romanized: "-",
        english: "-",
      }
    }
    if (lang === "jp") {
      expl_rom = expl.romaji;
    } else {
      expl_rom = expl.romanized;
    }
    if (func === "-") {
      expl_eng = expl.english;
    } else {
      expl_eng = expl.functions[func].english;
    }
    return {
      original: expl_ori,
      romanized: expl_rom,
      english: expl_eng,
    };
  }

  function parseExplanation(explanationArr: string[]) {
    return explanationArr.map(str => {
      const [word, lang, func] = str.split("|");
      return { word, lang, func };
    });
  }

  const handleToggle = (idx: number) => {
    setOpenExplanations(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <>
      <Head>
        <title>
          {`Leerically | ${lyricsData.artist} - ${lyricsData.title} Lyrics`}
        </title>
        <meta
          name="description"
          content={
            lyricsData.languages.includes("en")
              ? `Lyrics for ${lyricsData.title} by ${lyricsData.artist}.`
              : `Fully translated lyrics for ${lyricsData.title} by ${lyricsData.artist}.`
          }
        />
      </Head>
      <div className="song-container">
        <h1>{lyricsData.title}</h1>
        <h2>{lyricsData.artist} - {lyricsData.album}</h2>
        <div className="lyrics-container">
          {Array.isArray(lyricsData.lyrics) ? (
            lyricsData.lyrics.map((entry: LyricsEntry, idx: number) =>
              entry.divider ? (
                <hr key={idx} className="lyrics-divider" />
              ) : (
                <div key={idx}>
                  <div
                    className="lyrics-text"
                    onClick={() => entry.explanation && handleToggle(idx)}
                    style={{ cursor: entry.explanation ? "pointer" : "default" }}
                  >
                    {entry.original && <div className="original">{entry.original}</div>}
                    {entry.romanized && (<div className="romanized">{entry.romanized}</div>)}
                    {entry.english && (<div className="english">{entry.english}</div>)}
                  </div>
                  {openExplanations[idx] && entry.explanation && (
                    <div className="explanation-table-wrapper">
                      <table className="explanation-table">
                        <thead>
                          <tr>
                            <th>Original</th>
                            <th>Romanized</th>
                            <th>English</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parseExplanation(entry.explanation).map((exp, i) => {
                            const wordData = getWordExplanation(exp.word, exp.lang, exp.func);
                            return (
                              <tr key={i}>
                                <td>{wordData.original}</td>
                                <td>{wordData.romanized}</td>
                                <td>{wordData.english}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            )
          ) : (
            <pre>{lyricsData.lyrics}</pre>
          )}
        </div>
      </div>
    </>
  );
};

export default Song;