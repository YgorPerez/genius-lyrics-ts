// src/utils/index.ts
var checkOptions = (options) => {
  let { apiKey, title, artist } = options;
  if (!apiKey) {
    throw '"apiKey" property is missing from options';
  } else if (!title) {
    throw '"title" property is missing from options';
  } else if (!artist) {
    throw '"artist" property is missing from options';
  }
};
var getTitle = (title, artist) => {
  return `${title} ${artist}`.toLowerCase().replace(/ *\([^)]*\) */g, "").replace(/ *\[[^\]]*]/, "").replace(/feat.|ft./g, "").replace(/\s+/g, " ").trim();
};

// src/utils/extractsLyrics.ts
import * as cheerio from "cheerio";
async function extractsLyrics(url) {
  try {
    let response = await fetch(url, { method: "GET" });
    const data = await response.json();
    const $ = cheerio.load(data);
    let lyrics = $('div[class="lyrics"]').text().trim();
    if (!lyrics) {
      lyrics = "";
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0 && elem) {
          let snippet = $(elem).html().replace(/<br>/g, "\n").replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
    }
    if (!lyrics)
      return null;
    return lyrics.trim();
  } catch (e) {
    throw e;
  }
}
var extractsLyrics_default = extractsLyrics;

// src/utils/searchSong.ts
var searchUrl = "https://api.genius.com/search?q=";
async function searchSong(options) {
  try {
    checkOptions(options);
    let { apiKey, title, artist, optimizeQuery = false } = options;
    const song = optimizeQuery ? getTitle(title, artist) : `${title} ${artist}`;
    const reqUrl = `${searchUrl}${encodeURIComponent(song)}`;
    const headers = {
      Authorization: "Bearer " + apiKey
    };
    const response = await fetch(`${reqUrl}&access_token=${apiKey}`, {
      method: "GET",
      headers: new Headers(headers)
    });
    const data = await response.json();
    if (data.response.hits.length === 0)
      return null;
    const results = data.response.hits.map(
      (val) => {
        const { full_title, song_art_image_url, id, url } = val.result;
        return { id, title: full_title, albumArt: song_art_image_url, url };
      }
    );
    return results;
  } catch (e) {
    throw e;
  }
}
var searchSong_default = searchSong;

// src/index.ts
async function getLyrics(arg) {
  try {
    checkOptions(arg);
    let results = await searchSong_default(arg);
    if (!results)
      return null;
    let lyrics = await extractsLyrics_default(results[0].url);
    return lyrics;
  } catch (e) {
    throw e;
  }
}
var src_default = getLyrics;
export {
  src_default as default
};
