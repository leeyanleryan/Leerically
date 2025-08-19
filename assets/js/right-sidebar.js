// random page
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('random-page-button');
  if (!btn) return;

  // 1) grab the list of pages from your search.json
  let pageUrls = [];
  fetch('/search.json')
    .then(r => r.json())
    .then(pages => {
      pageUrls = pages.map(p => p.url);
    })
    .catch(err => {
      console.error('Could not load /search.json:', err);
    });

  // 2) on click, pick one at random and navigate
  btn.addEventListener('click', () => {
    if (!pageUrls.length) return;              // nothing loaded yet
    const randomUrl = pageUrls[
      Math.floor(Math.random() * pageUrls.length)
    ];
    window.location.href = randomUrl;
  });
});