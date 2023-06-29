"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

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
var cheerio = __toESM(require("cheerio"));
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
