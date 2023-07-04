import { parse } from "node-html-parser";
import { decodeHTMLEntities } from ".";

/**
 * @param {string} url - Genius URL
 */

async function extractsLyrics(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const htmlDocument = parse(html);
    let lyrics = htmlDocument
      .querySelector('div[class="lyrics"]')
      ?.textContent?.trim();

    if (!lyrics) {
      lyrics = "";
      htmlDocument
        .querySelectorAll('div[class^="Lyrics__Container"]')
        .forEach((elem) => {
          if (elem && elem.textContent?.length !== 0) {
            let snippet = elem.innerHTML
              ?.replace(/<br>/g, "\n")
              .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
            snippet = decodeHTMLEntities(elem, snippet);
            lyrics += snippet;
            htmlDocument.querySelector("textarea")?.textContent + "\n\n";
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
