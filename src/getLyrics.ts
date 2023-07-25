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
    const reqUrl = `${searchUrl}${encodeURIComponent(song + " lyrics")}`;

    const response = await fetch(reqUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.3; Win64; x64)   AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36 Viewer/96.9.4688.89",
      },
    });
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
