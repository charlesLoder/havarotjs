import { Char } from "./char";
import { Node } from "./node";
import { taamei } from "./utils/regularExpressions";

// export class Cluster extends Node<string> {
//   original: string;

//   constructor(cluster: string) {
//     super();
//     this.original = cluster;
//   }

//   /**
//    * @returns an array of sequenced Char objects
//    */
//   get chars(): Char[] {
//     return this.sequence();
//   }

//   get text(): string {
//     return this.chars.reduce((init, char) => init + char.text, "");
//   }

//   private sequence(): Char[] {
//     const text = this.original;
//     return [...text].map((char) => new Char(char)).sort((a, b) => a.sequencePosition - b.sequencePosition);
//   }

//   get hasLongVowel(): boolean {
//     return /[\u{05B5}\u{05B8}\u{05B9}\u{05BA}]/u.test(this.text);
//   }

//   get hasShortVowel(): boolean {
//     return /[\u{05B4}\u{05B6}\u{05B7}\u{05BB}\u{05C7}]/u.test(this.text);
//   }

//   get hasHalfVowel(): boolean {
//     return /[\u{05B1}-\u{05B3}]/u.test(this.text);
//   }

//   get hasVowel(): boolean {
//     return this.hasLongVowel || this.hasShortVowel || this.hasHalfVowel;
//   }

//   get isShureq(): boolean {
//     const shureq = /\u{05D5}\u{05BC}/u;
//     return !this.hasVowel ? shureq.test(this.text) : false;
//   }

//   get isMater(): boolean {
//     const maters = /[היוא](?!\u{05BC})/u;
//     return !this.hasVowel && !this.isShureq && !this.hasShewa ? maters.test(this.text) : false;
//   }

//   get hasMetheg(): boolean {
//     return /\u{05BD}/u.test(this.text);
//   }

//   get hasShewa(): boolean {
//     return /\u{05B0}/u.test(this.text);
//   }

//   get hasTaamei(): boolean {
//     return taamei.test(this.text);
//   }
// }
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
    this.children = this.sequence();
    const first = this.child;
    const remainder = first?.siblings;
    return [first, ...remainder];
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
    const maters = /[היוא](?!\u{05BC})/u;
    return !this.hasVowel && !this.isShureq && !this.hasShewa ? maters.test(this.text) : false;
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
