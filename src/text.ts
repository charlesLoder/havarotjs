import { Word } from "./word";
import { convertsQametsQatan } from "./utils/qametsQatan";
import { sequence } from "./utils/sequence";
import { holemWaw } from "./utils/holemWaw";
import { Syllable } from "./syllable";
import { Cluster } from "./cluster";
import { Char } from "./char";
import { splitGroup } from "./utils/regularExpressions";
import { Node } from "./node";

export class Text extends Node {
  original: string;

  constructor(text: string) {
    super();
    this.original = this.validateInput(text);
  }

  private validateInput(text: string): string {
    const niqqud = /[\u{05B0}-\u{05BC},\u{05C7}]/u;
    if (!niqqud.test(text)) {
      throw new Error("Text must contain niqqud");
    }
    return text;
  }

  private get normalized(): string {
    return this.original.normalize("NFKD");
  }

  /**
   * @returns a string that has been decomposed, sequenced, qamets qatan patterns converted to the appropriate unicode character (U+05C7), and holem-waw sequences corrected
   */
  get text(): string {
    const text = this.normalized.trim();
    const sequencedChar = sequence(text).reduce((a, c) => a.concat(c), []);
    const sequencedText = sequencedChar.reduce((a, c) => a + c.text, "");
    // split text at spaces and maqqef, spaces are added to the array as separate entries
    const textArr = sequencedText.split(splitGroup);
    const mapQQatan = textArr.map((word) => convertsQametsQatan(word));
    const mapHolemWaw = mapQQatan.map((word) => holemWaw(word));
    return mapHolemWaw.reduce((a, c) => a + c, "");
  }

  /**
   * @returns a one dimensional array of Words
   */
  get words(): Word[] {
    const split = this.text.split(splitGroup);
    const groups = split.filter((group) => group);
    const words = groups.map((word) => new Word(word));
    this.children = words;
    return words;
  }

  /**
   * @returns a one dimensional array of Syllables
   */
  get syllables(): Syllable[] {
    return this.words.map((word) => word.syllables).reduce((a, c) => a.concat(c), []);
  }

  /**
   * @returns a one dimensional array of Clusters
   */
  get clusters(): Cluster[] {
    return this.syllables.map((syllable) => syllable.clusters).reduce((a, c) => a.concat(c), []);
  }

  /**
   * @returns a one dimensional array of Chars
   */
  get chars(): Char[] {
    return this.clusters.map((cluster) => cluster.chars).reduce((a, c) => a.concat(c), []);
  }
}
