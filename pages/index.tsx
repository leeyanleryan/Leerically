import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import Link from "next/link";
import Head from 'next/head'
import { useRouter } from "next/router";
import { allSongs, sluggify } from "../src/app/ts/songsData";

const animatedLyrics = [
  "Lyrics",
  "歌词",      // Chinese
  "歌詞",      // Japanese
  // "가사",      // Korean
  // "Paroles",  // French
  // "Letras"    // Spanish
];

const animatedLanguages = [
  "English",
  "中文",      // Chinese
  "日本語",    // Japanese
  // "한국어",    // Korean
  // "Français", // French
  // "Español"   // Spanish
]

const Home: React.FC = () => {
  const lyricsRef = useRef<HTMLSpanElement>(null);
  const languagesRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (lyricsRef.current) {
      const typed = new Typed(lyricsRef.current, {
        strings: animatedLyrics,
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 1200,
        loop: true,
        showCursor: false
      });
      return () => typed.destroy();
    }
  }, []);

  useEffect(() => {
    if (languagesRef.current) {
      const typed = new Typed(languagesRef.current, {
        strings: animatedLanguages,
        typeSpeed: 80,
        backSpeed: 40,
        backDelay: 1200,
        loop: true,
        showCursor: false
      });
      return () => typed.destroy();
    }
  }, []);

  const router = useRouter();

  const handleRandomSong = () => {
    const slugs = allSongs.map(song =>
      `${sluggify(song.artist)}-${sluggify(song.album)}-${sluggify(song.title)}`
    );
    const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];
    router.push(`/${randomSlug}`);
  };

  return (
    <>
      <Head>
        <title>Leerically</title>
        <meta name="description" content="A platform for browsing song lyrics with detailed translations and interpretations." />
      </Head>
      <div className="hero-section darkest">
        <div className="hero-container text-icon direction-reverse">
          <div className="text left">
            <h1>Understand <span ref={lyricsRef}></span></h1>
            <p>Search lyrics, translations, and interpretations.</p>
            <div className="buttons">
              <Link href="/search" title="Search">
                <button>Search</button>
              </Link>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a href="#" onClick={e => {e.preventDefault(); handleRandomSong();}} title="Random Song">
                Random Song
              </a>
            </div>
          </div>
          <div className="icon right">
            <svg className="icon left" 
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 strokeWidth={0.5} stroke="url(#accent-gradient)"
                 width={350} height={350}>
              <defs>
                <linearGradient id="accent-gradient" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C956FF" />
                  <stop offset="1" stopColor="#FF834E" />
                </linearGradient>
              </defs>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="hero-section darker">
        <div className="hero-container text-icon direction-normal">
          <div className="icon left">
            <svg className="icon left"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 strokeWidth={0.5} stroke="url(#accent-gradient)"
                 width={350} height={350}>
              <defs>
                <linearGradient id="accent-gradient" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#C956FF" />
                  <stop offset="1" stopColor="#FF834E" />
                </linearGradient>
              </defs>
              <path
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" 
              />
            </svg>
          </div>
          <div className="text right">
            <h1>Learn <span ref={languagesRef}></span></h1>
            <p>Explore breakdowns and language tests.</p>
            <div className="buttons">
              <button>Tests</button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <a href="#" onClick={e => {e.preventDefault(); handleRandomSong();}}>
                Random Song
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;