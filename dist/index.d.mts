type Options = {
    apiKey: string;
    title: string;
    artist: string;
    optimizeQuery: boolean;
};

/**
 * @param {({apiKey: string, title: string, artist: string, optimizeQuery: boolean}|string)} arg - options object, or Genius URL
 */
declare function getLyrics(arg: Options): Promise<string | null>;

export { getLyrics as default };
