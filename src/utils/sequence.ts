import { Cluster } from "../cluster";

/**
 * @returns a two dimensional array of sequenced Char objects
 */
export const sequence = (text: string) => {
  const splits = /(?=[\u{05C0}\u{05D0}-\u{05F2}])/u;
  const clusters = text.split(splits).map((word) => new Cluster(word));
  const sequenced = clusters.map((cluster) => cluster.chars);
  return sequenced;
};
