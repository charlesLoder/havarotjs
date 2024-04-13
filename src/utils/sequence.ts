import { Char } from "../char";
import { Cluster } from "../cluster";

/**
 * @returns a two dimensional array of sequenced Char objects
 */
export const sequence = (text: string): Char[][] => {
  const splits = /(?=[\u{05C0}\u{05D0}-\u{05F2}])/u;
  const hiriqPatah = /\u{5B4}\u{5B7}/u;
  const hiriqQamets = /\u{5B4}\u{5B8}/u;
  // for Jerusalem, where hiriq precedes patah, replace w/ correct patch-hiriq
  if (hiriqPatah.test(text)) text = text.replace(hiriqPatah, "\u{5B7}\u{5B4}");
  else if (hiriqQamets.test(text)) text = text.replace(hiriqQamets, "\u{5B8}\u{5B4}");
  return text
    .split(splits)
    .map((word) => new Cluster(word))
    .map((cluster) => cluster.chars);
};
