import { taamim } from "./utils/regularExpressions";
import { Node } from "./node";
const consonants = /[\u{05D0}-\u{05F2}]/u;
const ligature = /[\u{05C1}-\u{05C2}]/u;
const dagesh = /[\u{05BC},\u{05BF}]/u; // includes rafe
const niqqud = /[\u{05B0}-\u{05BB},\u{05C7}]/u;

export class Char extends Node {
  text: string;
  sequencePosition: number;

  constructor(char: string) {
    super();
    this.text = char;
    this.sequencePosition = this.findPos();
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
}
