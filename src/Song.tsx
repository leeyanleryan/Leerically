import yaml from 'js-yaml';

function getSongSlugFromUrl(path: string) {
  // Remove leading slash and extension if present
  return path.replace(/^\//, '').replace(/\.yml$/, '');
}

async function fetchLyrics(slug: string) {
  const response = await fetch(`/lyrics/${slug}.yml`);
  const text = await response.text();
  return yaml.load(text);
}

const slug = getSongSlugFromUrl(location.pathname);
const lyrics = await fetchLyrics(slug);