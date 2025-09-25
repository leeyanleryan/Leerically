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
    line: string;              // original line
    romanizedLine?: string;    // romanized line (whole)
    englishLine?: string;      // english line (whole)
    word: string;              // token in the original script
    romajiToken?: string;      // token's romanization (from word bank)
    gloss: string;             // meaning shown as an option
    occurrence: number;        // nth time this token appears in the line
  };

  function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }
  function pickOne<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function HighlightNth({
    text,
    token,
    occurrence,
    className = 'lt-highlight',
    ignoreCase = false,
    wholeWord = false,
  }: {
    text: string;
    token: string;
    occurrence: number;
    className?: string;
    ignoreCase?: boolean;
    wholeWord?: boolean;
  }) {
    if (!token) return <>{text}</>;

    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const esc = escapeRegExp(token);

    // Whole-word boundaries for A–Z letters; tweak if you need diacritics.
    const before = wholeWord ? '(^|[^A-Za-z])' : '';
    const after  = wholeWord ? '(?=$|[^A-Za-z])' : '';

    const flags = ignoreCase ? 'gi' : 'g';
    const re = new RegExp(`${before}(${esc})${after}`, flags);

    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let found = 0;
    let m: RegExpExecArray | null;

    while ((m = re.exec(text)) !== null) {
      const matchIndex = m.index;
      const preLen = wholeWord ? (m[1] ? m[1].length : 0) : 0;
      const groupIndex = wholeWord ? 2 : 1;
      const matchedToken = m[groupIndex];
      if (!matchedToken) {
        // safety: advance the regex to avoid infinite loops
        re.lastIndex = matchIndex + 1;
        continue;
      }

      const tokenStart = matchIndex + preLen;
      const tokenEnd = tokenStart + matchedToken.length;

      nodes.push(text.slice(lastIndex, tokenStart));

      found += 1;
      nodes.push(
        found === occurrence
          ? <span key={tokenStart} className={className}>{matchedToken}</span>
          : matchedToken
      );

      lastIndex = tokenEnd;
      if (re.lastIndex < lastIndex) re.lastIndex = lastIndex;
    }

    nodes.push(text.slice(lastIndex));
    return <>{nodes}</>;
  }

  const TestTab: React.FC<{ lyricsData: LyricsData }> = ({ lyricsData }) => {
    // Build the pool once
    const pool = React.useMemo(() => {
      if (!Array.isArray(lyricsData.lyrics)) {
        return { lines: [] as { line: string; items: GlossItem[] }[], allGlosses: [] as string[] };
      }

      const lines: { line: string; items: GlossItem[] }[] = [];
      const allGlossesSet = new Set<string>();

      for (const entry of lyricsData.lyrics as LyricsEntry[]) {
        if (entry.divider) continue;
        if (!entry.explanation) continue;

        const exps = parseExplanation(entry.explanation);
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
            romanizedLine: entry.romanized,
            englishLine: entry.english,
            word: e.word,
            romajiToken: info.romanized && info.romanized !== '-' ? info.romanized : undefined,
            gloss,
            occurrence: n,
          });
          allGlossesSet.add(gloss);
        }

        if (items.length) lines.push({ line: entry.original, items });
      }

      return { lines, allGlosses: Array.from(allGlossesSet) };
    }, [lyricsData]);

    const totalItems = React.useMemo(
      () => pool.lines.reduce((acc, l) => acc + l.items.length, 0),
      [pool]
    );
    const ready = totalItems >= 1 && pool.allGlosses.length >= 2;

    type Question = {
      line: string;        // original
      rline: string;       // romanized
      eline: string;       // english
      token: string;       // original token
      romajiToken: string; // romanized token (for highlighting)
      occurrence: number;
      correct: string;
      options: string[];
    };

    const makeQuestion = React.useCallback((): Question | null => {
      if (!ready) return null;

      const line = pickOne(pool.lines);
      const item = pickOne(line.items);

      const distractorPool = pool.allGlosses.filter((g) => g !== item.gloss);
      const distractors = shuffle(distractorPool).slice(0, 3);
      const options = shuffle([item.gloss, ...distractors]).slice(0, 4);

      return {
        line: item.line,
        rline: item.romanizedLine ?? '',
        eline: item.englishLine ?? '',
        token: item.word,
        romajiToken: item.romajiToken ?? '',
        occurrence: item.occurrence,
        correct: item.gloss,
        options,
      };
    }, [pool, ready]);

    const [q, setQ] = React.useState<Question | null>(makeQuestion);
    const [picked, setPicked] = React.useState<string | null>(null);
    const [hintOpen, setHintOpen] = React.useState(false);

    const next = () => {
      setPicked(null);
      setHintOpen(false);
      setQ(makeQuestion());
    };

    if (!ready || !q) {
      return (
        <div className="lt-test-empty">
          <p>Not enough annotated lyrics to generate a test. Add more <code>explanation</code> rows and try again.</p>
        </div>
      );
    }

    const isCorrect = (opt: string) => picked !== null && opt === q.correct;
    const isWrongPick = (opt: string) => picked !== null && picked === opt && opt !== q.correct;

    return (
      <>
        <h3 className="lt-test-title">Pick the meaning of the highlighted word</h3>

        <div className="lt-test-card">
          {/* Original sentence */}
          <div className="lt-test-sentence">
            <HighlightNth text={q.line} token={q.token} occurrence={q.occurrence} />
          </div>

          {/* Hints block (romanized + english), covered until revealed */}
          {(q.rline || q.eline) && (
            <div className="lt-hint">
              <div className="lt-hint-inner" data-covered={!hintOpen}>
                {q.rline && (
                  <div className="lt-hint-line lt-hint-romanized">
                    {/* highlight matching token in romanized if available */}
                    {q.romajiToken
                      ? <HighlightNth text={q.rline} token={q.romajiToken} occurrence={q.occurrence} ignoreCase wholeWord />
                      : q.rline}
                  </div>
                )}
                {q.eline && (
                  <div className="lt-hint-line lt-hint-english">
                    {q.eline}
                  </div>
                )}

                {!hintOpen && (
                  <button
                    type="button"
                    className="lt-hint-cover"
                    onClick={() => setHintOpen(true)}
                    aria-label="Show hint"
                  >
                    <span>💡 Hint</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options */}
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
            <button className="lt-next-btn" onClick={next}>Next Question</button>
          </div>
        </div>
      </>
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
        <h1>{lyricsData.artist} - {lyricsData.title}</h1>
        {/* <h2>{lyricsData.artist} - {lyricsData.album}</h2> */}
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