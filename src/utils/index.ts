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
