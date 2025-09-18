import React, { useEffect, useRef } from "react";

const About: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      <div className="hero-section darkest">
        <div className="hero-container text-box direction-normal">
          <div className="text center">
            <h1>Purpose</h1>
            <div className="box">
              <p>
                Leerically is a free platform designed to help you understand song lyrics of various languages. 
                Whether you're a music lover, language learner, or just curious about the meaning behind your favorite tracks, 
                Leerically makes it easy to search for lyrics, view translations, explore interpretations, and test yourself in multiple languages.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-section darker">
        <div className="hero-container text-icon direction-reverse">
          <div className="text left">
            <h1>Attributions</h1>
            <p>
              Icons taken from&nbsp;
              <a href="https://www.flaticon.com/" title="Flaticon">Flaticon</a> 
              &nbsp;and&nbsp;
              <a href="https://www.heroicons.com/" title="Heroicons">Heroicons</a>. 
            </p>
          </div>
          <div id="circleWaveformContainer" className="icon right">
            <canvas id="circleWaveform" className="icon right" ref={canvasRef} width={350} height={350} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;