import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs/promises';
import path from 'path';
import NotFound from './404';
import { allSongs, sluggify } from '../src/app/ts/songsData';
import '../src/app/css/Song.css';
import '../src/app/css/Filter.css';

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

type WordBankEntry = {
  original: string;
  romanized?: string;
  romaji?: string;
  english?: string;
  functions?: Record<string, { english: string }>;
};

type SongProps = {
  lyricsData: LyricsData;
  wordBanks: Record<string, Record<string, WordBankEntry>>;
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
  const wordBanks: Record<string, Record<string, WordBankEntry>> = {};
  for (const lang of lyricsData.languages) {
    const filePath = path.join(process.cwd(), 'public', 'data', 'word-banks', `${lang}.yml`);
    try {
      const file = await fs.readFile(filePath, 'utf8');
      wordBanks[lang] = yaml.load(file) as Record<string, WordBankEntry>;
    } catch {
      wordBanks[lang] = {};
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
  const [openExplanations, setOpenExplanations] = useState<Record<number, boolean>>({});
  const [activeTab, setActiveTab] = useState<'Lyrics' | 'Interpretation' | 'Test'>('Lyrics');

  useEffect(() => {
    type StanzaElement = Element & { __touchHandler?: EventListener };
    const stanzas = document.querySelectorAll('.no-hover-background-after-click');
    stanzas.forEach(stanza => {
      const stanzaEl = stanza as StanzaElement;
      const handler = () => {
        stanzaEl.classList.add('touch-active');
        setTimeout(() => stanzaEl.classList.remove('touch-active'), 100);
      };
      stanzaEl.addEventListener('touchstart', handler);
      stanzaEl.__touchHandler = handler;
    });
    return () => {
      stanzas.forEach(stanza => {
        const stanzaEl = stanza as StanzaElement;
        if (stanzaEl.__touchHandler) {
          stanzaEl.removeEventListener('touchstart', stanzaEl.__touchHandler);
        }
      });
    };
  }, [lyricsData]);

  useEffect(() => {
    document.querySelectorAll('.no-hover-background-after-click').forEach(el => {
      el.classList.remove('touch-active');
    });
  }, [activeTab]);

  if (!lyricsData) { return <NotFound />; }

  function getWordExplanation(word: string, lang: string, func: string) {
    if (word == "-" && lang == "-" && func == "-") {
      return { 
        original: "-", 
        romanized: "-", 
        english: "-" 
      };
    }
    const expl_ori = word;
    let expl_rom = "";
    let expl_eng = "";
    const expl = wordBanks[lang][expl_ori];
    if (!expl) {
      return {
        original: expl_ori,
        romanized: "-",
        english: "-",
      }
    }
    if (lang === "jp") {
      expl_rom = expl.romaji ?? "-";
    } else {
      expl_rom = expl.romanized ?? "-";
    }
    if (func === "-") {
      expl_eng = expl.english ?? "-";
    } else {
      expl_eng = expl.functions?.[func]?.english ?? "-";
    }
    return {
      original: expl_ori,
      romanized: expl_rom,
      english: expl_eng,
    };
  }

  function parseExplanation(explanationArr: string[]) {
    if (!explanationArr) {
      return [{ word: "-", lang: "-", func: "-" }];
    }
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
        <div className="song-toolbar">
          <div className="toolbar-left">
            <button
              className={`filter-pill${activeTab === 'Lyrics' ? ' active' : ''}`}
              onClick={() => setActiveTab('Lyrics')}
            >
              Lyrics
            </button>
            <button
              className={`filter-pill${activeTab === 'Interpretation' ? ' active' : ''}`}
              onClick={() => setActiveTab('Interpretation')}
            >
              Interpretation
            </button>
            <button
              className={`filter-pill${activeTab === 'Test' ? ' active' : ''}`}
              onClick={() => setActiveTab('Test')}
            >
              Test
            </button>
          </div>
          <div className="toolbar-right">
            <button className="filter-pill settings-btn" title="Settings">
              <i className="fa fa-cog"></i>
            </button>
          </div>
        </div>
        {activeTab === 'Lyrics' && (
          <div className="lyrics-container" key={activeTab}>
            {Array.isArray(lyricsData.lyrics) ? (
              lyricsData.lyrics.map((entry: LyricsEntry, idx: number) =>
                entry.divider ? (
                  <hr key={idx} className="lyrics-divider" />
                ) : (
                  <div key={idx}>
                    <div
                      className="lyrics-text no-hover-background-after-click"
                      onClick={() => handleToggle(idx)}
                    >
                      {entry.original && <div className="original">{entry.original}</div>}
                      {entry.romanized && (<div className="romanized">{entry.romanized}</div>)}
                      {entry.english && (<div className="english">{entry.english}</div>)}
                    </div>
                    {openExplanations[idx] &&  (
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
        )}
        {activeTab === 'Interpretation' && (
          <div key={activeTab}>
            <p>Interpretation view coming soon!</p>
          </div>
        )}
        {activeTab === 'Test' && (
          <div key={activeTab}>
            <p>Test view coming soon!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Song;