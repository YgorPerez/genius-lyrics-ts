import { Options, checkOptions, getTitle } from ".";

const searchUrl = "https://api.genius.com/search?q=";

async function searchSong(options: Options) {
  try {
    checkOptions(options);
    let { apiKey, title, artist, optimizeQuery = false } = options;
    const song = optimizeQuery ? getTitle(title, artist) : `${title} ${artist}`;
    const reqUrl = `${searchUrl}${encodeURIComponent(song)}`;
    const headers = {
      Authorization: "Bearer " + apiKey,
    };
    const response = await fetch(`${reqUrl}&access_token=${apiKey}`, {
      method: "GET",
      headers: new Headers(headers),
    });
    const data = await response.json();
    if (data.response.hits.length === 0) return null;
    const results = data.response.hits.map(
      (val: {
        result: {
          full_title: string;
          song_art_image_url: string;
          id: string;
          url: string;
        };
      }) => {
        const { full_title, song_art_image_url, id, url } = val.result;
        return { id, title: full_title, albumArt: song_art_image_url, url };
      }
    );
    return results;
  } catch (e) {
    throw e;
  }
}

export default searchSong;
