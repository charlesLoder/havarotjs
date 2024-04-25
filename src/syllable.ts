import { Char } from "./char";
import { Cluster } from "./cluster";
import type { ConsonantName } from "./cluster";
import { Node } from "./node";
import { consonantNameToCharMap, vowelCharToNameMap, vowelNameToCharMap } from "./utils/charMap";
import { removeTaamim } from "./utils/removeTaamim";
import { Word } from "./word";

const sylVowelCharToNameMap = {
  ...vowelCharToNameMap,
  /* eslint-disable  @typescript-eslint/naming-convention */
  "\u{05B0}": "SHEVA",
  "\u{05D5}\u{05BC}": "SHUREQ"
} as const;

type SyllableVowelCharToNameMap = typeof sylVowelCharToNameMap;
type Vowel = keyof SyllableVowelCharToNameMap;

const sylVowelNameToCharMap = {
  ...vowelNameToCharMap,
  /* eslint-disable  @typescript-eslint/naming-convention */
  SHEVA: "\u{05B0}",
  SHUREQ: "\u{05D5}\u{05BC}"
} as const;

export type SyllablVowelNameToCharMap = typeof sylVowelNameToCharMap;

type SyllableParams = {
  isClosed?: boolean;
  isAccented?: boolean;
  isFinal?: boolean;
};

type VowelName = SyllableVowelCharToNameMap[keyof SyllableVowelCharToNameMap];

/**
 * A subunit of a {@link Word} consisting of consonants, vowels, and other linguistic and ortographic features.
 */
export class Syllable extends Node<Syllable> {
  #cachedStructure: [string, string, string] | null = null;
  #cachedStructureWithGemination: [string, string, string] | null = null;
  #clusters: Cluster[];
  #isClosed: boolean;
  #isAccented: boolean;
  #isFinal: boolean;
  #vowelsCache: Vowel[] | null = null;
  #vowelNamesCache: VowelName[] | null = null;
  #word: Word | null = null;

  /**
   * Creates a new Syllable
   *
   * @param clusters an array of {@link Cluster}
   * @param options optional parameters
   *
   * @example
   * ```ts
   * new Syllable([new Cluster("אָ"), new Cluster("ב")]);
   * ```
   *
   * @description
   * See the {@page Syllabification} page for how a syllable is determined.
   * Currently, the Divine Name (e.g. יהוה), non-Hebrew text, and Hebrew punctuation (e.g. _passeq_, _nun hafucha_) are treated as a _single syllable_ because these do not follow the rules of Hebrew syllabification.
   */
  constructor(clusters: Cluster[], { isClosed = false, isAccented = false, isFinal = false }: SyllableParams = {}) {
    super();
    this.value = this;
    this.#clusters = clusters;
    this.#isClosed = isClosed;
    this.#isAccented = isAccented;
    this.#isFinal = isFinal;
  }

  private isCharKeyOfSyllableVowelCharToNameMap(char: string): char is keyof SyllableVowelCharToNameMap {
    return char in sylVowelCharToNameMap;
  }

  /**
   * Gets all the {@link Char | characters} in the Syllable
   *
   * @returns a one dimensional array of {@link Char | characters}
   *
   * @example
   * ```ts
   * const text = new Text("וַיִּקְרָ֨א");
   * text.syllables[2].chars;
   * // [
   * //    Char { original: "ר" },
   * //    Char { original: "ָ" },
   * //    Char { original: "" }, i.e. \u{05A8} (does not print well)
   * //    Char { original: "א" }
   * //  ]
   * ```
   */
  get chars(): Char[] {
    return this.clusters.map((cluster) => cluster.chars).flat();
  }

  /**
   * Gets all the {@link Cluster | clusters} in the Syllable
   *
   * @returns a one dimensional array of {@link Cluster | clusters}
   *
   * ```ts
   * const text = new Text("וַיִּקְרָ֨א");
   * text.syllables[1].clusters;
   * // [
   * //    Cluster { original: "יִּ" },
   * //    Cluster { original: "קְ" }
   * //  ]
   * ```
   */
  get clusters(): Cluster[] {
    return this.#clusters;
  }

  /**
   * Gets the coda of the syllable - see {@link structure}
   *
   * @returns the coda of the syllable as a string, including any taamim and ignoring gemination of the following syllable - see {@link codaWithGemination}
   *
   * @example
   * ```ts
   * const text = new Text("יָ֥ם");
   * text.syllables[0].coda;
   * // "ם"
   * ```
   */
  get coda(): string {
    return this.structure()[2];
  }

  /**
   * Gets the coda of the syllable, including gemination of the following syllable - see {@link structure}
   *
   * @returns the coda of the syllable as a string, including any taamim and including gemination of the following syllable - see {@link structure}
   *
   * @example
   * ```ts
   * const text = new Text("מַדּ֥וּעַ");
   * text.syllables[0].codaWithGemination;
   * // "דּ"
   * text.syllables[0].coda // without gemination
   * // ""
   * ```
   */
  get codaWithGemination(): string {
    return this.structure(true)[2];
  }

  /**
   * Gets the consonant _characters_ of the syllable
   *
   * @returns a one dimensional array of consonant characters
   *
   * @example
   * ```ts
   * const text = new Text("רְ֭שָׁעִים");
   * text.syllables[2].consonants;
   * // ["ע", "י", "ם"]
   * ```
   *
   * @description
   * This returns a one dimensional array of consonant characters, even if the characters are not phonemic consonants,
   * meaning even maters are returned as consonant characters. See the {@link structure} method if you need the consonants with phonemic value.
   *
   *
   */
  get consonants() {
    return this.clusters.map((cluster) => cluster.consonants).flat();
  }

  /**
   * Gets the names of the consonant _characters_ of the syllable
   *
   * @returns a one dimensional array of consonant character names
   *
   * @example
   * ```ts
   * const text = new Text("רְ֭שָׁעִים");
   * text.syllables[2].consonantNames;
   * // ["AYIN", "YOD", "FINAL_MEM"]
   * ```
   *
   * @description
   * This returns a one dimensional array of consonant names, even if the characters are not phonemic consonants,
   * meaning even the name of maters are returned. See the {@link structure} method if you need the consonants with phonemic value.
   */
  get consonantNames() {
    return this.clusters.map((cluster) => cluster.consonantNames).flat();
  }

  /**
   * Checks if the syllable contains the consonant _character_ matching the name passed in
   *
   * @returns a boolean indicating if the syllable contains the consonant _character_ matching the name passed in
   *
   * @example
   * ```ts
   * const text = new Text("רְ֭שָׁעִים");
   * text.syllables[2].hasConsonantName("AYIN");
   * // true
   * text.syllables[2].hasConsonantName("YOD");
   * // false
   * ```
   *
   * @description
   * This checks if the syllable contains the given consonant name, even if the character is not a phonemic consonant.
   */
  hasConsonantName(name: ConsonantName): boolean {
    if (!consonantNameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    return this.consonantNames.includes(name);
  }

  /**
   * Checks if the syllable contains the vowel character of the name passed in
   *
   * @returns a boolean indicating if the syllable contains the vowel character of the name passed in
   *
   * @example
   * ```ts
   * const text = new Text("הַיְחָבְרְךָ");
   * text.syllables[0].hasVowelName("PATAH");
   * // true
   *
   * // test for vocal sheva
   * text.syllables[1].hasVowelName("SHEVA");
   * // true
   *
   * // test for silent sheva
   * text.syllables[2].hasVowelName("SHEVA");
   * // false
   * ```
   *
   * @description
   * This returns a boolean if the vowel character is present, even for most mater lectionis (e.g. in a holam vav construction, "HOLAM" would return true)
   * The only exception is a shureq, because there is no vowel character for a shureq.
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Unlike `Cluster`, a `Syllable` is concerned with linguistics, so a sheva **is** a vowel character.
   * It returns `true` for "SHEVA" only when the sheva is the vowel (i.e. a vocal sheva or sheva na').
   */
  hasVowelName(name: VowelName): boolean {
    if (!sylVowelNameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    return this.vowelNames.includes(name);
  }

  /**
   * Checks if the Syllable is accented
   *
   * @returns true if Syllable is accented
   *
   * @example
   * ```ts
   * const text = new Text("וַיִּקְרָ֨א"); // note the taam over the ר
   * text.syllables[0].isAccented; // i.e. "וַ"
   * // false
   * text.syllables[2].isAccented; // i.e. "רָ֨א"
   * // true
   * ```
   *
   * @description
   * An accented syllable receives stress, and is typically indicated by the presence of a taam character
   */
  get isAccented(): boolean {
    return this.#isAccented;
  }

  /**
   * Sets whether the Syllable is accented
   *
   * @param accented a boolean indicating if the Syllable is accented
   *
   */
  set isAccented(accented: boolean) {
    this.#isAccented = accented;
  }

  /**
   * Checks if the Syllable is closed
   *
   * @returns true if Syllable is closed
   *
   * @example
   * ```ts
   * const text = new Text("וַיִּקְרָ֨א");
   * text.syllables[0].isClosed; // i.e. "וַ"
   * // true
   * text.syllables[2].isClosed; // i.e. "רָ֨א"
   * // false
   * ```
   *
   * @description
   * A closed syllable in Hebrew is a CVC or CVCC type, a mater letter does not close a syllable
   */
  get isClosed(): boolean {
    return this.#isClosed;
  }

  /**
   * Sets whether the Syllable is closed
   *
   * @param closed a boolean for whether the Syllable is closed
   *
   */
  set isClosed(closed: boolean) {
    this.#isClosed = closed;
  }

  /**
   * Checks if the Syllable is the final syllable in a word
   *
   * @returns true if Syllable is final
   *
   * @example
   * ```ts
   * const text = new Text("וַיִּקְרָ֨א");
   * text.syllables[0].isFinal; // i.e. "וַ"
   * // false
   * text.syllables[2].isFinal; // i.e. "רָ֨א"
   * // true
   * ```
   */
  get isFinal(): boolean {
    return this.#isFinal;
  }

  /**
   * Sets whether the Syllable is the final syllable in a word
   *
   * @param final a boolean for whether the Syllable is the final Syallble
   */
  set isFinal(final: boolean) {
    this.#isFinal = final;
  }

  /**
   * Returns the nucleus of the syllable - see {@link structure}
   *
   * @returns the nucleus of the syllable as a string, including any taamim - see {@link structure}
   *
   * @example
   * ```ts
   * const text = new Text("יָ֥ם");
   * text.syllables[0].nucleus;
   * // "\u{05B8}\u{05A5}""
   * ```
   * @description
   * The nucleus is the vowel of the syllable - present in every syllable and containing its {@link vowel} (with any materes lecticonis) or a shureq.
   */
  get nucleus(): string {
    return this.structure()[1];
  }

  /**
   * Returns the onset of the syllable - see {@link structure}
   *
   * @returns the onset of the syllable as a string - see {@link structure}
   *
   * @example
   * ```ts
   * const text = new Text("יָ֥ם");
   * text.syllables[0].onset;
   * // "י"
   * ```
   * @description
   * The onset is any initial consonant of the syllable - present in every syllable except those containing a except word-initial shureq or a furtive patah.
   */
  get onset(): string {
    return this.structure()[0];
  }

  /**
   * Returns the structure of the syllable
   *
   * @returns the structure of the Syllable, i.e. the syllable's onset, nucleus, and coda.
   *
   * @param withGemination If this argument is `true`, include gemination of the next syllable's onset in this syllable's coda.
   *
   * ```ts
   * const text = new Text("מַדּוּעַ");
   * text.syllables.map(s => s.structure(true));
   * // [
   * //   [ 'מ', 'ַ', 'דּ' ],
   * //   [ 'דּ', 'וּ', '' ], NOTE: the dalet is the onset, but rendering can sometimes causes the blank string to appear to be first
   * //   [ '', 'ַ', 'ע' ]
   * // ]
   * ```
   *
   * @description
   * - The onset is any initial consonant of the syllable - present in every syllable except those containing a except word-initial shureq or a furtive patah.
   * - The nucleus is the vowel of the syllable - present in every syllable and containing its {@link vowel} (with any materes lecticonis) or a shureq.
   * - The coda is all final consonants of the syllable - not including any matres lecticonis, and including the onset of the subsequent syllable if the subsequent syllable is geminated and the `withGemination` argument is `true`.
   */
  structure(withGemination: boolean = false): [string, string, string] {
    if (withGemination && this.#cachedStructureWithGemination) {
      return this.#cachedStructureWithGemination;
    }

    if (!withGemination && this.#cachedStructure) {
      return this.#cachedStructure;
    }

    const heClusters = this.clusters.filter((c) => !c.isNotHebrew);
    if (heClusters.length === 0) {
      // eslint complains about shadowing, but I think it makes sense here
      /* eslint-disable-next-line @typescript-eslint/no-shadow */
      const structure: [string, string, string] = ["", "", ""];
      this.#cachedStructure = structure;
      this.#cachedStructureWithGemination = structure;
      return structure;
    }

    // Initial shureq: If the syllable starts with a shureq, then it has no
    // onset, its nucleus is the shureq, and its coda is any remaining clusters
    const first = heClusters[0];
    if (first.isShureq) {
      // eslint complains about shadowing, but I think it makes sense here
      /* eslint-disable-next-line @typescript-eslint/no-shadow */
      const structure: [string, string, string] = [
        "",
        first.text,
        heClusters
          .slice(1)
          .map((c) => c.text)
          .join("")
      ];
      this.#cachedStructure = structure;
      this.#cachedStructureWithGemination = structure;
      return structure;
    }

    // Furtive patah: If the syllable is final and is either a het, ayin, or he
    // (with dagesh) followed by a patah, then it has no onset, its nucleus is
    // the patah and its coda is the consonant
    if (this.isFinal && !this.isClosed) {
      const matchFurtive = this.text.match(/(\u{05D7}|\u{05E2}|\u{05D4}\u{05BC})(\u{05B7})(\u{05C3})?$/mu);
      if (matchFurtive) {
        // eslint complains about shadowing, but I think it makes sense here
        /* eslint-disable-next-line @typescript-eslint/no-shadow */
        const structure: [string, string, string] = ["", matchFurtive[2], matchFurtive[1] + (matchFurtive[3] || "")];
        this.#cachedStructure = structure;
        this.#cachedStructureWithGemination = structure;
        return structure;
      }
    }

    // Otherwise:
    // 1. The onset is any initial consonant, ligature, dagesh, and/or rafe
    //    (as defined in char.ts) of the first cluster
    // 2. The nucleus is any niqqud and/or taamim of the initial cluster plus
    //    the second cluster if the latter is a shureq or a mater
    // 3. The coda is all remaining clusters – or if there are none, the
    //    current syllable has a non-sheva vowel, the first cluster
    //    of the next syllable has a dagesh, and `withGemination` is `true`,
    //    then the coda is any initial consonant, ligature, dagesh, and/or
    //    rafe of the first cluster of the next syllable (i.e. the next
    //    syllable's dagesh is a dagesh chazaq)
    let [onset, nucleus, coda] = ["", "", ""];
    let i = 0;
    // (add to the onset the sequencePositions: consonants = 0, ligatures = 1, dagesh or rafe = 2, or meteg = \u{05BD})
    // though meteg is an accent, it is treated as part of the onset
    for (; i < first.chars.length && (first.chars[i].sequencePosition < 3 || first.chars[i].text === "\u{05BD}"); i++) {
      onset += first.chars[i].text;
    }
    // (add to the nucleus the sequencePositions: niqqud (i.e vowels) = 3, taamim (i.e. accents) = 4)
    for (; i < first.chars.length && [3, 4].includes(first.chars[i].sequencePosition); i++) {
      nucleus += first.chars[i].text;
    }
    // (add to the coda everything else from the first cluster - e.g. out of order characters)
    for (; i < first.chars.length; i++) {
      coda += first.chars[i].text;
    }
    // (add to the nucleus add any shureq or mater - if we haven't already added anything to the coda)
    let clusters_processed = 1;
    if (coda.length === 0 && heClusters.length > 1 && (heClusters[1].isShureq || heClusters[1].isMater)) {
      nucleus += heClusters[1].text;
      clusters_processed++;
    }
    // (add to the coda all the remaining clusters)
    coda += heClusters
      .slice(clusters_processed)
      .map((c) => c.text)
      .join("");
    // (handle gemination)
    if (withGemination && coda.length === 0 && !/\u{05B0}/u.test(nucleus)) {
      if (this.next instanceof Syllable) {
        const nextOnset = this.next.onset;
        if (/\u{05BC}/u.test(nextOnset)) {
          coda = nextOnset;
        }
      }
    }

    const structure: [string, string, string] = [onset, nucleus, coda];
    if (withGemination) {
      this.#cachedStructureWithGemination = structure;
    } else {
      this.#cachedStructure = structure;
    }
    return structure;
  }

  /**
   * Gets all the taamim characters in the Syllable
   *
   * @returns a one dimensional array of taamim characters in the syllable
   *
   * @example
   * ```ts
   * const text = new Text("הָאָ֖רֶץ");
   * text.syllables[1].taamim;
   * // ["\u{596}"]
   * ```
   */
  get taamim() {
    return this.clusters.map((c) => c.taamim).flat();
  }

  /**
   * Gets all the taamim names in the Syllable
   *
   * @returns a one dimensional array of taamim names in the syllable
   *
   * @example
   * ```ts
   * const text = new Text("הָאָ֖רֶץ");
   * text.syllables[1].taamimNames;
   * // ["TIPEHA"]
   * ```
   */
  get taamimNames() {
    return this.clusters.map((c) => c.taamimNames).flat();
  }

  /**
   * The text of the syllable
   *
   * @returns the sequenced and normalized text of the syllable
   *
   * @example
   * ```ts
   * const text = new Text("וַיִּקְרָ֨א");
   * text.syllables.map((syl) => syl.text);
   * //  [
   * //    "וַ"
   * //    "יִּקְ"
   * //    "רָ֨א"
   * //  ]
   * ```
   *
   * @description
   * This returns a string that has been built up from the .text of its constituent Clusters.
   */
  get text(): string {
    return this.clusters.map((c) => c.text).join("");
  }

  /**
   * Gets the names of the vowel characters in the syllable
   *
   * @returns an array of names of vowel characters in the syllable
   *
   * ```ts
   * const text = new Text("מִתָּ֑͏ַ֜חַת");
   * text.syllables[1].vowelNames;
   * // ["QAMATS", "PATAH"]
   * ```
   *
   * @description
   * This returns an array of names of vowel characters in the syllable, but not for mater lectionis (e.g. a holam vav would return the HOLAM, not the vav).
   * The only exception is a shureq, which returns "SHUREQ" because there is no vowel character for a shureq.
   * It is very uncommon to have multiple vowel characters in a syllable.
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Unlike `Cluster`, a `Syllable` is concerned with linguistics, so a sheva **is** a vowel character.
   */
  get vowelNames(): VowelName[] {
    if (this.#vowelNamesCache) {
      return this.#vowelNamesCache;
    }

    const vowelNames = this.vowels
      .reduce((a, vowel) => {
        if (sylVowelCharToNameMap[vowel]) {
          a.push(sylVowelCharToNameMap[vowel]);
        }
        return a;
      }, [] as VowelName[])
      .flat();

    return (this.#vowelNamesCache = vowelNames);
  }

  /**
   * Gets the vowel characters of the syllable
   *
   * @returns an array of vowel characters in the syllable
   *
   * @example
   * ```ts
   * const text = new Text("מִתָּ֑͏ַ֜חַת");
   * text.syllables[1].vowels;
   * // ["\u{05B8}", "\u{05B7}"]
   * ```
   *
   * @description
   * This returns a single vowel character, even for most mater lectionis (e.g. a holam vav would return the holam, not the vav).
   * The only exception is a shureq, which returns the vav and the dagesh because there is no vowel character for a shureq.
   * It is very uncommon to have multiple vowel characters in a syllable.
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Unlike `Cluster`, a `Syllable` is concerned with linguistics, so a sheva **is** a vowel character
   */
  get vowels(): Vowel[] {
    if (this.#vowelsCache) {
      return this.#vowelsCache;
    }
    // the nucleus returns as many vowels characters as there are in the syllable
    const nucleus = this.nucleus;
    const noTaamim = removeTaamim(nucleus)[0];
    const shureq = sylVowelNameToCharMap.SHUREQ;
    const shureqPresentation = "\u{FB35}";
    const vowels = noTaamim
      .replace(shureq, shureqPresentation)
      .split("")
      .reduce((a, v) => {
        if (this.isCharKeyOfSyllableVowelCharToNameMap(v)) {
          a.push(v);
        }
        if (v === shureqPresentation) {
          a.push(shureq);
        }
        return a;
      }, [] as Vowel[]);

    return (this.#vowelsCache = vowels);
  }

  /**
   * Gets the `Word` to which the syllable belongs
   *
   * @returns the `Word` to which the syllable belongs
   *
   * @example
   * ```ts
   * const text = new Text("הָאָ֖רֶץ");
   * text.syllables[0].word;
   * // Word {
   * //   text: "הָאָ֖רֶץ"
   * // }
   * ```
   */
  get word(): Word | null {
    return this.#word;
  }

  /**
   * Sets the `Word` to which the syllable belongs
   *
   * @param word - the `Word` to which the syllable belongs
   */
  set word(word: Word | null) {
    this.#word = word;
  }
}
