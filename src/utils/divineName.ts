export const isDivineName = (text: string): boolean => {
  const nonChars = /[\u{0591}-\u{05C7}]/gu;
  return text.replace(nonChars, "") === "יהוה";
};
