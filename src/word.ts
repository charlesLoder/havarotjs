import { syllabify } from "./utils/syllabifier";

export class Word {
  original: string;

  constructor(text: string) {
    this.original = text;
  }

  get text() {
    return this.syllables.reduce((init, syl) => init + syl.text, "");
  }

  /**
   * @returns a one dimensional array of Syllables
   */
  get syllables() {
    return syllabify(this.original);
  }

  /**
   * @returns a one dimensional array of Clusters
   */
  get clusters() {
    return this.syllables.map((syllable) => syllable.clusters).reduce((a, c) => a.concat(c), []);
  }

  /**
   * @returns a one dimensional array of Chars
   */
  get chars() {
    return this.clusters.map((cluster) => cluster.chars).reduce((a, c) => a.concat(c), []);
  }
}
