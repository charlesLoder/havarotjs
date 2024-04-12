import { Cluster } from "./cluster";
import { consonants, dagesh, ligatures, vowels, rafe, sheva, taamim } from "./utils/regularExpressions";
import { CharToNameMap, charToNameMap, NameToCharMap, nameToCharMap } from "./utils/charMap";

/**
 * A Hebrew character and its positioning number for being sequenced correctly.
 * See [[`Cluster`]] for correct normalization.
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
    // i.e. any non-hebrew char
    return 10;
  }

  private isCharKeyOfCharToNameMap(char: string): char is keyof CharToNameMap {
    return char in charToNameMap;
  }

  private static get consonants() {
    return consonants;
  }

  private static get dagesh() {
    return dagesh;
  }

  private static get ligatures() {
    return ligatures;
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
   * The parent `Cluster` of the `Char`, if any.
   *
   * ```typescript
   * const text: Text = new Text("דָּבָר");
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

  isCharacterName(name: keyof NameToCharMap): boolean {
    if (!nameToCharMap[name]) {
      throw new Error(`${name} is not a valid value`);
    }

    const match = this.#text.match(nameToCharMap[name]);

    return !!match;
  }

  get isConsonant(): boolean {
    return Char.consonants.test(this.#text);
  }

  get isLigature(): boolean {
    return Char.ligatures.test(this.#text);
  }

  get isDagesh(): boolean {
    return Char.dagesh.test(this.#text);
  }

  get isRafe(): boolean {
    return Char.rafe.test(this.#text);
  }

  get isSheva(): boolean {
    return Char.sheva.test(this.#text);
  }

  get isVowel(): boolean {
    return Char.vowels.test(this.#text);
  }

  get isTaamim(): boolean {
    return Char.taamim.test(this.#text);
  }

  get isNotHebrew(): boolean {
    return this.sequencePosition === 10;
  }

  /**
   * Returns the name of the character
   *
   * ```typescript
   * const text: Text = new Text("אֱלֹהִ֑ים");
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
   * @returns a number used for sequencing
   *
   * - consonants = 0
   * - ligatures = 1
   * - dagesh or rafe = 2
   * - niqqud (i.e vowels) = 3
   * - taamim (i.e. accents) = 4
   *
   * ```typescript
   * const text: Text = new Text("אֱלֹהִ֑ים");
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
   * @returns the text of the Char
   *
   * ```typescript
   * const text: Text = new Text("אֱלֹהִ֑ים");
   * text.chars[0].text;
   * // "א"
   * ```
   */
  get text(): string {
    return this.#text;
  }
}
