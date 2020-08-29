import { Word } from "./word";
import { convertsQametsQatan } from "./utils/qametsQatan";
import { sequence } from "./utils/sequence";

export class Text {
  original: string;

  constructor(text: string) {
    this.original = text;
  }

  private get normalized(): string {
    return this.original.normalize("NFKD");
  }

  /**
   * @returns a string that has been decomposed, sequenced, and qamets qatan patterns converted to the appropriate unicode character (U+05C7)
   */
  get text(): string {
    const text = this.normalized;
    const sequencedChar = sequence(text).reduce((a, c) => a.concat(c), []);
    const sequencedText = sequencedChar.reduce((a, c) => a + c.text, "");
    // split text at spaces and maqqef, spaces are added to the array as separate entries
    const textArr = sequencedText.split(/(\s|\S*\u{05BE})/u);
    const mapQQatan = textArr.map((word) => convertsQametsQatan(word));
    return mapQQatan.reduce((a, c) => a + c, "");
  }

  /**
   * @returns a one dimensional array of Words
   */
  get words() {
    let sanitized = this.text;
    // split text at spaces and maqqef, spaces are NOT added to the array but to the word
    // this may not be right
    const split = sanitized.split(/(\S*\s|\S*\u{05BE})/u);
    const textArr = split.filter((group) => group);
    return textArr.map((word) => new Word(word));
  }

  /**
   * @returns a one dimensional array of Syllables
   */
  get syllables() {
    return this.words.map((word) => word.syllables).reduce((a, c) => a.concat(c), []);
  }

  /**
   * @returns a one dimensional array of Clusters
   */
  get clusters() {
    return this.syllables.map((syllable) => syllable.clusters).reduce((a, c) => a.concat(c), []);
  }

  /**
   * @returns a one dimensional array of Chars
   */
  get chars() {
    return this.clusters.map((cluster) => cluster.chars).reduce((a, c) => a.concat(c), []);
  }
}
