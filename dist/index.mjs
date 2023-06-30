// src/utils/index.ts
var checkOptions = (options) => {
  let { apiKey, title, artist } = options;
  if (!apiKey) {
    throw '"apiKey" property is missing from options';
  }
  if (!title && !artist) {
    throw '"title" and "artist" property is missing from options';
  }
};
var getTitle = (title, artist) => {
  const validateTitle = title ?? "";
  const validateArtist = artist ?? "";
  if (validateTitle === "" && validateArtist === "") {
    return "";
  }
  return `${validateTitle} ${validateArtist}`.toLowerCase().replace(/ *\([^)]*\) */g, "").replace(/ *\[[^\]]*]/, "").replace(/feat.|ft./g, "").replace(/\s+/g, " ").trim();
};

// src/utils/extractsLyrics.ts
import * as cheerio from "cheerio";
async function extractsLyrics(url) {
  try {
    let response = await fetch(url);
    const data = await response.text();
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
    let { apiKey, title, artist, optimizeQuery = true } = options;
    if (!title && !artist)
      return null;
    const song = optimizeQuery ? getTitle(title, artist) : `${title} ${artist}`;
    if (!song)
      return null;
    const reqUrl = `${searchUrl}${encodeURIComponent(song)}`;
    const data = await (await fetch(`${reqUrl}&access_token=${apiKey}`)).json();
    const hits = data.response.hits;
    if (hits.length === 0)
      return null;
    const result = hits[0].result;
    const { full_title, song_art_image_url, id, url } = result;
    return { id, title: full_title, albumArt: song_art_image_url, url };
  } catch (e) {
    throw e;
  }
}
var searchSong_default = searchSong;

// src/index.ts
async function getLyrics(arg) {
  try {
    checkOptions(arg);
    let result = await searchSong_default(arg);
    if (!result)
      return null;
    let lyrics = await extractsLyrics_default(result.url);
    return lyrics;
  } catch (e) {
    throw e;
  }
}
var src_default = getLyrics;
export {
  src_default as default
};
