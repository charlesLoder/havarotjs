import { Char } from "./char";

export class Cluster {
  original: string;

  constructor(cluster: string) {
    this.original = cluster;
  }

  /**
   * @returns an array of sequenced Char objects
   */
  get chars() {
    return this.sequence();
  }

  get text() {
    return this.chars.reduce((init, char) => init + char.text, "");
  }

  private sequence() {
    const text = this.original;
    return [...text].map((char) => new Char(char)).sort((a, b) => a.position - b.position);
  }

  get hasLongVowel() {
    return /[\u{05B5}\u{05B8}\u{05B9}\u{05BA}]/u.test(this.text);
  }
  get hasShortVowel() {
    return /[\u{05B4}\u{05B6}\u{05B7}\u{05BB}\u{05C7}]/u.test(this.text);
  }
  get hasVowel() {
    return this.hasLongVowel || this.hasShortVowel;
  }
  get hasHalfVowel() {
    return /[\u{05B1}-\u{05B3}]/u.test(this.text);
  }
  get hasMetheg() {
    return /\u{05BD}/u.test(this.text);
  }
  get hasShewa() {
    return /\u{05B0}/u.test(this.text);
  }

  get hasTaamei() {
    return /[\u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}]/u.test(this.text);
  }
}
