export const allSongs = [
  { artist: "Aimer", album: "Penny Rain", title: "Ref:rain", year: 2019, language: "Japanese" },
  { artist: "BABYMETAL", album: "METAL RESISTANCE", title: "No Rain No Rainbow", year: 2016, language: "Japanese" },
  { artist: "THE ORAL CIGARETTES", album: "BLACK MEMORY", title: "Flower", year: 2017, language: "Japanese" },
  { artist: "THE ORAL CIGARETTES", album: "FIXION", title: "Amy", year: 2016, language: "Japanese" },
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