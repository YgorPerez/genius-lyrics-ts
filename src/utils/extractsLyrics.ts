import { load } from "cheerio";

/**
 * @param {string} url - Genius URL
 */
async function extractsLyrics(url: string) {
  try {
    let response = await fetch(url);
    const data = await response.text();
    const $ = load(data);
    let lyrics: string = $('div[class="lyrics"]').text().trim();
    if (!lyrics) {
      lyrics = "";
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0 && elem) {
          // @ts-ignore
          let snippet = $(elem)
            .html()
            .replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
    }
    if (!lyrics) return null;
    return lyrics.trim();
  } catch (e) {
    throw e;
  }
}

export default extractsLyrics;
