import { syllabify, makeClusters } from "./utils/syllabifier";
import { Syllable } from "./syllable";
import { Cluster } from "./cluster";
import { Char } from "./char";
import { SylOpts } from "./text";

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
    if (/\w/.test(this.text) || this.isDivineName) {
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
    const nonChars = /[\u{0591}-\u{05C7}]/gu;
    const stripped = this.text.replace(nonChars, "");
    return stripped === "יהוה";
  }
}
