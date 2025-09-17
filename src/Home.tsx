import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import { useNavigate } from "react-router-dom";
import "./Home.css";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 140;

    function drawCircleWave() {
      if (!ctx) return;
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const gradient = ctx.createLinearGradient(0,0,canvas.width,0);
      gradient.addColorStop(0, "#C956FF");
      gradient.addColorStop(1, "#FF834E");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 8;
      ctx.beginPath();
      for(let i=0; i<=360; i+=2){
        let angle = (i * Math.PI) / 180;
        let wave = Math.sin(angle * 4 + Date.now()/500) * 18;
        let r = radius + wave;
        let x = centerX + r * Math.cos(angle);
        let y = centerY + r * Math.sin(angle);
        if(i===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
      requestAnimationFrame(drawCircleWave);
    }
    drawCircleWave();
  }, []);

  const navigate = useNavigate();

  return (
    <div>
      <div className="hero-section darkest">
        <div className="hero-container text-icon direction-reverse">
          <div className="text left">
            <h1>Understand <span ref={lyricsRef}></span></h1>
            <p>Search lyrics, translations, and interpretations.</p>
            <div className="buttons">
              <button onClick={() => navigate("/search")}>Search</button>
              <a href="/submit">Random Song</a>
            </div>
          </div>
          <div id="circleWaveformContainer" className="icon right">
            <canvas id="circleWaveform" className="icon right" ref={canvasRef} width={350} height={350} />
          </div>
        </div>
      </div>

      <div className="hero-section darker">
        <div className="hero-container text-icon direction-normal">
          <div className="icon left">
            {/* SVG Icon taken from https://heroicons.com. 
                The only thing that changes is d="..." */}
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
          <div className="text right">
            <h1>Learn <span ref={languagesRef}></span></h1>
            <p>Explore breakdowns and language tests.</p>
            <div className="buttons">
              <button>Tests</button>
              <a href="/submit">Random Song</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;