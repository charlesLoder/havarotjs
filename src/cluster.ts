import { Char } from "./char";
import { Node } from "./node";
import { Syllable } from "./syllable";
import type { Consonant, ConsonantName, Taam, TaamimName, Vowel, VowelName } from "./utils/charMap";
import {
  charToNameMap,
  consonantNameToCharMap,
  isCharConsonant,
  isCharTaam,
  isCharVowel,
  taamimNameToCharMap,
  vowelNameToCharMap
} from "./utils/charMap";
import { hebChars, meteg, punctuation, taamim } from "./utils/regularExpressions";

/**
 * A cluster is group of Hebrew character constituted by:
 * - an obligatory Hebrew consonant character
 * - an optional ligature mark
 * - an optional vowel
 * - an optional taam
 *
 * @remarks
 * A <code>{@link Syllable}</code> is a linguistic unit, whereas a `Cluster` is an orthgraphic one.
 * The word `יֹו֑ם` is only one syllable, but it has three clusters—`יֹ`, `ו֑`, `ם`.
 * Because Hebrew orthography is both sub and supra linear, clusters can be encoded in various ways.
 * Every <code>{@link Char}</code> is sequenced first for normalization, see the [SBL Hebrew Font Manual](https://www.sbl-site.org/Fonts/SBLHebrewUserManual1.5x.pdf), p.8.
 */
export class Cluster extends Node<Cluster, Char, Syllable> {
  #consonantsCache: Consonant[] | null = null;
  #consonantNameCache: ConsonantName[] | null = null;
  #original: string;
  #sequenced: Char[];
  #taamimCache: Taam[] | null = null;
  #vowelsCache: Vowel[] | null = null;
  #vowelNamesCache: VowelName[] | null = null;
  #taamimNamesCache: TaamimName[] | null = null;
  #isCharConsonant = isCharConsonant;
  #isCharTaam = isCharTaam;
  #isCharVowel = isCharVowel;

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
    this.#sequenced = this.#sequence(noSequence);
    this.#sequenced.forEach((char) => (char.parent = this));
  }

  #sequence(noSequence: boolean = false) {
    const chars = [...this.original].map((char) => new Char(char));
    const sequenced = noSequence ? chars : chars.sort((a, b) => a.sequencePosition - b.sequencePosition);
    const [first, ...rest] = sequenced;
    first.siblings = rest;
    return sequenced;
  }

  get #hasMetegCharacter() {
    return Cluster.#meteg.test(this.text);
  }

  static get #meteg() {
    return meteg;
  }

  /**
   * Gets all the <code>{@link Char}</code>s in the cluster
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
  get chars() {
    return this.#sequenced;
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
   * @remarks
   * This can only every return one consonant, as a `Cluster`` is defined by having only one consonant.
   * Though it is impossible to have two consonants in a cluster, this api is meant for consistency with `vowels` and `taamim`
   */
  get consonants() {
    if (this.#consonantsCache) {
      return this.#consonantsCache;
    }

    const consonants = this.chars.reduce((a, char) => {
      const text = char.text;
      if (char.isConsonant && this.#isCharConsonant(text)) {
        a.push(text);
      }
      return a;
    }, [] as Consonant[]);

    return (this.#consonantsCache = consonants);
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
   * @remarks
   * This can only every return one consonant, as a `Cluster` is defined by having only one consonant.
   * Though it is impossible to have two consonants in a cluster, this api is meant for consistency with `vowelNames` and `taamimNames`
   */
  get consonantNames() {
    if (this.#consonantNameCache) {
      return this.#consonantNameCache;
    }

    const consonantNames = this.chars.reduce((a, char) => {
      const text = char.text;
      if (char.isConsonant && this.#isCharConsonant(text)) {
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
  hasConsonantName(name: ConsonantName) {
    if (!consonantNameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    return this.consonantNames.includes(name);
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
   * @remarks
   * The following characters are considered half-vowels:
   * - \u{05B1} HATAF SEGOL
   * - \u{05B2} HATAF PATAH
   * - \u{05B3} HATAF QAMATS
   */
  get hasHalfVowel() {
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
   * @remarks
   * The following characters are considered long vowels:
   * - \u{05B5} TSERE
   * - \u{05B8} QAMATS
   * - \u{05B9} HOLAM
   * - \u{05BA} HOLAM HASER FOR VAV
   */
  get hasLongVowel() {
    return /[\u{05B5}\u{05B8}\u{05B9}\u{05BA}]/u.test(this.text);
  }

  /**
   * Checks if the cluster contains a _meteg_
   *
   * @returns a boolean indicating if the cluster contains a _meteg_
   *
   * @deprecated use `hasMeteg`
   *
   * @example
   * ```ts
   * const text = new Text("נַפְשִֽׁי׃");
   * text.clusters[2].hasMetheg;
   * // true
   * ```
   *
   * @remarks
   * Checks if the following character is present and a _sof pasuq_ does not follow it:
   * - \u{05BD} METEG
   */
  get hasMetheg() {
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
   * // true
   * ```
   *
   * @remarks
   * Checks if the following character is present and a _sof pasuq_ does not follow it:
   * - \u{05BD} METEG
   */
  get hasMeteg() {
    if (!this.#hasMetegCharacter) {
      return false;
    }
    let next = this.next;
    while (next) {
      if (next instanceof Cluster) {
        const nextText = next.text;
        const sofPassuq = /\u{05C3}/u;
        if (Cluster.#meteg.test(nextText)) {
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
   * @remarks
   * Checks if the following character is present:
   * - \u{05B0} SHEVA
   */
  get hasSheva() {
    return /\u{05B0}/u.test(this.text);
  }

  /**
   * Checks if the cluster contains a sheva
   *
   * @returns a boolean indicating if the cluster contains a sheva
   *
   * @deprecated now use `hasSheva`
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
   * @remarks
   * Checks if the following character is present:
   * - \u{05B0} SHEVA
   */
  get hasShewa() {
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
   * @remarks
   * The following characters are considered short vowels:
   * - \u{05B4} HIRIQ
   * - \u{05B6} SEGOL
   * - \u{05B7} PATAH
   * - \u{05BB} QUBUTS
   * - \u{05C7} QAMATS QATAN
   */
  get hasShortVowel() {
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
   * @remarks
   * Checks if the following character is present and a _sof pasuq_ follows it:
   * - \u{05BD} METEG
   */
  get hasSilluq() {
    if (this.#hasMetegCharacter && !this.hasMeteg) {
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
   * const text = new Text("הָאָ֖רֶץ");
   * text.clusters[0].hasTaamName("TIPEHA");
   * // true
   * ```
   *
   * @remarks
   * Note: it only checks according to the character name, not its semantic meaning.
   * E.g. "כֵֽן׃" would be `true` when checking for `"METEG"`, not silluq
   */
  hasTaamName(name: TaamimName) {
    if (!taamimNameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }
    return this.taamimNames.includes(name);
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
   * @remarks
   * The following characters are considered taamim:
   * - \u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}
   */
  get hasTaamim() {
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
   * @remarks
   * According to [Syllabification](/guides/syllabification), a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character.
   */
  get hasVowel() {
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
   * @remarks
   * According to [Syllabification](/guides/syllabification), a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character.
   */
  hasVowelName(name: VowelName) {
    if (!vowelNameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    return this.vowelNames.includes(name);
  }

  /**
   * Checks if the cluster is a _mater_ letter
   *
   * @returns a boolean indicating if the cluster is a _mater_ letter
   *
   * @example
   * ```ts
   * const text = new Text("סוּסָה");
   * text.clusters[1].isMater; // the shureq
   * // false
   * text.clusters[3].isMater; // the heh
   * // true
   * ```
   *
   * @remarks
   *
   * Returns `true` if `Cluster.hasVowel`, `Cluster.hasSheva`, `Cluster.isShureq`, and `Cluster.next.isShureq` are all `false` and `Cluster.text` contains a:
   * - `ה` preceded by a qamets
   * - `ו` preceded by a holem
   * - `י` preceded by a hiriq, tsere, or segol
   *
   * There are potentially other instances when a consonant may be a _mater_ (e.g. a silent aleph), but these are the most common.
   * Though a shureq is a _mater_ letter, it is also a vowel itself, and thus separate from `isMater`.
   */
  get isMater() {
    const nxtIsShureq = this.next instanceof Cluster ? this.next.isShureq : false;
    if (!this.hasVowel && !this.isShureq && !this.hasSheva && !nxtIsShureq) {
      const text = this.text;
      const prevText = this.prev instanceof Cluster ? this.prev.text : "";
      const maters = /[היו](?!\u{05BC})/u;
      if (!maters.test(text)) {
        return false;
      }
      if (/ה/.test(text) && /\u{05B8}/u.test(prevText)) {
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
  get isNotHebrew() {
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
   * @remarks
   * These are all the Hebrew characters of the category PUNCTUATION
   * - \u{05BE} HEBREW PUNCTUATION MAQAF ־
   * - \u{05C0} HEBREW PUNCTUATION PASEQ ׀
   * - \u{05C3} HEBREW PUNCTUATION SOF PASUQ ׃
   * - \u{05C6} HEBREW PUNCTUATION NUN HAFUKHA ׆
   */
  get isPunctuation() {
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
   * @remarks
   * Returns `true` if `Cluster.hasVowel`, `Cluster.hasSheva`, and `Cluster.prev.hasVowel` are all `false` and `Cluster.text` is a vav followed by a dagesh (e.g. `וּ`)
   * A shureq is a vowel itself, but contains no vowel characters (hence why `hasVowel` cannot be `true`).
   * This allows for easier syllabification.
   */
  get isShureq() {
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
   * @remarks
   * This is an alias for `isPunctuation`.
   * Returns `true` is the Cluster is any of the following characters:
   * - \u{05BE} HEBREW PUNCTUATION MAQAF ־
   * - \u{05C0} HEBREW PUNCTUATION PASEQ ׀
   * - \u{05C3} HEBREW PUNCTUATION SOF PASUQ ׃
   * - \u{05C6} HEBREW PUNCTUATION NUN HAFUKHA ׆
   *
   */
  get isTaam() {
    return this.isPunctuation;
  }

  /**
   * The original string passed
   *
   * @returns the original string passed
   *
   * @remarks
   * The original string passed to the constructor that has not been normalized or sequenced. See {@link text}
   */
  get original() {
    return this.#original;
  }

  /**
   * The parent <code>{@link Syllable}</code> of the cluster
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
   * @remarks
   * If created via the <code>{@link Text}</code> class, there should always be a syllable.
   */
  get syllable() {
    return this.parent?.value ?? null;
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
  get taamim() {
    if (this.#taamimCache) {
      return this.#taamimCache;
    }

    const taamimChars = this.chars.reduce((a, char) => {
      if (char.isTaamim && this.#isCharTaam(char.text)) {
        a.push(char.text);
      }

      return a;
    }, [] as Taam[]);

    return (this.#taamimCache = taamimChars);
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
  get taamimNames() {
    if (this.#taamimNamesCache) {
      return this.#taamimNamesCache;
    }

    const taaminNames = this.chars.reduce((a, char) => {
      const text = char.text;
      if (char.isTaamim && this.#isCharTaam(text)) {
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
   * @remarks
   * The text has been normalized and sequenced — see {@link original} for text passed in the constructor.
   */
  get text() {
    return this.chars.reduce((init, char) => init + char.text, "");
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
   * @remarks
   * It is exceedingly rare to find more than one vowel character in a cluster.
   * According to [Syllabification](/guides/syllabification), a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character
   */
  get vowelNames() {
    if (this.#vowelNamesCache) {
      return this.#vowelNamesCache;
    }

    const vowelNames = this.chars.reduce((a, char) => {
      if (char.isVowel && this.#isCharVowel(char.text)) {
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
   * @remarks
   * It is exceedingly rare to find more than one vowel character in a cluster.
   * According to [Syllabification](/guides/syllabification), a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character
   */
  get vowels() {
    if (this.#vowelsCache) {
      return this.#vowelsCache;
    }

    const vowels = this.chars.reduce((a, char) => {
      const text = char.text;
      if (char.isVowel && this.#isCharVowel(text)) {
        a.push(text);
      }
      return a;
    }, [] as Vowel[]);

    return (this.#vowelsCache = vowels);
  }
}
