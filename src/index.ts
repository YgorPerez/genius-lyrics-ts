import { Options, checkOptions } from "./utils";
import extractsLyrics from "./utils/extractsLyrics";
import searchSong from "./utils/searchSong";

/**
 * @param {({apiKey: string, title: string, artist: string, optimizeQuery: boolean}|string)} arg - options object, or Genius URL
 */

async function getLyrics(arg: Options) {
  try {
    checkOptions(arg);
    let result = await searchSong(arg);
    if (!result) return null;
    let lyrics = await extractsLyrics(result.url);
    return lyrics;
  } catch (e) {
    throw e;
  }
}

export default getLyrics;
