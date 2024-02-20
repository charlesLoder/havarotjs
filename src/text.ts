import { Word } from "./word";
import { convertsQametsQatan } from "./utils/qametsQatan";
import { sequence } from "./utils/sequence";
import { holemWaw } from "./utils/holemWaw";
import { Syllable } from "./syllable";
import { Cluster } from "./cluster";
import { Char } from "./char";
import { splitGroup } from "./utils/regularExpressions";

/**
 * options for determining syllabification that may differ according to reading traditions
 */
export interface SylOpts {
  /**
   * allows text with no niqqud to be passed; words with no niqqud or incomplete pointing will not be syllabified
   *
   * @defaultValue false
   * @example
   * ```ts
   * const text = new Text("בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים", { allowNoNiqqud: true })
   * text.syllables.map(syl => syl.text);
   * // [ 'בְּ', 'רֵא', 'שִׁ֖ית', 'בָּרא', 'אלהים' ]
   * // note 2nd word has incomplete pointing, and 3rd has none
   * ```
   * @remarks
   *
   * results in example displayed in reverse order to mimic Hebrew writing; the rightmost value is the 0 item
   */
  allowNoNiqqud?: boolean;
  /**
   * determines whether to regard the sheva under the letters ילמ when preceded by the article and with a missing dagesh chazaq as as a _sheva na'_.
   *
   * @defaultValue true
   * @example
   * ```ts
   * const default = new Text("הַיְאֹ֗ר");
   * default.syllables.map(syl => syl.text);
   * // ["הַ", "יְ", "אֹ֗ר"]
   *
   * const optional = new Text("הַיְאֹ֗ר", { article: false });
   * optional.syllables.map(syl => syl.text);
   * // ["הַיְ", "אֹ֗ר"]
   * ```
   *
   * @remarks
   *
   * results in example displayed in reverse order to mimic Hebrew writing; the rightmost value is the 0 item
   */
  article?: boolean;
  /**
   * how to handle the code point \u{05BA} HOLAM HASER FOR VAV
   *
   * @options
   * * "update" - converts all holems in a vav + holem sequence where vav is a consonant to HOLAM HASER FOR VAV
   * * "preserve" - leaves the text as is — does not remove HOLAM HASER FOR VAV, but does not update
   * * "remove" - converts all HOLAM HASER FOR VAV to regular holem
   *
   * @defaultValue preserve
   *
   * @example update
   * ```ts
   * const holemHaser = /\u{05BA}/u;
   * const str = "עָוֹן" // vav + holem
   * holemHaser.test(str); // false
   * const newStr = new Text(updated, { holemHaser: "update" }).text;
   * holemHaser.test(newStr); // true
   *
   * ```
   * @example preserve
   * ```ts
   * const holemHaser = /\u{05BA}/u;
   * const str = "עָוֹן" // vav + holem
   * holemHaser.test(str); // false
   * const newStr = new Text(updated, { holemHaser: "preserve" }).text;
   * holemHaser.test(newStr); // false
   *
   * ```
   *
   * @example remove
   * ```ts
   * const holemHaser = /\u{05BA}/u;
   * const str = "עָוֺן" // vav + holem haser
   * holemHaser.test(str); // true
   * const newStr = new Text(updated, { holemHaser: "remove" }).text;
   * holemHaser.test(newStr); // false
   * ```
   *
   */
  holemHaser?: "update" | "preserve" | "remove";
  /**
   * determines whether to regard a sheva after a long vowel (excluding waw-shureq, see {@link wawShureq}) as a _sheva na'_, unless preceded by a meteg (see {@link shevaAfterMeteg}).
   *
   * @defaultValue true
   * @example
   * ```ts
   * const default = new Text("יָדְךָ");
   * default.syllables.map(syl => syl.text);
   * // ["יָ", "דְ", "ךָ"]
   *
   * const optional = new Text("יָדְךָ", { longVowels: false });
   * optional.syllables.map(syl => syl.text);
   * // ["יָדְ", "ךָ"]
   * ```
   *
   * @remarks
   *
   * results in example displayed in reverse order to mimic Hebrew writing; the rightmost value is the 0 item
   */
  longVowels?: boolean;
  /**
   * converts regular qamets characters to qamets qatan characters where appropriate. The former is a "long-vowel" whereas the latter is a "short-vowel."
   *
   * @defaultValue true
   * @example
   * ```ts
   * const qQRegx = /\u{05C7}/u;
   * const default = new Text("חָפְנִי֙");
   * qQRegx.test(default.text);
   * // true
   *
   * const optional = new Text("חָפְנִי֙", { qametsQatan: false });
   * qQRegx.test(optional.text);
   * // false
   * ```
   */
  qametsQatan?: boolean;
  /**
   * determines whether to regard the sheva after a meteg as a _sheva na'_.
   *
   * @defaultValue true
   * @example
   * ```ts
   * const default = new Text("יְדַֽעְיָה");
   * default.syllables.map((s) => ({ text: s.text, isClosed: s.isClosed }));
   * // [
   * //    { text: 'יְ', isClosed: false },
   * //    { text: 'דַֽ', isClosed: false },
   * //    { text: 'עְ', isClosed: false },
   * //    { text: 'יָה', isClosed: false }
   * // ]
   *
   * const optional = new Text("יְדַֽעְיָה", { shevaAfterMeteg: false });
   * optional.syllables.map((s) => ({ text: s.text, isClosed: s.isClosed }));
   * // [
   * //    { text: 'יְ', isClosed: false },
   * //    { text: 'דַֽעְ', isClosed: true },
   * //    { text: 'יָה', isClosed: false }
   * // ]
   * ```
   */
  shevaAfterMeteg?: boolean;
  /**
   * determines whether to regard a sheva with a meteg as a _sheva na'_. This is also called a sheva ga'ya.
   *
   * @defaultValue true
   * @example
   * ```ts
   * const usingDefault = new Text("אַ֥שְֽׁרֵי");
   * usingDefault.syllables.map((s) => ({ text: s.text, isClosed: s.isClosed }));
   * // [
   * //  { text: 'אַ֥', isClosed: false },
   * //  { text: 'שְֽׁ', isClosed: false },
   * //  { text: 'רֵי', isClosed: false }
   * // ]
   *
   * const optional = new Text("אַ֥שְֽׁרֵי", { shevaWithMeteg: false });
   * optional.syllables.map((s) => ({ text: s.text, isClosed: s.isClosed }));
   * // [
   * //  { text: 'אַ֥שְֽׁ', isClosed: true },
   * //  { text: 'רֵי', isClosed: false }
   * // ]
   * ```
   */
  shevaWithMeteg?: boolean;
  /**
   * determines whether to regard the sheva under the letters שׁשׂסצנמלוי when preceded by a waw-consecutive with a missing dagesh chazaq as a _sheva na'_, unless preceded by a meteg (see {@link shevaAfterMeteg}).
   *
   * @defaultValue true
   * @example
   * ```ts
   * const default = new Text("וַיְצַחֵק֙");
   * default.syllables.map(syl => syl.text);
   * // ["וַ", "יְ", "צַ", "חֵק֙"]
   *
   * const optional = new Text("וַיְצַחֵק֙", { sqnmlvy: false });
   * optional.syllables.map(syl => syl.text);
   * // ["וַיְ", "צַ", "חֵק֙"]
   * ```
   */
  sqnmlvy?: boolean;
  /**
   * whether to syllabify incorrectly pointed text
   *
   * @defaultValue true
   * @example
   * ```ts
   * const text1 = new Text("לְוּדְרְדַּיְל", { strict: true });
   * // Error: Syllable לְ should not precede a Cluster with a Shureq in דַּיְלרְדְוּלְ
   *
   * const text2 = new Text("לְוּדְרְדַּיְל", { strict: false });
   * text2.syllables.map(syl => syl.text);
   * // [ 'וּ', 'דְ', 'רְ', 'דַּיְל' ]
   *```
   *
   * @remarks
   *
   * when false results in syllabification can vary
   *
   */
  strict?: boolean;
  /**
   * determines whether to regard a sheva after a vav-shureq as vocal, unless preceded by a meteg (see {@link shevaAfterMeteg}).
   *
   * @defaultValue true
   * @example
   * ```ts
   * const default = new Text("וּלְמַזֵּר");
   * default.syllables.map(syl => syl.text);
   * // "וּ", "לְ", "מַ", "זֵּר"]
   *
   * const optional = new Text("וּלְמַזֵּר", { wawShureq: false });
   * optional.syllables.map(syl => syl.text);
   * // ["וּלְ", "מַ", "זֵּר"]
   * ```
   *
   * @remarks
   *
   * results in example displayed in reverse order to mimic Hebrew writing; the rightmost value is the 0 item
   */
  wawShureq?: boolean;
}

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
   *
   * @param text input string
   * @param options syllabification options
   */
  constructor(text: string, options: SylOpts = {}) {
    this.options = this.setOptions(options);
    this.#original = this.options.allowNoNiqqud ? text : this.validateInput(text);
  }

  private validateInput(text: string): string {
    const niqqud = /[\u{05B0}-\u{05BC}\u{05C7}]/u;
    if (!niqqud.test(text)) {
      throw new Error("Text must contain niqqud");
    }
    return text;
  }

  private validateOptions(options: SylOpts): SylOpts {
    const validOpts = [
      "allowNoNiqqud",
      "article",
      "holemHaser",
      "longVowels",
      "qametsQatan",
      "shevaAfterMeteg",
      "shevaWithMeteg",
      "sqnmlvy",
      "strict",
      "wawShureq"
    ];
    for (const [k, v] of Object.entries(options)) {
      if (!validOpts.includes(k)) {
        throw new Error(`${k} is not a valid option`);
      }
      if (k === "holemHaser" && !["update", "preserve", "remove"].includes(String(v))) {
        throw new Error(`The value ${String(v)} is not a valid option for ${k}`);
      }
      if (typeof v !== "boolean" && k !== "holemHaser") {
        throw new Error(`The value ${String(v)} is not a valid option for ${k}`);
      }
    }
    return options;
  }

  private setOptions(options: SylOpts): SylOpts {
    const validOpts = this.validateOptions(options);
    return {
      allowNoNiqqud: validOpts.allowNoNiqqud ?? false,
      article: validOpts.article ?? true,
      holemHaser: validOpts.holemHaser ?? "preserve",
      longVowels: validOpts.longVowels ?? true,
      qametsQatan: validOpts.qametsQatan ?? true,
      shevaAfterMeteg: validOpts.shevaAfterMeteg ?? true,
      shevaWithMeteg: validOpts.shevaWithMeteg ?? true,
      sqnmlvy: validOpts.sqnmlvy ?? true,
      strict: validOpts.strict ?? true,
      wawShureq: validOpts.wawShureq ?? true
    };
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
    const mapQQatan = this.options.qametsQatan ? textArr.map(convertsQametsQatan) : textArr;
    const mapHolemWaw = mapQQatan.map((w) => holemWaw(w, this.options));
    return mapHolemWaw.join("");
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
    const [first, ...rest] = words;
    first.siblings = rest;

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
