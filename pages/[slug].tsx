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
  explanation: Array<string>;
};

type LyricsData = {
  title: string;
  artist: string;
  album: string;
  language: string;
  lyrics: LyricsEntry[] | string;
};

type SongProps = {
  lyricsData: LyricsData;
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
    return yaml.load(file);
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
  return {
    props: {
      lyricsData,
    },
  };
};

const Song: React.FC<SongProps> = ({ lyricsData }) => {
  if (!lyricsData) {
    return <NotFound />;
  }

  return (
    <>
      <Head>
        <title>
          {`Leerically | ${lyricsData.artist} - ${lyricsData.title} Lyrics`}
        </title>
        <meta
          name="description"
          content={
            lyricsData.language !== "en"
              ? `Fully translated lyrics for ${lyricsData.title} by ${lyricsData.artist}.`
              : `Lyrics for ${lyricsData.title} by ${lyricsData.artist}.`
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
                <div key={idx} className="lyrics-text">
                  {entry.original && <div className="original">{entry.original}</div>}
                  {entry.romanized && (<div className="romanized">{entry.romanized}</div>)}
                  {entry.english && (<div className="english">{entry.english}</div>)}
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