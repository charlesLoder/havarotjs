import { Char } from "./char";
import { Node } from "./node";
import { taamim } from "./utils/regularExpressions";

export class Cluster extends Node {
  #original: string;
  #sequenced: Char[];

  constructor(cluster: string) {
    super();
    this.#original = cluster;
    this.#sequenced = this.sequence();
    this.children = this.#sequenced;
  }

  /**
   * @returns the original string passed
   */
  get original(): string {
    return this.#original;
  }

  /**
   * @returns a string that has been built up from the text of its consituent Chars
   */
  get text(): string {
    return this.chars.reduce((init, char) => init + char.text, "");
  }

  /**
   * @returns an array of sequenced Char objects
   */
  get chars(): Char[] {
    return this.#sequenced;
  }

  private sequence(): Char[] {
    return [...this.original].map((char) => new Char(char)).sort((a, b) => a.sequencePosition - b.sequencePosition);
  }

  /**
   * @returns true if tsere, qamets, holam, or holam haser are present
   */
  get hasLongVowel(): boolean {
    return /[\u{05B5}\u{05B8}\u{05B9}\u{05BA}]/u.test(this.text);
  }

  /**
   * @returns true if hiriq, seghol, patach, qubuts, or qamets qatan are present
   */
  get hasShortVowel(): boolean {
    return /[\u{05B4}\u{05B6}\u{05B7}\u{05BB}\u{05C7}]/u.test(this.text);
  }

  /**
   * @returns true if hataf seghol, hataf patch, or hataf qamets are present
   */
  get hasHalfVowel(): boolean {
    return /[\u{05B1}-\u{05B3}]/u.test(this.text);
  }

  /**
   * @returns true if any vowel character is present, but not shewa
   */
  get hasVowel(): boolean {
    return this.hasLongVowel || this.hasShortVowel || this.hasHalfVowel;
  }

  /**
   * @returns a boolean if Cluster is a shureq
   * @description determines if a shureq if Cluster is a vav followed by dagesh with no vowel
   */
  get isShureq(): boolean {
    const shureq = /\u{05D5}\u{05BC}/u;
    return !this.hasVowel ? shureq.test(this.text) : false;
  }

  /**
   * @returns a boolean if the Cluster is a mater
   * @description checks if Cluster is (1) a holam vav, (2) part of a hiriq, tsere, or seghol yod, (3) part of a qamets, seghol, or tsere he
   */
  get isMater(): boolean {
    if (!this.hasVowel && !this.isShureq && !this.hasShewa) {
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
   * @returns a boolean if a Cluster has a metheg
   * @description if the next Cluster has a sof pasuq, then metheg is a silluq; returns false
   */
  get hasMetheg(): boolean {
    const metheg = /\u{05BD}/u;
    const text = this.text;
    if (!metheg.test(text)) {
      return false;
    }
    let next = this.next;
    while (next) {
      if (next instanceof Cluster) {
        const nextText = next.text;
        const sofPassuq = /\u{05C3}/u;
        if (metheg.test(nextText)) {
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
   * @returns boolean if shewa character is present
   */
  get hasShewa(): boolean {
    return /\u{05B0}/u.test(this.text);
  }

  /**
   * @returns boolean if any taamim are present
   */
  get hasTaamim(): boolean {
    return taamim.test(this.text);
  }
}
