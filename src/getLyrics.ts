import { parse } from "node-html-parser";

export const getTitle = (title: string, artist: string) => {
  return `${title} ${artist}`
    .toLowerCase()
    .replace(/ *\([^)]*\) */g, "")
    .replace(/ *\[[^\]]*]/, "")
    .replace(/feat.|ft./g, "")
    .replace(/\s+/g, " ")
    .trim();
};

async function getLyrics({
  title,
  artist,
  optimizeQuery,
}: {
  title: string;
  artist?: string;
  optimizeQuery?: boolean;
}) {
  try {
    const searchUrl = "https://www.google.com/search?q=";
    !artist ? (artist = "") : null;
    const song = optimizeQuery ? getTitle(title, artist) : `${title} ${artist}`;
    const reqUrl = `${searchUrl}${encodeURIComponent(song + " lyrics")}`;

    const response = await fetch(reqUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept-Language": "en-US, en;q=0.9",
      },
    });
    const html = await response.text();
    const htmlDocument = parse(html, {
      blockTextElements: {
        noscript: true,
      },
    });
    const lyrics = htmlDocument
      .querySelector("[data-lyricid]")
      ?.structuredText?.trim();

    if (!lyrics) return null;
    return lyrics;
  } catch (error) {
    throw error;
  }
}

export default getLyrics;
