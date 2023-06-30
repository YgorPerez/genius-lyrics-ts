export type Options = {
  apiKey: string;
  title?: string;
  artist?: string;
  optimizeQuery?: boolean;
};

export const checkOptions = (options: Options) => {
  let { apiKey, title, artist } = options;
  if (!apiKey) {
    throw '"apiKey" property is missing from options';
  }
  if (!title && !artist) {
    throw '"title" and "artist" property is missing from options';
  }
};

export const getTitle = (title?: string, artist?: string) => {
  const validateTitle = title ?? "";
  const validateArtist = artist ?? "";
  if (validateTitle === "" && validateArtist === "") {
    return "";
  }
  return `${validateTitle} ${validateArtist}`
    .toLowerCase()
    .replace(/ *\([^)]*\) */g, "")
    .replace(/ *\[[^\]]*]/, "")
    .replace(/feat.|ft./g, "")
    .replace(/\s+/g, " ")
    .trim();
};
