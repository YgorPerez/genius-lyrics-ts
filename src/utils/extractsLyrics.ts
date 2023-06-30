import { JSDOM } from "jsdom";
/**
 * @param {string} url - Genius URL
 */
async function extractsLyrics(url: string) {
  try {
    let response = await fetch(url);
    const html = await response.text();
    const htmlDocument = new JSDOM(html).window.document;

    let lyrics = htmlDocument
      .querySelector('div[class="lyrics"]')
      ?.textContent?.trim();

    if (!lyrics) {
      lyrics = "";
      htmlDocument
        .querySelectorAll('div[class^="Lyrics__Container"]')
        .forEach((elem) => {
          if (elem && elem.textContent?.length !== 0) {
            let snippet = elem.textContent
              ?.replace(/<br>/g, "\n")
              .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "") as string;

            lyrics +=
              snippet +
              document.querySelector("<textarea/>")?.textContent?.trim() +
              "\n\n";
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
