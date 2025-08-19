document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lyrics-stanza').forEach(stanza => {
    stanza.style.cursor = 'pointer';
    stanza.addEventListener('click', () => {
    const id = stanza.getAttribute('data-idx');
    const box = document.getElementById(`exp-${id}`);
    box.style.display = box.style.display === 'block' ? 'none' : 'block';
    });
  });
});

document.querySelectorAll('.no-hover-background-after-click').forEach(stanza => {
  stanza.addEventListener('touchstart', () => {
    stanza.classList.add('touch-active');
    setTimeout(() => stanza.classList.remove('touch-active'), 200);
  });
});

(function() {
  // 1) load saved settings or default→true
  const settings = {
    original:  JSON.parse(localStorage.getItem('showOriginal')  ?? 'true'),
    romanized: JSON.parse(localStorage.getItem('showRomanized') ?? 'true'),
    english:   JSON.parse(localStorage.getItem('showEnglish')   ?? 'true')
  };

  // 2) update visibility & button text
  function update() {
    document.querySelectorAll('.lt-original-text')
            .forEach(el => el.style.display = settings.original ? '' : 'none');
    document.querySelectorAll('.lt-romanized-text')
            .forEach(el => el.style.display = settings.romanized ? '' : 'none');
    document.querySelectorAll('.lt-english-text')
            .forEach(el => el.style.display = settings.english ? '' : 'none');

    const allOff = !settings.original && !settings.romanized && !settings.english;
    document.querySelectorAll('.lt-english-text-only').forEach(el => el.style.display = allOff ? 'none' : '');

    document.getElementById('lt-toggle-original').textContent  = settings.original  ? 'Hide Original'  : 'Show Original';
    document.getElementById('lt-toggle-romanized').textContent = settings.romanized ? 'Hide Romanized' : 'Show Romanized';
    document.getElementById('lt-toggle-english').textContent   = settings.english   ? 'Hide English'   : 'Show English';
  }

  // 3) wire up buttons
  document.getElementById('lt-toggle-original')
          .addEventListener('click', () => {
    settings.original = !settings.original;
    localStorage.setItem('showOriginal', settings.original);
    update();
  });
  document.getElementById('lt-toggle-romanized')
          .addEventListener('click', () => {
    settings.romanized = !settings.romanized;
    localStorage.setItem('showRomanized', settings.romanized);
    update();
  });
  document.getElementById('lt-toggle-english')
          .addEventListener('click', () => {
    settings.english = !settings.english;
    localStorage.setItem('showEnglish', settings.english);
    update();
  });

  // 4) initial paint
  update();
})();