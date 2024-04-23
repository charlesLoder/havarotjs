import { Char } from "./char";
import { Cluster } from "./cluster";
import { Node } from "./node";
import { Syllable, SyllablVowelNameToCharMap } from "./syllable";
import { SylOpts } from "./text";
import { hasDivineName, isDivineName } from "./utils/divineName";
import { clusterSplitGroup, jerusalemTest } from "./utils/regularExpressions";
import { syllabify } from "./utils/syllabifier";

/**
 * A subunit of a {@link Text} consisting of words, which are strings are text separated by spaces or maqqefs.
 */
export class Word extends Node<Word> {
  #text: string;
  /**
   * The white space that appears before the word
   *
   * @returns any white space that appears before the word such as a space or new line
   *
   * @example
   * ```ts
   * const heb = `
   * עֶבֶד
   * אֱלֹהִים
   * `;
   * const text = new Text(heb);
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
   * The white space that appears after the word
   *
   * @returns any white space that appears after the word such as a space or new line
   *
   * @example
   * ```ts
   * const heb = `
   * עֶבֶד
   * אֱלֹהִים
   * `;
   * const text = new Text(heb);
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
   * Gets all the {@link Char | characters} in the Word
   *
   * @returns a one dimensional array of Chars
   *
   * @example
   * ```ts
   * const text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
   * text.words[0].chars;
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
   * Gets all the {@link Cluster | clusters} in the Word
   *
   * @returns a one dimensional array of Clusters
   *
   * @example
   * ```ts
   * const text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
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
   * Checks if the word has a form of the Divine Name (i.e the tetragrammaton)
   *
   * @returns a boolean indicating if the word has a form of the Divine Name
   *
   * @example
   * ```ts
   * const text = new Text("בַּֽיהוָ֔ה");
   * text.words[0].hasDivineName;
   * // true
   * ```
   */
  get hasDivineName(): boolean {
    return hasDivineName(this.text);
  }

  hasVowelName(name: keyof SyllablVowelNameToCharMap): boolean {
    return this.syllables.some((cluster) => cluster.hasVowelName(name));
  }

  /**
   * Checks if the text is a form of the Divine Name (i.e the tetragrammaton)
   *
   * @returns a boolean indicating if the text is a form of the Divine Name
   *
   * @example
   * ```ts
   * const text = new Text("יְהוָה");
   * text.words[0].isDivineName;
   * // true
   * ```
   */
  get isDivineName(): boolean {
    return isDivineName(this.text);
  }

  /**
   * Checks if the Word contains non-Hebrew characters
   *
   * @returns a boolean indicating if the Word contains non-Hebrew characters
   *
   * @example
   * ```ts
   * const text = new Text("Hi!");
   * text.words[0].isNotHebrew;
   * // true
   * ```
   *
   * @description
   * If the word contains non-Hebrew characters, it is not considered Hebrew because syllabification is likely not correct.
   */
  get isNotHebrew(): boolean {
    return !this.clusters.map((c) => c.isNotHebrew).includes(false);
  }

  /**
   * Checks if the Word is in a construct state
   *
   * @returns a boolean indicating if the Word is in a construct state
   *
   * @example
   * ```ts
   * const text = new Text("בֶּן־אָדָ֕ם");
   * text.words[0].isInConstruct;
   * // true
   * ```
   *
   * @description
   * The construct state is indicated by the presence of a maqqef (U+05BE) character
   */
  get isInConstruct(): boolean {
    // if word has a maqqef, it is in construct
    return this.text.includes("\u05BE");
  }

  /**
   * Gets all the {@link Syllable | syllables} in the Word
   *
   * @returns a one dimensional array of Syllables
   *
   * ```ts
   * const text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
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
   * Gets all the taamim characters in the Word
   *
   * @returns a one dimensional array of all the taamim characters in the Word
   *
   * ```ts
   * const text = new Text("הָאָ֖רֶץ");
   * text.words[0].taamim;
   * // ["\u{596}"];
   * ```
   */
  get taamim() {
    return this.syllables.map((syl) => syl.taamim).flat();
  }

  /**
   * Gets all the taamim names in the Word
   *
   * @returns a one dimensional array of all the taamim names in the Word
   *
   * ```ts
   * const text = new Text("הָאָ֖רֶץ");
   * text.words[0].taamimNames;
   * // ["TIPEHA"];
   * ```
   */
  get taamimNames() {
    return this.syllables.map((syl) => syl.taamimNames).flat();
  }

  /**
   * Gets the text of the Word
   *
   * @returns the word's text trimmed of any whitespace characters
   *
   * ```ts
   * const text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
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
   * Gets all the vowel names in the Word
   *
   * @returns an array of all the vowel names in the Word
   *
   * ```ts
   * const text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
   * text.words[0].vowelNames;
   * // ["HOLAM", "SEGOL"];
   * ```
   */
  get vowelNames() {
    return this.syllables.map((syl) => syl.vowelNames).flat();
  }

  /**
   * Gets all the vowel characters in the Word
   *
   * @returns an array of all the vowel characters in the Word
   *
   * ```ts
   * const text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
   * text.words[0].vowels;
   * // ["\u{5B9}", "\u{5B6}"];
   * ```
   */
  get vowels() {
    return this.syllables.map((syl) => syl.vowels).flat();
  }
}
