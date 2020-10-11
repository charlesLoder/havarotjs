import { syllabify, makeClusters } from "./utils/syllabifier";
import { Syllable } from "./syllable";
import { Cluster } from "./cluster";
import { Char } from "./char";
import { Node } from "./node";

// export class Word extends Node<Syllable> {
//   text: string;
//   whiteSpaceBefore: string | null;
//   whiteSpaceAfter: string | null;

//   constructor(text: string) {
//     super();
//     this.text = text.trim();
//     let startMatch = text.match(/^\s*/g);
//     let endMatch = text.match(/\s*$/g);
//     this.whiteSpaceBefore = startMatch ? startMatch[0] : null;
//     this.whiteSpaceAfter = endMatch ? endMatch[0] : null;
//   }

//   /**
//    * @returns a one dimensional array of Syllables
//    */
//   get syllables(): Node<Syllable>[] {
//     let syllables: Syllable[];
//     if (/\w/.test(this.text) || this.isDivineName) {
//       const syl = new Syllable(this.clusters);
//       syllables = [syl];
//     } else {
//       syllables = syllabify(this.clusters);
//     }
//     this.children = syllables;
//     return syllables;
//   }

//   /**
//    * @returns a one dimensional array of Clusters
//    */
//   get clusters(): Cluster[] {
//     const consonantSplit = /(?=[\u{05D0}-\u{05F2}])/u;
//     const groups = this.text.split(consonantSplit);
//     const clusters = groups.map((group) => new Cluster(group));
//     return clusters;
//   }

//   /**
//    * @returns a one dimensional array of Chars
//    */
//   get chars(): Char[] {
//     return this.clusters.map((cluster) => cluster.chars).reduce((a, c) => a.concat(c), []);
//   }

//   /**
//    * @returns a boolean indicating if the text is a form of the Divine Name
//    */
//   get isDivineName(): boolean {
//     const nonChars = /[\u{0591}-\u{05C7}]/gu;
//     const stripped = this.text.replace(nonChars, "");
//     return stripped === "יהוה";
//   }
// }
export class Word extends Node {
  text: string;
  whiteSpaceBefore: string | null;
  whiteSpaceAfter: string | null;

  constructor(text: string) {
    super();
    this.text = text.trim();
    let startMatch = text.match(/^\s*/g);
    let endMatch = text.match(/\s*$/g);
    this.whiteSpaceBefore = startMatch ? startMatch[0] : null;
    this.whiteSpaceAfter = endMatch ? endMatch[0] : null;
  }

  /**
   * @returns a one dimensional array of Syllables
   */
  get syllables(): Syllable[] {
    let syllables: Syllable[];
    if (/\w/.test(this.text) || this.isDivineName) {
      const clusters = makeClusters(this.text);
      const syl = new Syllable(clusters);
      syllables = [syl];
    } else {
      syllables = syllabify(this.text);
    }
    this.children = syllables;
    return syllables;
  }

  /**
   * @returns a one dimensional array of Clusters
   */
  get clusters(): Cluster[] {
    return this.syllables.map((syl) => syl.clusters).reduce((a, c) => a.concat(c), []);
  }

  /**
   * @returns a one dimensional array of Chars
   */
  get chars(): Char[] {
    return this.clusters.map((cluster) => cluster.chars).reduce((a, c) => a.concat(c), []);
  }

  /**
   * @returns a boolean indicating if the text is a form of the Divine Name
   */
  get isDivineName(): boolean {
    const nonChars = /[\u{0591}-\u{05C7}]/gu;
    const stripped = this.text.replace(nonChars, "");
    return stripped === "יהוה";
  }
}
