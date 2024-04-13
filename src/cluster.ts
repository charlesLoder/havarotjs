import { Char } from "./char";
import { Node } from "./node";
import { Syllable } from "./syllable";
import { CharToNameMap, NameToCharMap, charToNameMap, isCharKeyOfCharToNameMap, nameToCharMap } from "./utils/charMap";
import { hebChars, meteg, punctuation, taamim } from "./utils/regularExpressions";

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
  #original: string;
  #sequenced: Char[];
  #syllable: Syllable | null = null;

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

  private isCharKeyOfCharToNameMap = isCharKeyOfCharToNameMap;

  private get hasMetegCharacter(): boolean {
    return Cluster.meteg.test(this.text);
  }

  private static get meteg() {
    return meteg;
  }

  /**
   * @returns an array of sequenced Char objects
   *
   * ```typescript
   * const text: Text = new Text("הֲבָרֹות");
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
   *
   * Returns `true` if one of the following long vowel characters is present:
   * - \u{05B1} HATAF SEGOL
   * - \u{05B2} HATAF PATAH
   * - \u{05B3} HATAF QAMATS
   *
   * ```typescript
   * const text: Text = new Text("הֲבָרֹות");
   * text.clusters[0].hasHalfVowel;
   * // true
   * text.clusters[1].hasHalfVowel;
   * // false
   * ```
   */
  get hasHalfVowel(): boolean {
    return /[\u{05B1}-\u{05B3}]/u.test(this.text);
  }

  /**
   * Returns `true` if one of the following long vowel characters is present:
   * - \u{05B5} TSERE
   * - \u{05B8} QAMATS
   * - \u{05B9} HOLAM
   * - \u{05BA} HOLAM HASER FOR VAV
   *
   * ```typescript
   * const text: Text = new Text("הֲבָרֹות");
   * text.clusters[0].hasLongVowel;
   * // false
   * text.clusters[1].hasLongVowel;
   * // true
   * ```
   */
  get hasLongVowel(): boolean {
    return /[\u{05B5}\u{05B8}\u{05B9}\u{05BA}]/u.test(this.text);
  }

  /**
   * Returns `true` if the following character is present and a _sof pasuq_ does not follow it:
   * - \u{05BD} METEG
   *
   * @deprecated use `hasMeteg`
   *
   * ```typescript
   * const text: Text = new Text("הֲבָרֹות");
   * text.clusters[0].hasMetheg;
   * // false
   * ```
   */
  get hasMetheg(): boolean {
    return this.hasMeteg;
  }

  /**
   * Returns `true` if the following character is present and a _sof pasuq_ does **not** follow it:
   * - \u{05BD} METEG
   *
   * ```typescript
   * const text: Text = new Text("וַֽיִּמְצְא֗וּ");
   * text.clusters[0].hasMeteg;
   * // true
   * ```
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
   * Returns `true` if the following character is present:
   * - \u{05B0} SHEVA
   *
   * ```typescript
   * const text: Text = new Text("מַלְכָּה");
   * text.clusters[0].hasSheva;
   * // false
   * text.clusters[1].hasSheva;
   * // true
   * ```
   */
  get hasSheva(): boolean {
    return /\u{05B0}/u.test(this.text);
  }

  /**
   * Returns `true` if the following character is present:
   * - \u{05B0} SHEVA
   *
   * @deprecated now use `hasSheva`
   *
   * ```typescript
   * const text: Text = new Text("מַלְכָּה");
   * text.clusters[0].hasSheva;
   * // false
   * text.clusters[1].hasSheva;
   * // true
   * ```
   */
  get hasShewa(): boolean {
    return this.hasSheva;
  }

  /**
   * Returns `true` if one of the following long vowel characters is present:
   * - \u{05B4} HIRIQ
   * - \u{05B6} SEGOL
   * - \u{05B7} PATAH
   * - \u{05BB} QUBUTS
   * - \u{05C7} QAMATS QATAN
   *
   * ```typescript
   * const text: Text = new Text("מַלְכָּה");
   * text.clusters[0].hasShortVowel;
   * // true
   * text.clusters[2].hasShortVowel;
   * // false
   * ```
   */
  get hasShortVowel(): boolean {
    return /[\u{05B4}\u{05B6}\u{05B7}\u{05BB}\u{05C7}]/u.test(this.text);
  }

  /**
   * Returns `true` if the following character is present and a _sof pasuq_ follows it:
   * - \u{05BD} METEG
   *
   * ```typescript
   * const text: Text = new Text("הָאָֽרֶץ׃");
   * text.clusters[1].hasSilluq;
   * // true
   * ```
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
   * Returns `true` if the following characters are present:
   * - \u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}
   *
   * ```typescript
   * const text: Text = new Text("אֱלֹהִ֑ים");
   * text.clusters[0].hasTaamim;
   * // false
   * text.clusters[2].hasTaamim;
   * // true
   * ```
   */
  get hasTaamim(): boolean {
    return taamim.test(this.text);
  }

  /**
   * Returns `true` if `Cluster.hasLongVowel`, `Cluster.hasShortVowel`, or `Cluster.hasHalfVowel` is true.
   *
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character.
   *
   * ```typescript
   * const text: Text = new Text("הֲבָרֹות");
   * text.clusters[0].hasVowel;
   * // true
   * text.clusters[4].hasVowel;
   * // false
   * ```
   */
  get hasVowel(): boolean {
    return this.hasLongVowel || this.hasShortVowel || this.hasHalfVowel;
  }

  /**
   * Returns `true` if cluster contains the vowel character of the name passed in
   *
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character.
   *
   * ```typescript
   * const text: Text = new Text("הַיְחָבְרְךָ");
   * text.clusters[0].hasVowelName("PATAH");
   * // true
   * text.clusters[0].hasVowelName("HIRIQ");
   * // false
   * ```
   */
  hasVowelName(name: keyof NameToCharMap): boolean {
    if (!nameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    const char = this.chars.find((char) => char.isCharacterName(name));

    return !!char;
  }

  /**
   * Returns `true` if `Cluster.hasVowel`, `Cluster.hasSheva`, `Cluster.isShureq`, and `Cluster.next.isShureq` are all `false` and `Cluster.text` contains a:
   * - `ה` preceded by a qamets, tsere, or segol
   * - `ו` preceded by a holem
   * - `י` preceded by a hiriq, tsere, or segol
   *
   * There are potentially other instances when a consonant may be a _mater_ (e.g. a silent aleph), but these are the most common.
   * Though a shureq is a _mater_ letter, it is also a vowel itself, and thus separate from `isMater`.
   *
   * ```typescript
   * const text: Text = new Text("סוּסָה");
   * text.clusters[1].isMater; // the shureq
   * // false
   * text.clusters[3].isMater; // the heh
   * // true
   * ```
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
   * Returns `true` if the Cluster does not have Hebrew chars
   *
   * ```typescript
   * * const text: Text = new Text("(לְעֹלָם)");
   * text.clusters[0].isNotHebrew;
   * // true
   * ```
   */
  get isNotHebrew(): boolean {
    return !hebChars.test(this.text);
  }

  /**
   * Returns `true` is the Cluster is any of the following characters:
   * - \u{05BE} HEBREW PUNCTUATION MAQAF ־
   * - \u{05C0} HEBREW PUNCTUATION PASEQ ׀
   * - \u{05C3} HEBREW PUNCTUATION SOF PASUQ ׃
   * - \u{05C6} HEBREW PUNCTUATION NUN HAFUKHA ׆
   *
   * ```typescript
   * const text: Text = new Text("הָאָֽרֶץ׃");
   * text.clusters[3].isPunctuation;
   * // true
   * ```
   *
   * @description
   * These are all the Hebrew characters of the category PUNCTUATION
   */
  get isPunctuation(): boolean {
    const punctuationOnly = new RegExp(`^${punctuation.source}+$`, "u");
    return punctuationOnly.test(this.text);
  }

  /**
   *
   * Returns `true` if `Cluster.hasVowel`, `Cluster.hasSheva`, and `Cluster.prev.hasVowel` are all `false` and `Cluster.text` is a waw followed by a dagesh (e.g. `וּ`)
   * A shureq is a vowel itself, but contains no vowel characters (hence why `hasVowel` cannot be `true`).
   * This allows for easier syllabification.
   *
   * ```typescript
   * const text: Text = new Text("קוּם");
   * text.clusters[0].isShureq;
   * // false
   * text.clusters[1].isShureq;
   * // true
   * ```
   */
  get isShureq(): boolean {
    const shureq = /\u{05D5}\u{05BC}/u;
    const prvHasVowel = this.prev?.value?.hasVowel ?? false;
    return !this.hasVowel && !this.hasSheva && !prvHasVowel ? shureq.test(this.text) : false;
  }

  /**
   * An alias of `isPunctuation`.
   * Returns `true` is the Cluster is any of the following characters:
   * - \u{05BE} HEBREW PUNCTUATION MAQAF ־
   * - \u{05C0} HEBREW PUNCTUATION PASEQ ׀
   * - \u{05C3} HEBREW PUNCTUATION SOF PASUQ ׃
   * - \u{05C6} HEBREW PUNCTUATION NUN HAFUKHA ׆
   *
   * ```typescript
   * const text: Text = new Text("הָאָֽרֶץ׃");
   * text.clusters[3].isPunctuation;
   * // true
   * ```
   *
   * @description
   * These are all the Hebrew characters of the category PUNCTUATION
   */
  get isTaam(): boolean {
    return this.isPunctuation;
  }

  /**
   * @returns the original string passed
   */
  get original(): string {
    return this.#original;
  }

  /**
   * The parent `Syllable` of the cluster, if any.
   *
   * ```typescript
   * const text: Text = new Text("דָּבָר");
   * const lastCluster: Cluster = text.clusters[2];
   * lastCluster.text;
   * // "ר"
   * lastCluster.syllable.text;
   * // "בָר"
   * ```
   */
  get syllable(): Syllable | null {
    return this.#syllable;
  }

  set syllable(syllable: Syllable | null) {
    this.#syllable = syllable;
  }

  /**
   * @returns a string that has been built up from the text of its constituent Chars
   *
   * ```typescript
   * const text: Text = new Text("הֲבָרֹות");
   * const clusters = text.clusters.map((cluster) => cluster.text);
   * // [
   * //  "הֲ",
   * //  "בָ",
   * //  "רֹ",
   * //  "ו",
   * //  "ת"
   * // ]
   * ```
   */
  get text(): string {
    return this.chars.reduce((init, char) => init + char.text, "");
  }

  /**
   * Returns the vowel character of the cluster
   *
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character
   *
   * ```typescript
   * const text: Text = new Text("הַֽ֭יְחָבְרְךָ");
   * text.clusters[0].vowel;
   * // "\u{05B7}"
   * text.clusters[3].vowel;
   * // null
   * ```
   */
  get vowel(): keyof CharToNameMap | null {
    const char = this.chars.find((char) => char.isVowel);

    if (!char) {
      return null;
    }

    return this.isCharKeyOfCharToNameMap(char.text) ? char.text : null;
  }

  /**
   * Returns the vowel character name of the cluster
   *
   * According to {@page Syllabification}, a sheva is a vowel and serves as the nucleus of a syllable.
   * Because `Cluster` is concerned with orthography, a sheva is **not** a vowel character
   *
   * ```typescript
   * const text: Text = new Text("הַֽ֭יְחָבְרְךָ");
   * text.clusters[0].vowelName;
   * // "PATAH"
   * text.clusters[3].vowelName;
   * // null
   * ```
   */
  get vowelName(): CharToNameMap[keyof CharToNameMap] | null {
    const vowel = this.vowel;
    return vowel ? charToNameMap[vowel] : null;
  }
}
