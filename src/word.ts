import { syllabify } from "./utils/syllabifier";
import { clusterSplitGroup, jerusalemTest } from "./utils/regularExpressions";
import { Syllable } from "./syllable";
import { Cluster } from "./cluster";
import { Char } from "./char";
import { SylOpts } from "./text";
import { Node } from "./node";
import { isDivineName, hasDivineName } from "./utils/divineName";

/**
 * [[`Text.text`]] is split at each space and maqqef (U+05BE) both of which are captured.
 * Thus, the string passed to instantiate each `Word` is already properly decomposed, sequenced, qamets qatan patterns converted to the appropriate unicode character (U+05C7), and holem-waw sequences corrected.
 */
export class Word extends Node<Word> {
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

  /**
   *
   * @param word the word to be split into Cluster
   * @description splits a word at each consonant or the punctuation character
   * Sof Pasuq and Nun Hafukha
   */
  private makeClusters = (word: string): Cluster[] => {
    const match = word.match(jerusalemTest);
    /**
     * The Masoretic spelling of Jerusalem contains some idiosyncrasies,
     * namely the final syllable.
     * Due to the normalization process, this word requires special treatment
     */
    if (match?.groups) {
      const captured = match[0];
      const { hiriq, vowel, taamimMatch, mem } = match.groups;
      const partial = word.replace(captured, `${vowel}${taamimMatch}`);
      return [...partial.split(clusterSplitGroup), `${hiriq}${mem}`].map((group) => {
        if (group === `${hiriq}${mem}`) {
          return new Cluster(group, true);
        }
        return new Cluster(group);
      });
    }
    return word.split(clusterSplitGroup).map((group) => new Cluster(group));
  };

  constructor(text: string, sylOpts: SylOpts) {
    super();
    this.value = this;
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
      syl.word = this;
      return [syl];
    }

    const syllables = syllabify(this.clusters, this.sylOpts, this.isInConstruct);
    syllables.forEach((syl) => (syl.word = this));

    return syllables;
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
    const clusters = this.makeClusters(this.text);
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

  /**
   * Returns `true` if the Word is in a construct state
   *
   * @description
   * The construct state is indicated by the presence of a maqqef (U+05BE) character
   */
  get isInConstruct(): boolean {
    // if word has a maqqef, it is in construct
    return this.text.includes("\u05BE");
  }
}
