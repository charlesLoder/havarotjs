import { Word } from "./word";
import { convertsQametsQatan } from "./qametsQatan";
import { sequence } from "./sequence";
import { Syllable } from "./syllable";

interface TextInterface {
  original: string;
  normalized: string;
  sanitized: string;
  words: Word[];
  syllables: Syllable[];
}

export class Text implements TextInterface {
  original: string;

  constructor(text: string) {
    this.original = text;
  }

  get normalized(): string {
    return this.original.normalize("NFKD");
  }

  /**
   * @description searches for common qamets qatan patterns and convert to appropriate unicode point U+05C7
   */
  get sanitized(): string {
    const text = this.normalized;
    const sequencedChar = sequence(text).reduce((a, c) => a.concat(c), []);
    const sequencedText = sequencedChar.reduce((a, c) => a + c.text, "");
    // split text at spaces and maqqef, spaces are added to the array as separate entries
    const textArr = sequencedText.split(/(\s|\S*\u{05BE})/u);
    const mapQQatan = textArr.map((word) => convertsQametsQatan(word));
    return mapQQatan.reduce((a, c) => a + c, "");
  }

  get words() {
    let sanitized = this.sanitized;
    // split text at spaces and maqqef, spaces are NOT added to the array but to the word
    // this may not be right
    const split = sanitized.split(/(\S*\s|\S*\u{05BE})/u);
    const textArr = split.filter((group) => group);
    return textArr.map((word) => new Word(word));
  }

  get syllables() {
    return this.words.map((word) => word.syllables).reduce((a, c) => a.concat(c), []);
  }
}
