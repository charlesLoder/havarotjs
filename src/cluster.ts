import { Char } from "./char";
import { Node } from "./node";
import { Syllable } from "./syllable";
import {
  ConsonantCharToNameMap,
  TaamimCharToNameMap,
  VowelCharToNameMap,
  charToNameMap,
  consonantNameToCharMap,
  isCharKeyOfConsonantNameToCharMap,
  isCharKeyOfTaamimNameToCharMap,
  isCharKeyOfVowelNameToCharMap,
  vowelNameToCharMap
} from "./utils/charMap";
import { hebChars, meteg, punctuation, taamim } from "./utils/regularExpressions";

export type Consonant = keyof ConsonantCharToNameMap;
export type ConsonantName = ConsonantCharToNameMap[keyof ConsonantCharToNameMap];
export type Taam = keyof TaamimCharToNameMap;
export type TaamimName = TaamimCharToNameMap[keyof TaamimCharToNameMap];
export type Vowel = keyof VowelCharToNameMap;
export type VowelName = VowelCharToNameMap[keyof VowelCharToNameMap];

/**
 * A cluster is group of Hebrew character constituted by:
 * - an obligatory Hebrew consonant character
 * - an optional ligature mark
 * - an optional vowel
 * - an optional taam
 *
 * A [[`Syllable`]] is a linguistic unit, whereas a `Cluster` is an orthgraphic one.
 * The word `יֹו֑ם` is only one syllable, but it has three clusters—`יֹ`, `ו֑`, `ם`.
 * Because Hebrew orthography is both sub and supra linear, clusters can be encoded in various ways.
 * Every [[`Char`]] is sequenced first for normalization, see the [SBL Hebrew Font Manual](https://www.sbl-site.org/Fonts/SBLHebrewUserManual1.5x.pdf), p.8.
 */
export class Cluster extends Node<Cluster> {
  #consonantsCache: Consonant[] | null = null;
  #consonantNameCache: ConsonantName[] | null = null;
  #original: string;
  #sequenced: Char[];
  #syllable: Syllable | null = null;
  #taamimCache: Taam[] | null = null;
  #vowelsCache: Vowel[] | null = null;
  #vowelNamesCache: VowelName[] | null = null;
  #taamimNamesCache: TaamimName[] | null = null;

  /**
   * Creates a new cluster
   *
   * @param cluster - the original cluster
   * @param noSequence - whether to sequence the cluster
   *
   * @example
   * ```ts
   * const str = "הָ";
   * const cluster = new Cluster(str);
   * cluster.text;
   * // "הָ"
   * ```
   */
  constructor(cluster: string, noSequence: boolean = false) {
    super();
    this.value = this;
    this.#original = cluster;
    this.#sequenced = this.sequence(noSequence);
    this.#sequenced.forEach((char) => (char.cluster = this));
  }

  private sequence(noSequence: boolean = false): Char[] {
    const chars = [...this.original].map((char) => new Char(char));
    return noSequence ? chars : chars.sort((a, b) => a.sequencePosition - b.sequencePosition);
  }

  private isCharKeyOfConsonantNameToCharMap = isCharKeyOfConsonantNameToCharMap;

  private isCharKeyOfTaamimNameToCharMap = isCharKeyOfTaamimNameToCharMap;

  private isCharKeyOfVowelNameToCharMap = isCharKeyOfVowelNameToCharMap;

  private get hasMetegCharacter(): boolean {
    return Cluster.meteg.test(this.text);
  }

  private static get meteg() {
    return meteg;
  }

  /**
   * Gets all the {@link Char | characters} in the Cluster
   *
   * @returns an array of sequenced Char objects
   *
   * @example
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * text.clusters[0].chars;
   * // [
   * //  Char { original: "ה" },
   * //  Char { original: "ֲ " },   i.e. \u{05B2} (does not print well)
   * // ]
   * ```
   */
  get chars(): Char[] {
    return this.#sequenced;
  }

  /**
   * Gets the first consonant character in the cluster
   *
   * @returns the first consonant character in the cluster
   *
   * @example
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * text.clusters[0].consonant;
   * // "ה"
   * ```
   *
   * @description
   * A Cluster only ever has one consonant.
   */
  get consonant(): Consonant | null {
    return this.consonants[0] || null;
  }

  /**
   * Gets all the consonant characters in the cluster
   *
   * @returns an array of the consonant characters in the cluster
   *
   * @example
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * text.clusters[0].consonants;
   * // ["ה"]
   * ```
   *
   * @warning
   * This can only every return one consonant, as a `Cluster` is defined by having only one consonant.
   * Though it is impossible to have two consonants in a cluster, this api is meant for consistency with `vowels` and `taamim`
   */
  get consonants(): Consonant[] {
    if (this.#consonantsCache) {
      return this.#consonantsCache;
    }

    const consonants = this.chars.reduce((a, char) => {
      const text = char.text;
      if (char.isConsonant && this.isCharKeyOfConsonantNameToCharMap(text)) {
        a.push(text);
      }
      return a;
    }, [] as Consonant[]);

    return (this.#consonantsCache = consonants);
  }

  /**
   * Gets the name of the first consonant character in the cluster
   *
   * @returns the name of the first consonant character in the cluster
   *
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * text.clusters[0].consonantName;
   * // "HE"
   * ```
   */
  get consonantName(): ConsonantName | null {
    return this.consonantNames[0] ?? null;
  }

  /**
   * Gets all consonant names in the cluster.
   *
   * @returns an array of the consonant names in the cluster
   *
   * @example
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * text.clusters[0].consonantNames;
   * // ["HE"]
   * ```
   *
   * @warning
   * This can only every return one consonant, as a `Cluster` is defined by having only one consonant.
   * Though it is impossible to have two consonants in a cluster, this api is meant for consistency with `vowelNames` and `taamimNames`
   */
  get consonantNames(): ConsonantName[] {
    if (this.#consonantNameCache) {
      return this.#consonantNameCache;
    }

    const consonantNames = this.chars.reduce((a, char) => {
      const text = char.text;
      if (char.isConsonant && this.isCharKeyOfConsonantNameToCharMap(text)) {
        a.push(charToNameMap[text]);
      }
      return a;
    }, [] as ConsonantName[]);

    return (this.#consonantNameCache = consonantNames);
  }

  /**
   * Checks if the cluster contains the consonant character of the name passed in
   *
   * @returns a boolean indicating if the cluster contains the consonant character of the name passed in
   *
   * @example
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * text.clusters[0].hasConsonantName("HE");
   * // true
   * text.clusters[0].hasConsonantName("BET");
   * // false
   * ```
   */
  hasConsonantName(name: ConsonantName): boolean {
    if (!consonantNameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    const char = this.chars.find((c) => c.isCharacterName(name));

    return !!char;
  }

  /**
   * Checks if the cluster contains a half-vowel
   *
   * @returns a boolean indicating if the cluster contains a half-vowel
   *
   * @example
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * text.clusters[0].hasHalfVowel;
   * // true
   * text.clusters[1].hasHalfVowel;
   * // false
   * ```
   *
   * @description
   * The following characters are considered half-vowels:
   * - \u{05B1} HATAF SEGOL
   * - \u{05B2} HATAF PATAH
   * - \u{05B3} HATAF QAMATS
   */
  get hasHalfVowel(): boolean {
    return /[\u{05B1}-\u{05B3}]/u.test(this.text);
  }

  /**
   * Checks if the cluster contains a long vowel
   *
   * @returns a boolean indicating if the cluster contains a long vowel
   *
   * @example
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * text.clusters[0].hasLongVowel;
   * // false
   * text.clusters[1].hasLongVowel;
   * // true
   * ```
   *
   * @description
   * The following characters are considered long vowels:
   * - \u{05B5} TSERE
   * - \u{05B8} QAMATS
   * - \u{05B9} HOLAM
   * - \u{05BA} HOLAM HASER FOR VAV
   */
  get hasLongVowel(): boolean {
    return /[\u{05B5}\u{05B8}\u{05B9}\u{05BA}]/u.test(this.text);
  }

  /**
   * Checks if the cluster contains a _meteg_
   *
   * @returns a boolean indicating if the cluster contains a _meteg_
   *
   * @deprecated use `hasMeteg`
   *
   * ```typescript
   * const text: Text = new Text("נַפְשִֽׁי׃");
   * text.clusters[2].hasMetheg;
   * // true
   * ```
   *
   * @description
   * Checks if the following character is present and a _sof pasuq_ does not follow it:
   * - \u{05BD} METEG
   */
  get hasMetheg(): boolean {
    return this.hasMeteg;
  }

  /**
   * Checks if the cluster contains a _meteg_
   *
   * @returns a boolean indicating if the cluster contains a _meteg_
   *
   * ```ts
   * const text = new Text("נַפְשִֽׁי׃");
   * text.clusters[2].hasMetheg;
   * // truw
   * ```
   *
   * @description
   * Checks if the following character is present and a _sof pasuq_ does not follow it:
   * - \u{05BD} METEG
   */
  get hasMeteg(): boolean {
    if (!this.hasMetegCharacter) {
      return false;
    }
    let next = this.next;
    while (next) {
      if (next instanceof Cluster) {
        const nextText = next.text;
        const sofPassuq = /\u{05C3}/u;
        if (Cluster.meteg.test(nextText)) {
          return true;
        }
        if (sofPassuq.test(nextText)) {
          return false;
        }
        next = next.next;
      }
    }
    return true;
  }

  /**
   * Checks if the cluster contains a sheva
   *
   * @returns a boolean indicating if the cluster contains a sheva
   *
   * @example
   * ```ts
   * const text = new Text("מַלְכָּה");
   * text.clusters[0].hasSheva;
   * // false
   * text.clusters[1].hasSheva;
   * // true
   * ```
   *
   * @description
   * Checks if the following character is present:
   * - \u{05B0} SHEVA
   */
  get hasSheva(): boolean {
    return /\u{05B0}/u.test(this.text);
  }

  /**
   * Checks if the cluster contains a sheva
   *
   * @returns a boolean indicating if the cluster contains a sheva
   *
   * @deprecated now use `hasSheva`
   *
   * ```ts
   * const text = new Text("מַלְכָּה");
   * text.clusters[0].hasSheva;
   * // false
   * text.clusters[1].hasSheva;
   * // true
   * ```
   *
   * @description
   * Checks if the following character is present:
   * - \u{05B0} SHEVA
   */
  get hasShewa(): boolean {
    return this.hasSheva;
  }

  /**
   * Checks if the cluster contains a short vowel
   *
   * @returns a boolean indicating if the cluster contains a short vowel
   *
   * @example
   * ```ts
   * const text = new Text("מַלְכָּה");
   * text.clusters[0].hasShortVowel;
   * // true
   * text.clusters[2].hasShortVowel;
   * // false
   * ```
   *
   * @description
   * The following characters are considered short vowels:
   * - \u{05B4} HIRIQ
   * - \u{05B6} SEGOL
   * - \u{05B7} PATAH
   * - \u{05BB} QUBUTS
   * - \u{05C7} QAMATS QATAN
   */
  get hasShortVowel(): boolean {
    return /[\u{05B4}\u{05B6}\u{05B7}\u{05BB}\u{05C7}]/u.test(this.text);
  }

  /**
   * Checks if the cluster contains a _silluq_
   *
   * @returns a boolean indicating if the cluster contains a _silluq_
   *
   * @example
   * ```ts
   * const text = new Text("הָאָֽרֶץ׃");
   * text.clusters[2].hasSilluq;
   * // true
   * ```
   *
   * @description
   * Checks if the following character is present and a _sof pasuq_ follows it:
   * - \u{05BD} METEG
   */
  get hasSilluq(): boolean {
    if (this.hasMetegCharacter && !this.hasMeteg) {
      // if it has a meteg character, but the character is not a meteg
      // then infer it is silluq
      return true;
    }
    return false;
  }

  /**
   * Checks if the cluster contains a taamim character
   *
   * @returns a boolean indicating if the cluster contains a taamim character
   *
   * @example
   * ```ts
   * const text = new Text("אֱלֹהִ֑ים");
   * text.clusters[0].hasTaamim;
   * // false
   * text.clusters[2].hasTaamim;
   * // true
   * ```
   *
   * @description
   * The following characters are considered taamim:
   * - \u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}
   */
  get hasTaamim(): boolean {
    return taamim.test(this.text);
  }

  /**
   * Checks if the cluster contains any vowel character
   *
   * @returns a boolean indicating if the cluster contains any vowel character
   *
   * @example
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * text.clusters[0].hasVowel;
   * // true
   * text.clusters[4].hasVowel;
   * // false
   * ```
   *
   * @description
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character.
   */
  get hasVowel(): boolean {
    return this.hasLongVowel || this.hasShortVowel || this.hasHalfVowel;
  }

  /**
   * Checks if the cluster contains the vowel character of the name passed in
   *
   * @returns a boolean indicating if the cluster contains the vowel character of the name passed in
   *
   * @example
   * ```ts
   * const text = new Text("הַיְחָבְרְךָ");
   * text.clusters[0].hasVowelName("PATAH");
   * // true
   * text.clusters[0].hasVowelName("HIRIQ");
   * // false
   * ```
   *
   * @description
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character.
   */
  hasVowelName(name: VowelName): boolean {
    if (!vowelNameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    const char = this.chars.find((c) => c.isCharacterName(name));

    return !!char;
  }

  /**
   * Checks if the cluster is a _mater_ letter
   *
   * @returns a boolean indicating if the cluster is a _mater_ letter
   *
   *@example
   * ```ts
   * const text = new Text("סוּסָה");
   * text.clusters[1].isMater; // the shureq
   * // false
   * text.clusters[3].isMater; // the heh
   * // true
   * ```
   *
   * @description
   *
   * Returns `true` if `Cluster.hasVowel`, `Cluster.hasSheva`, `Cluster.isShureq`, and `Cluster.next.isShureq` are all `false` and `Cluster.text` contains a:
   * - `ה` preceded by a qamets, tsere, or segol
   * - `ו` preceded by a holem
   * - `י` preceded by a hiriq, tsere, or segol
   *
   * There are potentially other instances when a consonant may be a _mater_ (e.g. a silent aleph), but these are the most common.
   * Though a shureq is a _mater_ letter, it is also a vowel itself, and thus separate from `isMater`.
   */
  get isMater(): boolean {
    const nxtIsShureq = this.next instanceof Cluster ? this.next.isShureq : false;
    if (!this.hasVowel && !this.isShureq && !this.hasSheva && !nxtIsShureq) {
      const text = this.text;
      const prevText = this.prev instanceof Cluster ? this.prev.text : "";
      const maters = /[היו](?!\u{05BC})/u;
      if (!maters.test(text)) {
        return false;
      }
      if (/ה/.test(text) && /\u{05B8}|\u{05B6}|\u{05B5}/u.test(prevText)) {
        return true;
      }
      if (/ו/.test(text) && /\u{05B9}/u.test(prevText)) {
        return true;
      }
      if (/י/.test(text) && /\u{05B4}|\u{05B5}|\u{05B6}/u.test(prevText)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks if the Cluster does not have Hebrew chars
   *
   * @returns a boolean indicating if the Cluster does not have Hebrew chars
   *
   * ```ts
   * * const text = new Text("(לְעֹלָם)");
   * text.clusters[0].isNotHebrew;
   * // true
   * ```
   */
  get isNotHebrew(): boolean {
    return !hebChars.test(this.text);
  }

  /**
   * Checks if the Cluster has any punctuation characters
   *
   * @returns a boolean indicating if the Cluster has any punctuation characters
   *
   * @example
   * ```ts
   * const text = new Text("הָאָֽרֶץ׃");
   * text.clusters[3].isPunctuation;
   * // true
   * ```
   *
   * @description
   * These are all the Hebrew characters of the category PUNCTUATION
   * - \u{05BE} HEBREW PUNCTUATION MAQAF ־
   * - \u{05C0} HEBREW PUNCTUATION PASEQ ׀
   * - \u{05C3} HEBREW PUNCTUATION SOF PASUQ ׃
   * - \u{05C6} HEBREW PUNCTUATION NUN HAFUKHA ׆
   */
  get isPunctuation(): boolean {
    const punctuationOnly = new RegExp(`^${punctuation.source}+$`, "u");
    return punctuationOnly.test(this.text);
  }

  /**
   * Checks if the Cluster is a shureq
   *
   * @returns a boolean indicating if the Cluster is a shureq
   *
   *
   * ```ts
   * const text = new Text("קוּם");
   * text.clusters[0].isShureq;
   * // false
   * text.clusters[1].isShureq;
   * // true
   * ```
   *
   * @description
   * Returns `true` if `Cluster.hasVowel`, `Cluster.hasSheva`, and `Cluster.prev.hasVowel` are all `false` and `Cluster.text` is a vav followed by a dagesh (e.g. `וּ`)
   * A shureq is a vowel itself, but contains no vowel characters (hence why `hasVowel` cannot be `true`).
   * This allows for easier syllabification.
   */
  get isShureq(): boolean {
    const shureq = /\u{05D5}\u{05BC}/u;
    const prvHasVowel = this.prev?.value?.hasVowel ?? false;
    return !this.hasVowel && !this.hasSheva && !prvHasVowel ? shureq.test(this.text) : false;
  }

  /**
   * Checks if the Cluster is a taam
   *
   * @returns a boolean indicating if the Cluster is a taam
   *
   * @example
   * ```ts
   * const text = new Text("הָאָֽרֶץ׃");
   * text.clusters[3].isTaam;
   * // true
   * ```
   *
   * @description
   * This is an alias for `isPunctuation`.
   * Returns `true` is the Cluster is any of the following characters:
   * - \u{05BE} HEBREW PUNCTUATION MAQAF ־
   * - \u{05C0} HEBREW PUNCTUATION PASEQ ׀
   * - \u{05C3} HEBREW PUNCTUATION SOF PASUQ ׃
   * - \u{05C6} HEBREW PUNCTUATION NUN HAFUKHA ׆
   *
   */
  get isTaam(): boolean {
    return this.isPunctuation;
  }

  /**
   * The original string passed
   *
   * @returns the original string passed
   *
   * @description
   * The original string passed to the constructor that has not been normalized or sequenced. See {@link text}
   */
  get original(): string {
    return this.#original;
  }

  /**
   * The parent `Syllable` of the cluster
   *
   * ```ts
   * const text = new Text("דָּבָר");
   * const lastCluster: Cluster = text.clusters[2];
   * lastCluster.text;
   * // "ר"
   * lastCluster.syllable.text;
   * // "בָר"
   * ```
   *
   * @description
   * If created via the `Text` class, there should always be a syllable.
   */
  get syllable(): Syllable | null {
    return this.#syllable;
  }

  /**
   * Sets the parent `Syllable` of the cluster
   *
   */
  set syllable(syllable: Syllable | null) {
    this.#syllable = syllable;
  }

  /**
   * Gets the first taamim character of the cluster
   *
   * @returns the first taamim character in the cluster
   *
   * @example
   * ```ts
   * const text: Text = new Text("בֺ֨");
   * text.clusters[0].taam;
   * // "֨" (i.e. \u{05A8})
   * ```
   */
  get taam(): Taam | null {
    return this.taamim[0] ?? null;
  }

  /**
   * Gets all the taamim characters in the cluster
   *
   * @returns an array of taamim characters in the cluster
   *
   * ```ts
   * const text = new Text("אֱלֹהֶ֑֔יךָ");
   * text.clusters[2].taamim;
   * // ["֑", "֔"]
   * ```
   */
  get taamim(): Taam[] {
    if (this.#taamimCache) {
      return this.#taamimCache;
    }

    const taamimChars = this.chars.reduce((a, char) => {
      if (char.isTaamim && this.isCharKeyOfTaamimNameToCharMap(char.text)) {
        a.push(char.text);
      }

      return a;
    }, [] as Taam[]);

    return (this.#taamimCache = taamimChars);
  }

  /**
   * Gets the name of the first taamim character in the cluster
   *
   * @returns the name of the first taamim character in the cluster
   *
   * ```ts
   * const text = new Text("בֺ֨");
   * text.clusters[0].taam;
   * // "QADMA"
   * ```
   */
  get taamName(): TaamimName | null {
    return this.taamimNames[0] ?? null;
  }

  /**
   * Gets all the names of the taamim characters in the cluster
   *
   * @returns an array of names of taamim characters in the cluster
   *
   * ```ts
   * const text = new Text("אֱלֹהֶ֑֔יךָ");
   * text.clusters[2].taam;
   * // ['ETNAHTA', 'ZAQEF_QATAN' ]
   * ```
   */
  get taamimNames(): TaamimName[] {
    if (this.#taamimNamesCache) {
      return this.#taamimNamesCache;
    }

    const taaminNames = this.chars.reduce((a, char) => {
      const text = char.text;
      if (char.isTaamim && this.isCharKeyOfTaamimNameToCharMap(text)) {
        a.push(charToNameMap[text]);
      }

      return a;
    }, [] as TaamimName[]);

    return (this.#taamimNamesCache = taaminNames);
  }

  /**
   * Gets text of the cluster
   *
   * @returns the text of the cluster that has been built up from the .text of its constituent `Char`s
   *
   * @example
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * const clusters = text.clusters.map((cluster) => cluster.text);
   * // [
   * //  "הֲ",
   * //  "בָ",
   * //  "רֹ",
   * //  "ו",
   * //  "ת"
   * // ]
   * ```
   *
   * @description
   * The text has been normalized and sequenced — see {@link original} for text passed in the constructor.
   */
  get text(): string {
    return this.chars.reduce((init, char) => init + char.text, "");
  }

  /**
   * Gets the first vowel character of the cluster
   *
   * @returns the first vowel character in the cluster
   *
   * @example
   * ```ts
   * const text = new Text("הַֽ֭יְחָבְרְךָ");
   * text.clusters[0].vowel;
   * // "\u{05B7}"
   * text.clusters[3].vowel;
   * // null
   * ```
   *
   * @description
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character
   */
  get vowel(): keyof VowelCharToNameMap | null {
    return this.vowels[0] ?? null;
  }

  /**
   * Gets the name of the first vowel character in the cluster
   *
   * @returns the name of the first vowel character in the cluster
   *
   * @example
   * ```ts
   * const text = new Text("הַֽ֭יְחָבְרְךָ");
   * text.clusters[0].vowelName;
   * // "PATAH"
   * text.clusters[3].vowelName;
   * // null
   * ```
   *
   * @description
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character
   */
  get vowelName(): VowelCharToNameMap[keyof VowelCharToNameMap] | null {
    return this.vowelNames[0] ?? null;
  }

  /**
   * Gets all the names of the vowel characters in the cluster
   *
   * @returns an array of names of vowel characters in the cluster
   *
   * @example
   * ```ts
   * const text = new Text("הַֽ֭יְחָבְרְךָ");
   * text.clusters[0].vowelNames;
   * // ['PATAH']
   * ```
   *
   * @description
   * It is exceedingly rare to find more than one vowel character in a cluster.
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character
   */
  get vowelNames(): VowelName[] {
    if (this.#vowelNamesCache) {
      return this.#vowelNamesCache;
    }

    const vowelNames = this.chars.reduce((a, char) => {
      if (char.isVowel && this.isCharKeyOfVowelNameToCharMap(char.text)) {
        a.push(charToNameMap[char.text]);
      }

      return a;
    }, [] as VowelName[]);

    return (this.#vowelNamesCache = vowelNames);
  }

  /**
   * Gets all the vowel characters in the cluster
   *
   * @returns an array of vowel characters in the cluster
   *
   * @example
   * ```ts
   * const text = new Text("הַֽ֭יְחָבְרְךָ");
   * text.clusters[0].vowel;
   * // "\u{05B7}"
   * text.clusters[3].vowel;
   * // null
   * ```
   *
   * @description
   * It is exceedingly rare to find more than one vowel character in a cluster.
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character
   */
  get vowels(): Vowel[] {
    if (this.#vowelsCache) {
      return this.#vowelsCache;
    }

    const vowels = this.chars.reduce((a, char) => {
      const text = char.text;
      if (char.isVowel && this.isCharKeyOfVowelNameToCharMap(text)) {
        a.push(text);
      }
      return a;
    }, [] as Vowel[]);

    return (this.#vowelsCache = vowels);
  }
}
