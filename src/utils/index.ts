export const getTitle = (title: string, artist?: string) => {
  return `${title} ${artist}`
    .toLowerCase()
    .replace(/ *\([^)]*\) */g, "")
    .replace(/ *\[[^\]]*]/, "")
    .replace(/feat.|ft./g, "")
    .replace(/\s+/g, " ")
    .trim();
};
