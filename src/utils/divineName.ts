const nonChars = /[^\u{05D0}-\u{05F4}]/gu;

export const isDivineName = (text: string): boolean => {
  return text.replace(nonChars, "") === "יהוה";
};

export const hasDivineName = (text: string): boolean => {
  return /יהוה/.test(text.replace(nonChars, ""));
};
