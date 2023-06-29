import { Options, checkOptions } from "./utils";
import extractsLyrics from "./utils/extractsLyrics";
import searchSong from "./utils/searchSong";

/**
 * @param {({apiKey: string, title: string, artist: string, optimizeQuery: boolean}|string)} arg - options object, or Genius URL
 */

async function getLyrics(arg: Options) {
  try {
    checkOptions(arg);
    let results = await searchSong(arg);
    if (!results) return null;
    let lyrics = await extractsLyrics(results[0].url);
    return lyrics;
  } catch (e) {
    throw e;
  }
}

export default getLyrics;
