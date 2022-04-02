import { Cluster } from "../cluster";
import { Char } from "../char";

/**
 * @returns a two dimensional array of sequenced Char objects
 */
export const sequence = (text: string): Char[][] => {
  const splits = /(?=[\u{05C0}\u{05D0}-\u{05F2}])/u;
  const hiriqPatach = /\u{5B4}\u{5B7}/u;
  // for Jerusalem, where hiriq precedes patah, replace w/ correct patch-hiriq
  if (hiriqPatach.test(text)) text = text.replace(hiriqPatach, "\u{5B7}\u{5B4}");
  const clusters = text.split(splits).map((word) => new Cluster(word));
  const sequenced = clusters.map((cluster) => cluster.chars);
  return sequenced;
};
