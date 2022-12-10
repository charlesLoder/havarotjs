import { removeTaamim } from "./removeTaamim";
import { SylOpts } from "../text";
import { taamim } from "./regularExpressions";

const findMatches = (word: string, regx: RegExp, cb: (w: string, s: number, e: number) => string) => {
  regx.lastIndex = 0;
  const [noTaamim, charPos] = removeTaamim(word);
  const matches = noTaamim.matchAll(regx);
  if (!matches) {
    return word;
  }

  for (const match of matches) {
    const start = charPos[match.index!]; // eslint-disable-line
    const end = charPos[match[0].length] + start;
    word = cb(word, start, end);
  }
  regx.lastIndex = 0;
  return word;
};

export const holemWaw = (word: string, options: SylOpts): string => {
  const wawRegX = /\u{05D5}/u;
  const holemRegx = /\u{05B9}/u;
  const holemHaser = /\u{05BA}/u;
  const wawHolemRegX = /\u{05D5}\u{05B9}/u;
  const vowels = /[\u{05B0}-\u{05BB}\u{05C7}]/u;
  /** matches the vav + holem sequence with no vowel before it, indicating that the holem is male */
  const vavHolemMale = new RegExp("(?<!" + vowels.source + ")" + wawHolemRegX.source, "gu");
  /** matches the vav + holem sequence with a vowel before it, indicating that the holem is haser */
  const vavHolemHaser = new RegExp(
    "(?<=" + vowels.source + ")" + wawRegX.source + taamim.source + "?" + holemRegx.source,
    "gu"
  );
  // replace holem haser with regular holem
  if (options.holemHaser === "remove" && holemHaser.test(word)) {
    word = word.replace(holemHaser, "\u{05B9}");
  }

  // if there is no waw or holem or waw + holem patter, there is nothing to check
  if (!wawRegX.test(word) || !holemRegx.test(word) || !wawHolemRegX.test(word)) {
    return word;
  }

  word = vavHolemMale.test(word)
    ? findMatches(word, vavHolemMale, (w, s, e) => {
        return (
          // converts vav + holem as holem male to holem + vav
          w.substring(0, s) +
          "\u{05B9}\u{05D5}" +
          (w.substring(e).trim() ? w.substring(e) : w.substring(e - 1)).replace(holemRegx, "")
        );
      })
    : word;

  word =
    options.holemHaser === "update" && vavHolemHaser.test(removeTaamim(word)[0])
      ? findMatches(word, vavHolemHaser, (w) => {
          const vavTaamHolem = new RegExp(`${wawRegX.source}(${taamim.source})?${holemRegx.source}`, "gu");
          return w.replace(vavTaamHolem, "\u{05D5}\u{05BA}$1");
        })
      : word;

  return word;
};
