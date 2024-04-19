import { Char } from "./char";
import { Cluster } from "./cluster";
import { Node } from "./node";
import {
  ConsonantCharToNameMap,
  ConsonantNameToCharMap,
  consonantNameToCharMap,
  vowelCharToNameMap,
  vowelNameToCharMap
} from "./utils/charMap";
import { vowelsCaptureGroupWithSheva } from "./utils/regularExpressions";
import { removeTaamim } from "./utils/removeTaamim";
import { Word } from "./word";

const sylVowelCharToNameMap = {
  ...vowelCharToNameMap,
  "\u{05D5}\u{05BC}": "SHUREQ",
  "\u{05B0}": "SHEVA"
} as const;

type SyllableVowelCharToNameMap = typeof sylVowelCharToNameMap;

const sylVowelNameToCharMap = {
  ...vowelNameToCharMap,
  /* eslint-disable  @typescript-eslint/naming-convention */
  SHUREQ: "\u{05D5}\u{05BC}",
  SHEVA: "\u{05B0}"
} as const;

type SyllablVowelNameToCharMap = typeof sylVowelNameToCharMap;

/**
 * A `Syllable` is created from an array of [[`Clusters`]].
 */
export class Syllable extends Node<Syllable> {
  #clusters: Cluster[];
  #isClosed: boolean;
  #isAccented: boolean;
  #isFinal: boolean;
  #word: Word | null = null;
  #cachedStructure: [string, string, string] | null = null;
  #cachedStructureWithGemination: [string, string, string] | null = null;

  /**
   *
   * @param clusters
   * @param param1
   *
   * See the {@page Syllabification} page for how a syllable is determined.
   * Currently, the Divine Name (e.g. יהוה), non-Hebrew text, and Hebrew punctuation (e.g. _passeq_, _nun hafucha_) are treated as a _single syllable_ because these do not follow the rules of Hebrew syllabification.
   */
  constructor(clusters: Cluster[], { isClosed = false, isAccented = false, isFinal = false } = {}) {
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
   * @returns a one dimensional array of Chars
   *
   * ```typescript
   * const text: Text = new Text("וַיִּקְרָ֨א");
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
   * @returns a one dimensional array of Clusters
   *
   * ```typescript
   * const text: Text = new Text("וַיִּקְרָ֨א");
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
   * @returns the coda of the syllable, ignoring gemination of the following syllable - see {@link structure}
   */
  get coda(): string {
    return this.structure()[2];
  }

  /**
   * @returns the coda of the syllable, including gemination of the following syllable - see {@link structure}
   */
  get codaWithGemination(): string {
    return this.structure(true)[2];
  }

  /**
   * Gets the consonant _characters_ of the syllable.
   *
   * @example
   * ```typescript
   * const text: Text = new Text("רְ֭שָׁעִים");
   * text.syllables[2].consonants;
   * // ["ע", "י", "ם"]
   * ```
   *
   * @description
   * This returns a one dimensional array of consonant characters, even if the characters are not phonemic consonants.
   * Meaning evenn maters are returned as consonant characters.
   *
   * @see {@link structure} if you need the consonants with phonemic value
   *
   *
   */
  get consonants(): (keyof ConsonantCharToNameMap)[] {
    return this.clusters.map((cluster) => cluster.consonants).flat();
  }

  /**
   * Gets the names of the consonant _characters_ of the syllable.
   *
   * @example
   * ```typescript
   * const text: Text = new Text("רְ֭שָׁעִים");
   * text.syllables[2].consonantNames;
   * // ["AYIN", "YOD", "FINAL_MEM"]
   * ```
   *
   * @description
   * This returns a one dimensional array of consonant names, even if the characters are not phonemic consonants,
   * meaning even the name of maters are returned (see example).
   *
   * @see {@link structure} if you need the consonants with phonemic value
   */
  get consonantNames(): ConsonantCharToNameMap[keyof ConsonantCharToNameMap][] {
    return this.clusters.map((cluster) => cluster.consonantNames).flat();
  }

  /**
   * Returns `true` if the syllable contains the consonant _character_ matching the name passed in.
   *
   * @example
   * ```typescript
   * const text: Text = new Text("רְ֭שָׁעִים");
   * text.syllables[2].hasConsonantName("AYIN");
   * // true
   * text.syllables[2].hasConsonantName("YOD");
   * // false
   * ```
   *
   * @description
   * This checks if the syllable contains the given consonant name, even if the character is not a phonemic consonant.
   */
  hasConsonantName(name: keyof ConsonantNameToCharMap): boolean {
    if (!consonantNameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    return this.consonantNames.includes(name);
  }

  /**
   * Returns `true` if syllables contains the vowel character of the name passed in
   *
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Unlike `Cluster`, a `Syllable` is concerned with linguistics, so a sheva **is** a vowel character.
   * It returns `true` for "SHEVA" only when the sheva is the vowel (i.e. a vocal sheva or sheva na').
   *
   * ```typescript
   * const text: Text = new Text("הַיְחָבְרְךָ");
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
   */
  hasVowelName(name: keyof SyllablVowelNameToCharMap): boolean {
    if (!sylVowelNameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    if (name === "SHUREQ") {
      // if any cluster has a shureq, then that should be the defacto vowel
      return this.clusters.filter((c) => c.isShureq).length ? true : false;
    }

    const isShevaSilent = name === "SHEVA" && this.clusters.filter((c) => c.hasVowel).length ? true : false;
    return !isShevaSilent && this.text.indexOf(sylVowelNameToCharMap[name]) !== -1 ? true : false;
  }

  /**
   * @returns true if Syllable is accented
   *
   * an accented syllable receives stress
   *
   * ```typescript
   * const text: Text = new Text("וַיִּקְרָ֨א"); // note the taam over the ר
   * text.syllables[0].isAccented; // i.e. "וַ"
   * // false
   * text.syllables[2].isAccented; // i.e. "רָ֨א"
   * // true
   * ```
   */
  get isAccented(): boolean {
    return this.#isAccented;
  }

  /**
   * @param accented a boolean for whether the Syllable is accented
   *
   * an accented syllable receives stress
   */
  set isAccented(accented: boolean) {
    this.#isAccented = accented;
  }

  /**
   * @returns true if Syllable is closed
   *
   * a closed syllable in Hebrew is a CVC or CVCC type, a mater letter does not close a syllable
   *
   * ```typescript
   * const text: Text = new Text("וַיִּקְרָ֨א");
   * text.syllables[0].isClosed; // i.e. "וַ"
   * // true
   * text.syllables[2].isClosed; // i.e. "רָ֨א"
   * // false
   * ```
   */
  get isClosed(): boolean {
    return this.#isClosed;
  }

  /**
   * @param closed a boolean for whether the Syllable is closed
   *
   * a closed syllable in Hebrew is a CVC or CVCC type, a _mater_ letter does not close a syllable
   */
  set isClosed(closed: boolean) {
    this.#isClosed = closed;
  }

  /**
   * @returns true if Syllable is final
   *
   * ```typescript
   * const text: Text = new Text("וַיִּקְרָ֨א");
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
   * @param final a boolean for whether the Syllable is the final Syallble
   */
  set isFinal(final: boolean) {
    this.#isFinal = final;
  }

  /**
   * @returns the nucleus of the syllable - see {@link structure}
   */
  get nucleus(): string {
    return this.structure()[1];
  }

  /**
   * Returns the onset of the syllable - see {@link structure}
   */
  get onset(): string {
    return this.structure()[0];
  }

  /**
   * @returns the structure of the Syllable, i.e. the syllable's onset, nucleus, and coda.
   * - The onset is any initial consonant of the syllable - present in every syllable except those containing a except word-initial shureq or a furtive patah.
   * - The nucleus is the vowel of the syllable - present in every syllable and containing its {@link vowel} (with any materes lecticonis) or a shureq.
   * - The coda is all final consonants of the syllable - not including any matres lecticonis, and including the onset of the subsequent syllable if the subsequent syllable is geminated and the `withGemination` argument is `true`.
   *
   * @param withGemination If this argument is `true`, include gemination of the next syllable's onset in this syllable's coda.
   *
   * ```typescript
   * const text: Text = new Text("מַדּוּעַ");
   * text.syllables.map(s => s.structure(true));
   * // [["מ",
   * //   "ַ",
   * //   "דּ"],
   * //  ["דּ",
   * //   "וּ",
   * //   ""],
   * //  ["",
   * //   "ַ",
   * //   "ע"]]
   * ```
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
   * @returns a string that has been built up from the .text of its constituent Clusters
   *
   * ```typescript
   * const text: Text = new Text("וַיִּקְרָ֨א");
   * const sylText = text.syllables.map((syl) => syl.text);
   * sylText;
   * //  [
   * //    "וַ"
   * //    "יִּקְ"
   * //    "רָ֨א"
   * //  ]
   * ```
   */
  get text(): string {
    return this.clusters.map((c) => c.text).join("");
  }

  /**
   * Returns the vowel character of the syllable
   *
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Unlike `Cluster`, a `Syllable` is concerned with linguistics, so a sheva **is** a vowel character
   *
   * ```typescript
   * const text: Text = new Text("הַֽ֭יְחָבְרְךָ");
   * text.syllables[0].vowel;
   * // "\u{05B7}"
   * text.syllables[1].vowel;
   * // "\u{05B0}"
   * ```
   *
   * @description
   * This returns a single vowel character, even for most mater lectionis (e.g. a holam vav would return the holam, not the vav).
   * The only exception is a shureq, which returns the vav and the dagesh because there is no vowel character for a shureq.
   */
  get vowel(): keyof SyllableVowelCharToNameMap | null {
    const nucleus = this.nucleus;
    const noTaamim = removeTaamim(nucleus)[0];

    // for regular vowel characters and shureqs, this should match
    if (this.isCharKeyOfSyllableVowelCharToNameMap(noTaamim)) {
      return noTaamim;
    }

    // for maters or text with mixed scripts (e.g. Hebrew and Latin), we have to extract the vowel character
    const match = this.text.match(vowelsCaptureGroupWithSheva);
    if (match && this.isCharKeyOfSyllableVowelCharToNameMap(match[0])) {
      return match[0];
    }

    return null;
  }

  /**
   * Returns the vowel character name of the syllable
   *
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Unlike `Cluster`, a `Syllable` is concerned with linguistics, so a sheva **is** a vowel character
   *
   * ```typescript
   * const text: Text = new Text("הַֽ֭יְחָבְרְךָ");
   * text.syllables[0].vowelName;
   * // "PATAH"
   * text.syllables[1].vowelName;
   * // "SHEVA"
   *
   * @description
   * This returns the vowel name, even for most mater lectionis (e.g. a holam vav would return the HOLAM, not the vav).
   * The only exception is a shureq, which returns "SHUREQ" because there is no vowel character for a shureq.
   * ```
   */
  get vowelName(): SyllableVowelCharToNameMap[keyof SyllableVowelCharToNameMap] | null {
    const vowel = this.vowel;
    return vowel ? sylVowelCharToNameMap[vowel] : null;
  }

  get vowelNames(): SyllableVowelCharToNameMap[keyof SyllableVowelCharToNameMap][] {
    return this.vowels
      .reduce(
        (a, vowel) => {
          if (sylVowelCharToNameMap[vowel]) {
            a.push(sylVowelCharToNameMap[vowel]);
          }
          return a;
        },
        [] as SyllableVowelCharToNameMap[keyof SyllableVowelCharToNameMap][]
      )
      .flat();
  }

  /**
   * Returns an array of vowel character of the syllable
   *
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Unlike `Cluster`, a `Syllable` is concerned with linguistics, so a sheva **is** a vowel character
   *
   * ```typescript
   * const text: Text = new Text("מִתָּ֑͏ַ֜חַת");
   * text.syllables[0].vowels;
   * // ["\u{05B4}"]
   * text.syllables[1].vowels;
   * // ["\u{05B8}", "\u{05B7}"]
   * ```
   *
   * @description
   * This returns a single vowel character, even for most mater lectionis (e.g. a holam vav would return the holam, not the vav).
   * The only exception is a shureq, which returns the vav and the dagesh because there is no vowel character for a shureq.
   */
  get vowels(): (keyof SyllableVowelCharToNameMap)[] {
    // the nucleus returns as many vowels characters as there are in the syllable
    const nucleus = this.nucleus;
    const noTaamim = removeTaamim(nucleus)[0];
    const shureq = sylVowelNameToCharMap["SHUREQ"];
    const PRIVATE_CHAR = "\uE000"; // a private use character
    return noTaamim
      .replace(shureq, PRIVATE_CHAR)
      .split("")
      .reduce(
        (a, v) => {
          console.log(v);

          if (this.isCharKeyOfSyllableVowelCharToNameMap(v)) {
            a.push(v);
          }
          if (v === PRIVATE_CHAR) {
            a.push(shureq);
          }
          return a;
        },
        [] as (keyof SyllableVowelCharToNameMap)[]
      );
  }

  get word(): Word | null {
    return this.#word;
  }

  set word(word: Word | null) {
    this.#word = word;
  }
}
