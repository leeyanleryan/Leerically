import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import "./Home.css";

const animatedLyrics = [
  "Lyrics",
  "歌詞",      // Japanese
  "가사",      // Korean
  "Paroles",  // French
  "Letras"    // Spanish
];

const animatedLanguages = [
  "English",
  "日本語",    // Japanese
  "한국어",    // Korean
  "Français", // French
  "Español"   // Spanish
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

  return (
    <div>
      <div className="home-bg">
        <div className="hero-container">
          <div className="hero-left">
            <h1>
              Understand <span ref={lyricsRef}></span>
            </h1>
            <p>
              Search lyrics, translations, and interpretations.
            </p>
            <div className="hero-buttons">
              <button>
                Search
              </button>
              <a href="/submit">
                Random Song
              </a>
            </div>
          </div>
          <div id="circleWaveformContainer">
            <canvas id="circleWaveform" ref={canvasRef} width={350} height={350} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;