import { syllabify } from "./utils/syllabifier";
import { Syllable } from "./syllable";
import { Cluster } from "./cluster";
import { Char } from "./char";
import { SylOpts } from "./text";
import { isDivineName, hasDivineName } from "./utils/divineName";

/**
 *
 * @param word the word to be split into Cluster
 * @description splits a word at each consonant or the punctuation character
 * Sof Pasuq and Nun Hafukha
 */
export const makeClusters = (word: string): Cluster[] => {
  const split =
    /(?=[\u{05C3}\u{05C6}\u{05D0}-\u{05F2}\u{2000}-\u{206F}\u{2E00}-\u{2E7F}'!"#$%&()*+,-.\/:;<=>?@\[\]^_`\{|\}~])/u;
  const groups = word.split(split);
  const clusters = groups.map((group) => new Cluster(group));
  return clusters;
};

/**
 * [[`Text.text`]] is split at each space and maqqef (U+05BE) both of which are captured.
 * Thus, the string passed to instantiate each `Word` is already properly decomposed, sequenced, qamets qatan patterns converted to the appropriate unicode character (U+05C7), and holem-waw sequences corrected.
 */
export class Word {
  #text: string;
  /**
   * Returns a string with any whitespace characters (e.g. `/\s/`) from before the word.
   * It does **not** capture whitespace at the start of a `Text`.
   *
   * ```typescript
   * const heb = `
   * עֶבֶד
   * אֱלֹהִים
   * `;
   * const text: Text = new Text(heb);
   * text.words;
   * // [
   * //   Word {
   * //     original: 'עֶבֶד\n',
   * //     text: 'עֶבֶד',
   * //     whiteSpaceBefore: '',
   * //     whiteSpaceAfter: '\n'
   * //   },
   * //   Word {
   * //     original: 'אֱלֹהִים',
   * //     text: 'אֱלֹהִים',
   * //     whiteSpaceBefore: '',
   * //     whiteSpaceAfter: ''
   * //   }
   * // ]
   * ```
   */
  whiteSpaceBefore: string | null;
  /**
   * Returns a string with any whitespace characters (e.g. `/\s/`) after the word.
   *
   * ```typescript
   * const heb = `
   * עֶבֶד
   * אֱלֹהִים
   * `;
   * const text: Text = new Text(heb);
   * text.words;
   * // [
   * //   Word {
   * //     original: 'עֶבֶד\n',
   * //     text: 'עֶבֶד',
   * //     whiteSpaceBefore: '',
   * //     whiteSpaceAfter: '\n'
   * //   },
   * //   Word {
   * //     original: 'אֱלֹהִים',
   * //     text: 'אֱלֹהִים',
   * //     whiteSpaceBefore: '',
   * //     whiteSpaceAfter: ''
   * //   }
   * // ]
   * ```
   */
  whiteSpaceAfter: string | null;
  private sylOpts: SylOpts;

  constructor(text: string, sylOpts: SylOpts) {
    this.#text = text;
    const startMatch = text.match(/^\s*/g);
    const endMatch = text.match(/\s*$/g);
    this.whiteSpaceBefore = startMatch ? startMatch[0] : null;
    this.whiteSpaceAfter = endMatch ? endMatch[0] : null;
    this.sylOpts = sylOpts;
  }

  /**
   * @returns the word's text trimmed of any whitespace characters
   *
   * ```typescript
   * const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
   * const words = text.words.map((word) => word.text);
   * words;
   * // [
   * //    "אֵיפֹה־",
   * //    "אַתָּה",
   * //    "מֹשֶׁה"
   * //  ]
   * ```
   */
  get text(): string {
    return this.#text.trim();
  }

  /**
   * @returns a one dimensional array of Syllables
   *
   * ```typescript
   * const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
   * text.words[0].syllables;
   * // [
   * //    Syllable { original: "אֵי" },
   * //    Syllable { original: "פֹה־" }
   * //  ]
   * ```
   */
  get syllables(): Syllable[] {
    if (/\w/.test(this.text) || this.isDivineName || this.isNotHebrew) {
      const syl = new Syllable(this.clusters);
      return [syl];
    }

    return syllabify(this.clusters, this.sylOpts);
  }

  /**
   * @returns a one dimensional array of Clusters
   *
   * ```typescript
   * const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
   * text.words[0].clusters;
   * // [
   * //    Cluster { original: "אֵ" },
   * //    Cluster { original: "י" },
   * //    Cluster { original: "פֹ" },
   * //    Cluster { original: "ה־" }
   * //  ]
   * ```
   */
  get clusters(): Cluster[] {
    const clusters = makeClusters(this.text);
    const firstCluster = clusters[0];
    const remainder = clusters.slice(1);
    firstCluster.siblings = remainder;
    return clusters;
  }

  /**
   * @returns a one dimensional array of Chars
   *
   * ```typescript
   * const text: Text = new Text("אֵיפֹה־אַתָּה מֹשֶה");text.words[0].chars;
   * // [
   * //    Char { original: "א" },
   * //    Char { original: "ֵ" }, (tsere)
   * //    Char { original: "פ" },
   * //    Char { original: "ֹ" }, (holem)
   * //    Char { original: "ה"},
   * //    Char { original: "־" }
   * //  ]
   * ```
   */
  get chars(): Char[] {
    return this.clusters.map((cluster) => cluster.chars).flat();
  }

  /**
   * @returns a boolean indicating if the text is a form of the Divine Name
   *
   * ```typescript
   * const text: Text = new Text("יְהוָה");
   * text.words[0].isDivineName;
   * // true
   * ```
   */
  get isDivineName(): boolean {
    return isDivineName(this.text);
  }

  /**
   * @returns a boolean indicating if the word has a form of the Divine Name
   *
   * ```typescript
   * const text: Text = new Text("בַּֽיהוָ֔ה");
   * text.words[0].hasDivineName;
   * // true
   * ```
   */
  get hasDivineName(): boolean {
    return hasDivineName(this.text);
  }

  /**
   * Returns `true` if the Cluster does not have Hebrew chars
   */
  get isNotHebrew(): boolean {
    return !this.clusters.map((c) => c.isNotHebrew).includes(false);
  }
}
