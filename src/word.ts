import { Cluster } from "./cluster";
import { Node } from "./node";
import type { SyllableVowelName } from "./syllable";
import { Syllable } from "./syllable";
import { SylOpts } from "./text";
import type { ConsonantName, TaamimName } from "./utils/charMap";
import { clusterSplitGroup, jerusalemTest } from "./utils/regularExpressions";
import { syllabify } from "./utils/syllabifier";

/**
 * A subunit of a {@link Text} consisting of words, which are strings are text separated by spaces or maqqefs.
 */
export class Word extends Node<Word> {
  /** A regex for removing anything that is not a character */
  #nonCharacters = /[^\u{05D0}-\u{05F4}]/gu;
  #text: string;
  #original: string;
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
  #sylOpts: SylOpts;

  constructor(text: string, sylOpts: SylOpts, original?: string) {
    super();
    this.value = this;
    this.#text = text;
    this.#original = original ?? text;
    const startMatch = text.match(/^\s*/g);
    const endMatch = text.match(/\s*$/g);
    this.whiteSpaceBefore = startMatch ? startMatch[0] : null;
    this.whiteSpaceAfter = endMatch ? endMatch[0] : null;
    this.#sylOpts = sylOpts;
  }

  /**
   *
   * @param word the word to be split into Cluster
   *
   * @remarks
   * Splits a word at each consonant or the punctuation character, Sof Pasuq and Nun Hafukha
   */
  #makeClusters(word: string) {
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
  }

  /**
   * Gets all the {@link Char | Characters} in the Word
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
  get chars() {
    return this.clusters.map((cluster) => cluster.chars).flat();
  }

  /**
   * Gets all the {@link Cluster | Clusters} in the Word
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
  get clusters() {
    const clusters = this.#makeClusters(this.text);
    const firstCluster = clusters[0];
    const remainder = clusters.slice(1);
    firstCluster.siblings = remainder;
    return clusters;
  }

  /**
   * Gets all the consonant characters in the Word
   *
   * @returns a one dimensional array of all the consonant characters in the Word
   *
   * @example
   * ```ts
   * const text = new Text("הָאָ֖רֶץ");
   * text.words[0].consonants;
   * // ["ה", "א", "ר", "ץ"]
   * ```
   */
  get consonants() {
    return this.clusters.map((cluster) => cluster.consonants).flat();
  }

  /**
   * Gets all the consonant character names in the Word
   *
   * @returns a one dimensional array of all the consonant character names in the Word
   *
   * @example
   * ```ts
   * const text = new Text("הָאָ֖רֶץ");
   * text.words[0].consonantNames;
   * // ["HE", "ALEF", "RESH", "FINAL_TSADI"]
   * ```
   */
  get consonantNames() {
    return this.clusters.map((cluster) => cluster.consonantNames).flat();
  }

  /**
   * Checks if the word contains the consonant character of the name passed in
   *
   * @returns a boolean indicating if the word contains the consonant character of the name passed in
   *
   * @example
   * ```ts
   * const text = new Text("הָאָ֖רֶץ");
   * text.words[0].hasConsonantName("HE");
   * // true
   * text.words[0].hasConsonantName("MEM");
   * // false
   * ```
   *
   * @remarks
   * This checks if the syllable contains the given consonant name, even if the character is not a phonemic consonant (i.e a mater).
   */
  hasConsonantName(name: ConsonantName): boolean {
    return this.clusters.some((cluster) => cluster.hasConsonantName(name));
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
  get hasDivineName() {
    return /יהוה/.test(this.text.replace(this.#nonCharacters, ""));
  }

  /**
   * Checks if the word contains the taamim character of the name passed in
   *
   * @returns a boolean indicating if the word contains the taamim character of the name passed in
   *
   * @example
   * ```ts
   * const text = new Text("הָאָ֖רֶץ");
   * text.word[0].hasTaamName("TIPEHA");
   * // true
   * ```
   *
   * @remarks
   * Note: it only checks according to the character name, not its semantic meaning.
   * E.g. "כֵֽן׃" would be `true` when checking for `"METEG"`, not silluq
   */
  hasTaamName(name: TaamimName) {
    return this.syllables.some((syllable) => syllable.hasTaamName(name));
  }

  /**
   * Checks if the word contains the vowel character of the name passed in
   *
   * @returns a boolean indicating if the word contains the vowel character of the name passed in
   *
   * @example
   * ```ts
   * const text = new Text("הַיְחָבְרְךָ")'
   * text.word[0].hasVowelName("PATAH");
   * // true
   *
   * // test for vocal sheva
   * text.word[0].hasVowelName("SHEVA");
   * // true
   *
   * // test for silent sheva
   * text.word[0].hasVowelName("SHUREQ");
   * // false
   * ```
   *
   * @remarks
   * This returns a boolean if the vowel character is present, even for most mater lectionis (e.g. in a holam vav construction, "HOLAM" would return true).
   * The only exception is a shureq, because there is no vowel character for a shureq.
   * According to [Syllabification](/guides/syllabification), a sheva is a vowel and serves as the nucleus of a syllable.
   * It returns `true` for "SHEVA" only when the sheva is the vowel (i.e. a vocal sheva or sheva na').
   */
  hasVowelName(name: SyllableVowelName) {
    return this.syllables.some((syllable) => syllable.hasVowelName(name));
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
  get isDivineName() {
    return this.text.replace(this.#nonCharacters, "") === "יהוה";
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
   * @remarks
   * If the word contains non-Hebrew characters, it is not considered Hebrew because syllabification is likely not correct.
   */
  get isNotHebrew() {
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
   * @remarks
   * The construct state is indicated by the presence of a maqqef (U+05BE) character
   */
  get isInConstruct() {
    // if word has a maqqef, it is in construct
    return this.text.includes("\u05BE");
  }

  /**
   * The original string passed
   *
   * @returns the original string passed
   *
   * @description
   * The original string passed to the constructor that has not been checked against any KetivQeres.
   *
   * @remarks
   * The original string passed to the constructor still undergoes the normalization and sequence process, just not checked against any KetivQeres.
   */
  get original() {
    return this.#original.trim();
  }

  /**
   * Gets all the {@link Syllable | Syllables} in the Word
   *
   * @returns a one dimensional array of Syllables
   *
   * @example
   * ```ts
   * const text = new Text("אֵיפֹה־אַתָּה מֹשֶה");
   * text.words[0].syllables;
   * // [
   * //    Syllable { original: "אֵי" },
   * //    Syllable { original: "פֹה־" }
   * //  ]
   * ```
   */
  get syllables() {
    if (/\w/.test(this.text) || this.isDivineName || this.isNotHebrew) {
      const syl = new Syllable(this.clusters);
      syl.word = this;
      return [syl];
    }

    const syllables = syllabify(this.clusters, this.#sylOpts, this.isInConstruct);
    syllables.forEach((syl) => (syl.word = this));

    return syllables;
  }

  /**
   * Gets all the taamim characters in the Word
   *
   * @returns a one dimensional array of all the taamim characters in the Word
   *
   * @example
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
   * @example
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
   * @example
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
  get text() {
    return this.#text.trim();
  }

  /**
   * Gets all the vowel names in the Word
   *
   * @returns an array of all the vowel names in the Word
   *
   * @example
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
   * @example
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
