import { syllabify } from "./utils/syllabifier";
import { Syllable } from "./syllable";
import { Cluster } from "./cluster";
import { Char } from "./char";

export class Word {
  original: string;
  text: string;
  whiteSpaceBefore: string | null;
  whiteSpaceAfter: string | null;

  constructor(text: string) {
    this.original = text;
    this.text = this.original.trim();
    let startMatch = text.match(/^\s*/g);
    let endMatch = text.match(/\s*$/g);
    this.whiteSpaceBefore = startMatch ? startMatch[0] : null;
    this.whiteSpaceAfter = endMatch ? endMatch[0] : null;
  }

  /**
   * @returns a one dimensional array of Syllables
   */
  get syllables(): Syllable[] {
    return syllabify(this.clusters);
  }

  /**
   * @returns a one dimensional array of Clusters
   */
  get clusters(): Cluster[] {
    const consonantSplit = /(?=[\u{05D0}-\u{05F2}])/u;
    const groups = this.text.split(consonantSplit);
    const clusters = groups.map((group) => new Cluster(group));
    return clusters;
  }

  /**
   * @returns a one dimensional array of Chars
   */
  get chars(): Char[] {
    return this.clusters.map((cluster) => cluster.chars).reduce((a, c) => a.concat(c), []);
  }

  get isDivineName(): boolean {
    const nonChars = /[\u{0591}-\u{05C7}]/gu;
    const stripped = this.text.replace(nonChars, "");
    return stripped === "יהוה";
  }
}
