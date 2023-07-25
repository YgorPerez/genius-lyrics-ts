import { parse } from "node-html-parser";
import { getTitle } from "./utils";

export type searchQuery = {
  title: string;
  artist?: string;
  optimizeQuery?: boolean;
};

async function getLyrics({ title, artist, optimizeQuery }: searchQuery) {
  try {
    const searchUrl = "https://www.google.com/search?q=";
    !artist ? (artist = "") : null;
    const song = optimizeQuery ? getTitle(title, artist) : `${title} ${artist}`;
    const reqUrl = `${searchUrl}${encodeURIComponent(
      (song + " lyrics").trim()
    )}`;

    const response = await fetch(reqUrl);
    const html = await response.text();
    const htmlDocument = parse(html);
    let lyrics = htmlDocument
      .querySelector("[data-lyricid]")
      ?.innerText?.trim();

    if (!lyrics) return null;
    return lyrics;
  } catch (e) {
    throw e;
  }
}

export default getLyrics;
