import { removeTaamim } from "./removeTaamim";

export const holemWaw = (word: string): string => {
  const wawRegX = /\u{05D5}/u;
  const holemRegx = /\u{05B9}/u;
  const holemHaser = /\u{05BA}/u;
  const wawHolemRegX = /\u{05D5}\u{05B9}/u;
  const vowels = /[\u{05B0}-\u{05BB}\u{05C7}]/u;
  const vowelBeforeWawHolem = new RegExp("(?<!" + vowels.source + ")" + wawHolemRegX.source, "gu");

  // replace holem haser with regular holem
  if (holemHaser.test(word)) {
    word = word.replace(holemHaser, "\u{05B9}");
  }
  // if there is no waw or holem, there is nothing to check
  if (!wawRegX.test(word) || !holemRegx.test(word)) {
    return word;
  }

  const [noTaamim, charPos] = removeTaamim(word);

  // check for the waw + holem pattern
  if (!wawHolemRegX.test(noTaamim)) {
    return word;
  }

  // check for waw + holem preceded by vowel
  const matches = noTaamim.matchAll(vowelBeforeWawHolem);
  if (!matches) {
    return word;
  }

  for (const match of matches) {
    const start = charPos[match.index!]; // eslint-disable-line
    const end = charPos[match[0].length] + start;
    word =
      word.substring(0, start) +
      "\u{05B9}\u{05D5}" +
      (word.substring(end) || word.substring(end - 1)).replace(holemRegx, "");
  }

  return word;
};
