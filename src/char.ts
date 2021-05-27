import { taamim } from "./utils/regularExpressions";
const consonants = /[\u{05D0}-\u{05F2}]/u;
const ligature = /[\u{05C1}-\u{05C2}]/u;
const dagesh = /[\u{05BC},\u{05BF}]/u; // includes rafe
const niqqud = /[\u{05B0}-\u{05BB},\u{05C7}]/u;

export class Char {
  #text: string;

  constructor(char: string) {
    this.#text = char;
  }

  /**
   * @returns the text of the Char
   */
  get text(): string {
    return this.#text;
  }

  private findPos(): number {
    const char = this.text;
    if (consonants.test(char)) {
      return 0;
    }
    if (ligature.test(char)) {
      return 1;
    }
    if (dagesh.test(char)) {
      return 2;
    }
    if (niqqud.test(char)) {
      return 3;
    }
    if (taamim.test(char)) {
      return 4;
    }
    // i.e. any non-hebrew char
    return 10;
  }

  /**
   * @returns the position within a Cluster a type Char should be
   */
  get sequencePosition(): number {
    return this.findPos();
  }
}
