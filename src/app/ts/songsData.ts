export const allSongs = [
  { artist: "Aimer", album: "Penny Rain", title: "Ref:rain", language: "Japanese" },
  { artist: "BABYMETAL", album: "METAL RESISTANCE", title: "No Rain No Rainbow", language: "Japanese" },
  { artist: "THE ORAL CIGARETTES", album: "BLACK MEMORY", title: "Flower", language: "Japanese" },
  { artist: "THE ORAL CIGARETTES", album: "FIXION", title: "Amy", language: "Japanese" },
].sort((a, b) => {
  const artistCmp = a.artist.localeCompare(b.artist);
  if (artistCmp !== 0) return artistCmp;
  const albumCmp = a.album.localeCompare(b.album);
  if (albumCmp !== 0) return albumCmp;
  return a.title.localeCompare(b.title);
});

export function sluggify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
}