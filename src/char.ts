import { Cluster } from "./cluster";
import { CharToNameMap, NameToCharMap, charToNameMap, isHebrewCharacter, nameToCharMap } from "./utils/charMap";
import { consonants, dagesh, ligatures, meteg, rafe, sheva, taamim, vowels } from "./utils/regularExpressions";

/**
 * A Hebrew character and its positioning number for being sequenced correctly.
 * See {@link Cluster } for correct normalization.
 */
export class Char {
  #text: string;
  #cluster: Cluster | null = null;
  #sequencePosition: number;

  constructor(char: string) {
    this.#text = char;
    this.#sequencePosition = this.findPos();
  }

  private findPos(): number {
    const char = this.text;
    if (Char.consonants.test(char)) {
      return 0;
    }
    if (Char.ligatures.test(char)) {
      return 1;
    }
    if (Char.dagesh.test(char)) {
      return 2;
    }
    if (Char.rafe.test(char)) {
      return 2;
    }
    if (Char.vowels.test(char)) {
      return 3;
    }
    if (Char.sheva.test(char)) {
      return 3;
    }
    if (Char.taamim.test(char)) {
      return 4;
    }
    if (Char.meteg.test(char)) {
      return 4;
    }
    // i.e. any non-hebrew char
    return 10;
  }

  private isCharKeyOfCharToNameMap = isHebrewCharacter;

  private static get consonants() {
    return consonants;
  }

  private static get dagesh() {
    return dagesh;
  }

  private static get ligatures() {
    return ligatures;
  }

  private static get meteg() {
    return meteg;
  }

  private static get rafe() {
    return rafe;
  }

  private static get sheva() {
    return sheva;
  }

  private static get taamim() {
    return taamim;
  }

  private static get vowels() {
    return vowels;
  }

  /**
   * The parent `Cluster` of the character, if any.
   *
   * @example
   * ```ts
   * const text = new Text("דָּבָר");
   * const firstChar = text.chars[0];
   * firstChar.text;
   * // "ד"
   * firstChar.cluster?.text;
   * // "דָּ"
   * ```
   */
  get cluster(): Cluster | null {
    return this.#cluster;
  }

  set cluster(cluster: Cluster | null) {
    this.#cluster = cluster;
  }

  /**
   * Returns `true` if the character is a character name
   *
   * @param name a character name
   */
  isCharacterName(name: keyof NameToCharMap): boolean {
    if (!nameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    const match = this.#text.match(nameToCharMap[name]);

    return !!match;
  }

  /**
   * Returns `true` if the character is a consonant
   *
   * @example
   * ```ts
   * const text = new Text("אֱלֹהִ֑ים");
   * text.chars[0].isConsonant;
   * // true
   * ```
   */
  get isConsonant(): boolean {
    return Char.consonants.test(this.#text);
  }

  /**
   * Returns `true` if the character is a ligature
   *
   * @example
   * ```ts
   * const text = new Text("שָׁלֽוֹם");
   * text.chars[1].isLigature;
   * // true
   * ```
   */
  get isLigature(): boolean {
    return Char.ligatures.test(this.#text);
  }

  /**
   * Returns `true` if the character is a dagesh
   *
   * @example
   * ```ts
   * const text = new Text("בּ");
   * text.chars[1].isDagesh;
   * // true
   * ```
   */
  get isDagesh(): boolean {
    return Char.dagesh.test(this.#text);
  }

  /**
   * Returns `true` if the character is a rafe
   *
   * @example
   * ```ts
   * const text = new Text("בֿ");
   * text.chars[1].isRafe;
   * // true
   * ```
   */
  get isRafe(): boolean {
    return Char.rafe.test(this.#text);
  }

  /**
   * Returns `true` if the character is a sheva
   *
   * @example
   * ```ts
   * const text = new Text("בְ");
   * text.chars[1].isSheva;
   * // true
   * ```
   */
  get isSheva(): boolean {
    return Char.sheva.test(this.#text);
  }

  /**
   * Returns `true` if the character is a sheva
   *
   * @example
   * ```ts
   * const text = new Text("בֺ");
   * text.chars[1].isVowel;
   * // true
   * ```
   */
  get isVowel(): boolean {
    return Char.vowels.test(this.#text);
  }

  /**
   * Returns `true` if the character is a taamim
   *
   * @example
   * ```ts
   * const text = new Text("בֺ֨");
   * text.chars[2].isTaamim;
   * // true
   * ```
   */
  get isTaamim(): boolean {
    return Char.taamim.test(this.#text);
  }

  /**
   * Returns `true` if the character is not a Hebrew character
   *
   * @example
   * ```ts
   * const text = new Text("a");
   * text.chars[0].isNotHebrew;
   * // true
   * ```
   */
  get isNotHebrew(): boolean {
    return this.sequencePosition === 10;
  }

  /**
   * Returns the name of the character
   *
   * @example
   * ```ts
   * const text = new Text("אֱלֹהִ֑ים");
   * text.chars[0].characterName;
   * // "ALEF"
   * ```
   */
  get characterName(): CharToNameMap[keyof CharToNameMap] | null {
    const text = this.#text;
    if (this.isCharKeyOfCharToNameMap(text)) {
      return charToNameMap[text];
    }
    return null;
  }

  /**
   * Gets the sequence position of the character
   *
   * @returns a number used for sequencing
   * - consonants = 0
   * - ligatures = 1
   * - dagesh or rafe = 2
   * - niqqud (i.e vowels) = 3
   * - taamim (i.e. accents) = 4
   *
   * @example
   * ```ts
   * const text = new Text("אֱלֹהִ֑ים");
   * text.chars[0].sequencePosition; // the aleph
   * // 0
   * text.chars[1].sequencePosition; // the segol
   * // 3
   * ```
   */
  get sequencePosition(): number {
    return this.#sequencePosition;
  }

  /**
   * The text of the character
   *
   * @returns the text of the Char
   *
   * @example
   * ```ts
   * const text = new Text("אֱלֹהִ֑ים");
   * text.chars[0].text;
   * // "א"
   * ```
   */
  get text(): string {
    return this.#text;
  }
}
