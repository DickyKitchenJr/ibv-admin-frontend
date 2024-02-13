export const ConvertBio = (bioString) => {
  // replace &quot; with " to show on the front-end properly
  const bio = bioString.replace(/&quot;/g, '"');
  // create an array of separate strings by separating the current string every time there is a \n
  const bioArray = bio.split("\\n");

  return bioArray;
};