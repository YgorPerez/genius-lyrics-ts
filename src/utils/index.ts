export type Options = {
  apiKey: string;
  title: string;
  artist: string;
  optimizeQuery: boolean;
};

export const checkOptions = (options: Options) => {
  let { apiKey, title, artist } = options;
  if (!apiKey) {
    throw '"apiKey" property is missing from options';
  } else if (!title) {
    throw '"title" property is missing from options';
  } else if (!artist) {
    throw '"artist" property is missing from options';
  }
};

export const getTitle = (title: string, artist: string) => {
  return `${title} ${artist}`
    .toLowerCase()
    .replace(/ *\([^)]*\) */g, "")
    .replace(/ *\[[^\]]*]/, "")
    .replace(/feat.|ft./g, "")
    .replace(/\s+/g, " ")
    .trim();
};
