import { Char } from "./char";
import { Node } from "./node";
import { taamei } from "./utils/regularExpressions";

export class Cluster extends Node {
  original: string;

  constructor(cluster: string) {
    super();
    this.original = cluster;
  }

  get text(): string {
    return this.chars.reduce((init, char) => init + char.text, "");
  }

  /**
   * @returns an array of sequenced Char objects
   */
  get chars(): Char[] {
    const sequenced = this.sequence();
    this.children = sequenced;
    return sequenced;
  }

  private sequence(): Char[] {
    const text = this.original;
    return [...text].map((char) => new Char(char)).sort((a, b) => a.sequencePosition - b.sequencePosition);
  }

  get hasLongVowel(): boolean {
    return /[\u{05B5}\u{05B8}\u{05B9}\u{05BA}]/u.test(this.text);
  }

  get hasShortVowel(): boolean {
    return /[\u{05B4}\u{05B6}\u{05B7}\u{05BB}\u{05C7}]/u.test(this.text);
  }

  get hasHalfVowel(): boolean {
    return /[\u{05B1}-\u{05B3}]/u.test(this.text);
  }

  get hasVowel(): boolean {
    return this.hasLongVowel || this.hasShortVowel || this.hasHalfVowel;
  }

  get isShureq(): boolean {
    const shureq = /\u{05D5}\u{05BC}/u;
    return !this.hasVowel ? shureq.test(this.text) : false;
  }

  get isMater(): boolean {
    if (!this.hasVowel && !this.isShureq && !this.hasShewa) {
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

  get hasMetheg(): boolean {
    return /\u{05BD}/u.test(this.text);
  }

  get hasShewa(): boolean {
    return /\u{05B0}/u.test(this.text);
  }

  get hasTaamei(): boolean {
    return taamei.test(this.text);
  }
}
