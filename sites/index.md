---
layout: default
title: Home
permalink: /
---

<!-- Hero section with centered max-width container -->
<div style="background:#181820; position:relative; height:100vh; display:flex; align-items:center; justify-content:center; overflow:hidden;">
  <div style="width:100%; max-width:1200px; margin:0 auto; padding:0 16px; display:flex; align-items:center; justify-content:space-between;">
    <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:flex-start; z-index:2; text-align:left; margin-left: 30px;">
      <h1 style="color:#fff; font-size:3rem; font-weight:800; letter-spacing:.02em; margin-bottom:12px;">Accurate Lyrics</h1>
      <p style="color:#CCCCCC; font-size:1.3rem; margin-top:12px; max-width:450px;">
        Search lyrics, translations, and interpretations.
      </p>
      <div style="margin-top:24px;">
        <button style="background:linear-gradient(90deg,#C956FF,#FF834E); color:#fff; border:none; border-radius:999px; padding:12px 32px; font-size:1rem; font-weight:600; cursor:pointer;">Random song</button>
        <a href="/submit" style="color:#C956FF; margin-left:18px; font-size:1rem; text-decoration:underline;">Submit correction</a>
      </div>
    </div>
    <div style="width:350px; height:350px; display:flex; justify-content:center; align-items:center; position:relative;">
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

<section class="featured">
  <h2>Featured</h2>
</section>

<section class="recent">
  <h2>Recently added / updated</h2>
</section>

<section class="catalog">
  <h2>Browse songs</h2>
</section>

<footer>

</footer>