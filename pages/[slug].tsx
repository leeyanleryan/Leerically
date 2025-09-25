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
  background: string;
  interpretation: string;
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
  const [activeTab, setActiveTab] = useState<'Lyrics' | 'Info' | 'Test'>('Lyrics');

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

  type GlossItem = {
    line: string;       // original line (in JP etc.)
    word: string;       // the surface form from explanation
    gloss: string;      // English meaning (incl. function-specific when present)
    occurrence: number; // this is the nth time this word appears in the line (1-based)
  };

  function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }
  function pickOne<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // highlight only the nth occurrence of `token` in `text` (safe, no innerHTML)
  function HighlightNth({
    text,
    token,
    occurrence,
    className = 'lt-highlight',
  }: {
    text: string;
    token: string;
    occurrence: number;
    className?: string;
  }) {
    if (!token) return <>{text}</>;
    let found = 0;
    const parts: React.ReactNode[] = [];

    let from = 0;
    while (true) {
      const at = text.indexOf(token, from);
      if (at === -1) {
        parts.push(text.slice(from));
        break;
      }
      const next = at + token.length;
      // push prefix
      parts.push(text.slice(from, at));
      // push highlighted or plain token
      found += 1;
      if (found === occurrence) {
        parts.push(<span key={at} className={className}>{token}</span>);
      } else {
        parts.push(text.slice(at, next));
      }
      from = next;
    }

    return <>{parts}</>;
  }

  const TestTab: React.FC<{ lyricsData: LyricsData }> = ({ lyricsData }) => {
    // Build a pool: for each annotated line, collect (word, gloss, nth-occurrence)
    const pool = React.useMemo(() => {
      if (!Array.isArray(lyricsData.lyrics)) return { lines: [] as { line: string; items: GlossItem[] }[], allGlosses: [] as string[] };

      const lines: { line: string; items: GlossItem[] }[] = [];
      const allGlossesSet = new Set<string>();

      for (const entry of lyricsData.lyrics) {
        if ((entry as LyricsEntry).divider) continue;
        if (!entry.explanation) continue;

        const exps = parseExplanation(entry.explanation);
        // count nth occurrence per word for this line
        const counts = new Map<string, number>();
        const items: GlossItem[] = [];

        for (const e of exps) {
          const info = getWordExplanation(e.word, e.lang, e.func);
          const gloss = info.english?.trim();
          if (!gloss || gloss === '-' || !e.word) continue;

          const n = (counts.get(e.word) ?? 0) + 1;
          counts.set(e.word, n);

          items.push({
            line: entry.original,
            word: e.word,
            gloss,
            occurrence: n,
          });
          allGlossesSet.add(gloss);
        }

        if (items.length) {
          lines.push({ line: entry.original, items });
        }
      }

      return { lines, allGlosses: Array.from(allGlossesSet) };
    }, [lyricsData]);

    // If there’s not enough data, render a helpful message
    const totalItems = React.useMemo(
      () => pool.lines.reduce((acc, l) => acc + l.items.length, 0),
      [pool]
    );
    const ready = totalItems >= 1 && pool.allGlosses.length >= 2;

    type Question = {
      line: string;
      token: string;
      occurrence: number;
      correct: string;
      options: string[];
    };

    const makeQuestion = React.useCallback((): Question | null => {
      if (!ready) return null;

      // pick a random line with at least 1 item
      const line = pickOne(pool.lines);
      const item = pickOne(line.items);

      // distractors: unique other glosses
      const distractorPool = pool.allGlosses.filter((g) => g !== item.gloss);
      // ensure at most 3 distractors, unique, shuffled
      const distractors = shuffle(distractorPool).slice(0, 3);
      // if the global pool is small, backfill to keep at least 2 options
      const options = shuffle([item.gloss, ...distractors]).slice(0, 4);

      return {
        line: item.line,
        token: item.word,
        occurrence: item.occurrence,
        correct: item.gloss,
        options,
      };
    }, [pool, ready]);

    const [q, setQ] = React.useState<Question | null>(makeQuestion);
    const [picked, setPicked] = React.useState<string | null>(null);

    // Next question
    const next = () => {
      setPicked(null);
      setQ(makeQuestion());
    };

    if (!ready || !q) {
      return (
        <div className="lt-test-empty">
          <p>
            Not enough annotated lyrics to generate a test. Please check back later or contribute annotations!
          </p>
        </div>
      );
    }

    const isCorrect = (opt: string) => picked !== null && opt === q.correct;
    const isWrongPick = (opt: string) => picked !== null && picked === opt && opt !== q.correct;

    return (
      <div className="lt-test-wrap">
        <h3 className="lt-test-title">Pick the meaning of the highlighted word</h3>
        <div className="lt-test-card">
          <div className="lt-test-sentence">
            <HighlightNth text={q.line} token={q.token} occurrence={q.occurrence} />
          </div>

          <ul className="lt-test-options">
            {q.options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  className={
                    'lt-option-button' +
                    (picked ? ' disabled' : '') +
                    (isCorrect(opt) ? ' correct' : '') +
                    (isWrongPick(opt) ? ' incorrect' : '')
                  }
                  onClick={() => !picked && setPicked(opt)}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>

          <div className="lt-test-actions">
            <button className="lt-next-btn" onClick={next}>
              Next Question
            </button>
          </div>
        </div>
      </div>
    );
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
            <button className={`filter-pill${activeTab === 'Lyrics' ? ' active' : ''}`} onClick={() => setActiveTab('Lyrics')}>Lyrics</button>
            <button className={`filter-pill${activeTab === 'Info' ? ' active' : ''}`} onClick={() => setActiveTab('Info')}>Info</button>
            <button className={`filter-pill${activeTab === 'Test' ? ' active' : ''}`} onClick={() => setActiveTab('Test')}>Test</button>
          </div>
          <div className="toolbar-right">
            <button className="filter-pill settings-btn" title="Settings"><i className="fa fa-cog"></i></button>
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
        {activeTab === 'Info' && (
          <div className="lyrics-container" key={activeTab}>
            <hr className="lyrics-divider" />
            <div className="info-section">
              <h3>Background</h3>
              <p>{lyricsData.background}</p>
              <h3>Interpretation</h3>
              <p>{lyricsData.interpretation}</p>
            </div>
          </div>
        )}
        {activeTab === 'Test' && (
          <div className="lyrics-container" key={activeTab}>
            <hr className="lyrics-divider" />
            <div className="test-section">
              <TestTab lyricsData={lyricsData} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Song;