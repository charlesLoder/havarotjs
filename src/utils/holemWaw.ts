import { removeTaamei } from "./removeTaamei";

export const holemWaw = (word: string): string => {
  const wawRegX = /\u{05D5}/u;
  const holemRegx = /\u{05B9}/u;
  const holemHaser = /\u{05BA}/u;
  const wawHolemRegX = /\u{05D5}\u{05B9}/u;
  const vowels = /[\u{05B0}-\u{05BB},\u{05C7}]/u;
  const vowelBeforeWawHolem = new RegExp("(?<!" + vowels.source + ")" + wawHolemRegX.source, "u");

  // replace holem haser with regular holem
  if (holemHaser.test(word)) {
    word = word.replace(holemHaser, "\u{05B9}");
  }
  // if there is no waw or holem, there is nothing to check
  if (!wawRegX.test(word) || !holemRegx.test(word)) {
    return word;
  }

  const [noTaamei, charPos] = removeTaamei(word);

  // check for the waw + holem pattern
  if (!wawHolemRegX.test(noTaamei)) {
    return word;
  }

  // check for waw + holem preceded by vowel
  const match = noTaamei.match(vowelBeforeWawHolem);
  if (!match) {
    return word;
  } else {
    const start = charPos[match.index!];
    const end = charPos[match[0].length] + start;
    const matched = word.substring(start, end);
    const withWawHolem = matched.split(wawHolemRegX).join("\u{05B9}\u{05D5}");
    word = word.split(matched).join(withWawHolem);
    return word;
  }
};
