import { Word } from "./word";
import { convertsQametsQatan } from "./utils/qametsQatan";
import { sequence } from "./utils/sequence";
import { holemWaw } from "./utils/holemWaw";
import { Syllable } from "./syllable";
import { Cluster } from "./cluster";
import { Char } from "./char";
import { splitGroup } from "./utils/regularExpressions";

export interface SylOpts {
  /**
   * @property determines whether to regard the shewa under the letters שׁשׂסצנמלוי when preceded by a waw-consecutive with a missing dagesh chazaq as vocal
   */
  sqnmlvy?: boolean;
  /**
   * @property determines whether to regard a shewa after a long vowel (excluding vav-shureq) as vocal
   */
  longVowels?: boolean;
  /**
   * @property determines whether to regard a shewa after a vav-shureq as vocal, unless metheg is present
   */
  wawShureq?: boolean;
  /**
   * @property converts regular qamets characters to qamets qatan characters where appropriate
   */
  qametsQatan?: boolean;
  schema?: Schema;
}

type Schema = "tiberian" | "traditional";

/**
 * `Text` is the main exported class.
 *
 */
export class Text {
  #original: string;
  private options: SylOpts;

  /**
   * `Text` requires an input string,
   * and has optional arguments for syllabification,
   * which can be read about in the {@page Syllabification} page
   */

  constructor(text: string, options: SylOpts = {}) {
    this.#original = this.validateInput(text);
    this.options = this.setOptions(options);
  }

  private validateInput(text: string): string {
    const niqqud = /[\u{05B0}-\u{05BC},\u{05C7}]/u;
    if (!niqqud.test(text)) {
      throw new Error("Text must contain niqqud");
    }
    return text;
  }

  private validateOptions(options: SylOpts): SylOpts {
    const validOpts = ["sqnmlvy", "longVowels", "wawShureq", "qametsQatan"];
    for (const [k, v] of Object.entries(options)) {
      if (!validOpts.includes(k)) {
        throw new Error(`${k} is not a valid option`);
      }
      if (typeof v !== "boolean") {
        throw new Error(`The value ${String(v)} is not a valid option for ${k}`);
      }
    }
    return options;
  }

  private setOptions(options: SylOpts): SylOpts {
    const schema = options.schema;
    return schema ? this.setSchemaOptions(schema) : this.setDefaultOptions(options);
  }

  private setSchemaOptions(schema: Schema): SylOpts {
    const schemaText = schema.toLowerCase();
    if (schemaText !== "traditional" && schemaText !== "tiberian") {
      throw new Error(`${schemaText} is not a valid schema`);
    }
    const traditionalOpts = { qametsQatan: true, sqnmlvy: true, longVowels: true, vavShureq: true };
    const tiberianOpts = { qametsQatan: false, sqnmlvy: true, longVowels: false, vavShureq: false };
    return schemaText === "traditional" ? traditionalOpts : tiberianOpts;
  }

  private setDefaultOptions(options: SylOpts): SylOpts {
    options = this.validateOptions(options);
    const defaultOpts: SylOpts = { qametsQatan: true, sqnmlvy: true, longVowels: true, wawShureq: true };
    // for..in throwing error
    defaultOpts.longVowels = options.longVowels !== undefined ? options.longVowels : defaultOpts.longVowels;
    defaultOpts.qametsQatan = options.qametsQatan !== undefined ? options.qametsQatan : defaultOpts.qametsQatan;
    defaultOpts.sqnmlvy = options.sqnmlvy !== undefined ? options.sqnmlvy : defaultOpts.sqnmlvy;
    defaultOpts.wawShureq = options.wawShureq !== undefined ? options.wawShureq : defaultOpts.wawShureq;
    return defaultOpts;
  }

  private get normalized(): string {
    return this.original.normalize("NFKD");
  }

  private get sanitized(): string {
    const text = this.normalized.trim();
    const sequencedChar = sequence(text).flat();
    const sequencedText = sequencedChar.reduce((a, c) => a + c.text, "");
    // split text at spaces and maqqef, spaces are added to the array as separate entries
    const textArr = sequencedText.split(splitGroup).filter((group) => group);
    const mapQQatan = this.options.qametsQatan ? textArr.map((word) => convertsQametsQatan(word)) : textArr;
    const mapHolemWaw = mapQQatan.map((word) => holemWaw(word));
    return mapHolemWaw.reduce((a, c) => a + c, "");
  }

  /**
   * @returns the original string passed
   *
   * ```typescript
   * const text: Text = new Text("הֲבָרֹות");
   * text.original;
   * // "הֲבָרֹות"
   * ```
   */
  get original(): string {
    return this.#original;
  }

  /**
   * @returns a string that has been decomposed, sequenced, qamets qatan patterns converted to the appropriate unicode character (U+05C7), and holem-waw sequences corrected
   *
   * ```typescript
   * import { Text } from "havarotjs";
   * const text: Text = new Text("וַתָּשָׁב");
   * text.text;
   * // וַתָּשׇׁב
   * ```
   */
  get text(): string {
    return this.words.reduce((a, c) => `${a}${c.text}${c.whiteSpaceAfter ?? ""}`, "");
  }

  /**
   * @returns a one dimensional array of Words
   *
   * ```typescript
   * const text: Text = new Text("הֲבָרֹות");
   * text.words;
   * // [Word { original: "הֲבָרֹות" }]
   * ```
   */
  get words(): Word[] {
    const split = this.sanitized.split(splitGroup);
    const groups = split.filter((group) => group);
    const words = groups.map((word) => new Word(word, this.options));
    return words;
  }

  /**
   * @returns a one dimensional array of Syllables
   *
   * ```typescript
   * const text: Text = new Text("הֲבָרֹות");
   * text.syllables;
   * // [
   * //    Syllable { original: "הֲ" },
   * //    Syllable { original: "בָ" },
   * //    Syllable { original: "רֹות" }
   * //  ]
   * ```
   */
  get syllables(): Syllable[] {
    return this.words.map((word) => word.syllables).flat();
  }

  /**
   * @returns a one dimensional array of Clusters
   *
   * ```typescript
   * const text: Text = new Text("יָד");
   * text.clusters;
   * // [
   * //    Cluster { original: "יָ" },
   * //    Cluster { original: "ד" }
   * //  ]
   * ```
   */
  get clusters(): Cluster[] {
    return this.syllables.map((syllable) => syllable.clusters).flat();
  }

  /**
   * @returns a one dimensional array of Chars
   *
   * ```typescript
   * const text: Text = new Text("יָד");
   * text.chars;
   * //  [
   * //    Char { original: "י" },
   * //    Char { original: "ָ" },
   * //    Char { original: "ד" }
   * //  ]
   * ```
   */
  get chars(): Char[] {
    return this.clusters.map((cluster) => cluster.chars).flat();
  }
}
