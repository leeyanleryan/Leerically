---
layout: default
title: Home
permalink: /
---

<style>
.hero-left h1 {
  line-height: 1.1;
  min-height: 56px;
}
@media (max-width: 900px) {
  .hero-container {
    flex-direction: column-reverse !important;
    align-items: center !important;
    justify-content: center !important;
  }
  .hero-left {
    margin-left: 0 !important;
    align-items: center !important;
    text-align: center !important;
  }
}
@media (max-width: 500px) {
  .hero-left h1 {
    font-size: 2.0rem !important;
    margin-bottom: 0 !important;
  }
  .hero-left p {
    font-size: 1.0rem !important;
    margin-top: 0 !important;
  }
  .hero-left button {
    padding: 10px 24px !important;
    font-size: 1.0rem !important;
  }
  .hero-left a {
    font-size: 1.0rem !important;
    margin-left: 12px !important;
  }
  #circleWaveformContainer {
    width: 300px !important;
    height: 300px !important;
    margin-bottom: 24px !important;
  }
  #circleWaveform {
    width: 300px !important;
    height: 300px !important;
  }
}
@media (max-width: 400px) {
  .hero-left h1 {
    line-height: 0.8 !important;
    min-height: 40px !important;
    font-size: 1.6rem !important;
    margin-bottom: 0 !important;
  }
  .hero-left p {
    font-size: 0.8rem !important;
    margin-top: 0 !important;
  }
  .hero-left button {
    padding: 8px 20px !important;
    font-size: 0.8rem !important;
  }
  .hero-left a {
    font-size: 0.8rem !important;
    margin-left: 8px !important;
  }
  #circleWaveformContainer {
    width: 250px !important;
    height: 250px !important;
  }
  #circleWaveform {
    width: 250px !important;
    height: 250px !important;
  }
}
</style>

<div style="background:var(--dark-mode-background-color); position:relative; height:100vh; display:flex; align-items:center; justify-content:center; overflow:hidden;">
  <div class="hero-container" style="width:100%; max-width:1100px; margin:0 auto; padding:0 16px; display:flex; align-items:center; justify-content:space-between;">
    <div class="hero-left" style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; z-index:2; text-align:left; margin-left: 25px;">
      <h1 style="color:#fff; font-size:3rem; font-weight:800; margin-bottom:12px;">
        Understand <span id="animated-lyrics"></span>
      </h1>
      <p style="color:#CCCCCC; font-size:1.3rem; margin-top:12px; max-width:450px;">
        Search lyrics, translations, and interpretations.
      </p>
      <div style="margin-top:24px;">
        <button style="background:linear-gradient(90deg,#C956FF,#FF834E); color:#fff; border:none; border-radius:999px; padding:12px 32px; font-size:1rem; font-weight:600; cursor:pointer;">
          Search
        </button>
        <a href="/submit" style="color:#C956FF; margin-left:18px; font-size:1rem; text-decoration:underline;">
          Random Song
        </a>
      </div>
    </div>
    <div id="circleWaveformContainer" style="width:350px; height:350px; display:flex; justify-content:center; align-items:center; position:relative;">
      <canvas id="circleWaveform" width="350" height="350" style="z-index:1;"></canvas>
    </div>
  </div>
</div>

<script>
const canvas = document.getElementById('circleWaveform');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 140;
function drawCircleWave() {
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
</script>

<script src="https://cdn.jsdelivr.net/npm/typed.js@2.0.12"></script>

<script>
document.addEventListener("DOMContentLoaded", function() {
  new Typed("#animated-lyrics", {
    strings: [
      "Lyrics",
      "歌詞",      // Japanese
      "가사",      // Korean
      "Paroles",  // French
      "Letras"    // Spanish
    ],
    typeSpeed: 80,
    backSpeed: 40,
    backDelay: 1200,
    loop: true,
    showCursor: false
  });
});
</script>