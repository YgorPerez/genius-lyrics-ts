import { Options, checkOptions, getTitle } from ".";

const searchUrl = "https://api.genius.com/search?q=";

type Result = {
  full_title: string;
  song_art_image_url: string;
  id: string;
  url: string;
};

async function searchSong(options: Options) {
  try {
    checkOptions(options);
    let { apiKey, title, artist, optimizeQuery = true } = options;

    if (!title && !artist) return null;

    const song = optimizeQuery ? getTitle(title, artist) : `${title} ${artist}`;
    if (!song) return null;
    const reqUrl = `${searchUrl}${encodeURIComponent(song)}`;
    const data = await (await fetch(`${reqUrl}&access_token=${apiKey}`)).json();

    const hits = data.response.hits;
    if (hits.length === 0) return null;
    const result = hits[0].result as Result;
    const { full_title, song_art_image_url, id, url } = result;
    return { id, title: full_title, albumArt: song_art_image_url, url };
  } catch (e) {
    throw e;
  }
}

export default searchSong;
