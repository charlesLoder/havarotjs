const nonChars = /[\u{0591}-\u{05C7}]/gu;

export const isDivineName = (text: string): boolean => {
  return text.replace(nonChars, "") === "יהוה";
};

export const hasDivineName = (text: string): boolean => {
  return /יהוה/.test(text.replace(nonChars, ""));
};
