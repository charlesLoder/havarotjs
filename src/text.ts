import { Char } from "./char";
import { Cluster } from "./cluster";
import { Syllable } from "./syllable";
import { holemWaw } from "./utils/holemWaw";
import { convertsQametsQatan } from "./utils/qametsQatan";
import { splitGroup, taamim, taamimCaptureGroup } from "./utils/regularExpressions";
import { sequence } from "./utils/sequence";
import { Word } from "./word";

export interface KetivQere {
  /**
   * The word or regex to match on
   */
  input: string | RegExp;
  /**
   * The output of the ketiv qere
   *
   * @remarks
   * When using a callback, the paramerter `text` is the whole text of the word, and `input` is the input of the ketiv qere
   */
  output:
    | string
    /**
     * @param text the whole text of the word
     * @param input the input of the ketiv qere
     */
    | ((text: string, input: KetivQere["input"]) => string);
  /**
   * Whether to ignore taamin in the target string
   *
   * @defaultValue true
   */
  ignoreTaamim?: boolean;
  /**
   * Whether to capture taamin from the input and add it to the output
   *
   * @defaultValue false
   */
  captureTaamim?: boolean;
}

/**
 * Options for determining syllabification that may differ according to reading traditions
 */
export interface SylOpts {
  /**
   * Allows text with no niqqud to be passed; words with no niqqud or incomplete pointing will not be syllabified
   *
   * @defaultValue `false`
   *
   * @example
   * ```ts
   * const text = new Text("בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים", { allowNoNiqqud: true })
   * text.syllables.map(syl => syl.text);
   * // [ 'בְּ', 'רֵא', 'שִׁ֖ית', 'בָּרא', 'אלהים' ]
   * // note 2nd word has incomplete pointing, and 3rd has none
   * ```
   *
   * @remarks
   * Results in example displayed in reverse order to mimic Hebrew writing; the rightmost value is the 0 item
   */
  allowNoNiqqud?: boolean;
  /**
   * Determines whether to regard the sheva under the letters ילמ when preceded by the article and with a missing dagesh chazaq as as a _sheva na'_.
   *
   * @defaultValue `true`
   *
   * @example
   * ```ts
   * const usingDefault = new Text("הַיְאֹ֗ר");
   * usingDefault.syllables.map(syl => syl.text);
   * // ["הַ", "יְ", "אֹ֗ר"]
   *
   * const optional = new Text("הַיְאֹ֗ר", { article: false });
   * optional.syllables.map(syl => syl.text);
   * // ["הַיְ", "אֹ֗ר"]
   * ```
   *
   * @remarks
   * Results in example displayed in reverse order to mimic Hebrew writing; the rightmost value is the 0 item
   */
  article?: boolean;
  /**
   * How to handle the code point \u{05BA} HOLAM HASER FOR VAV
   *
   * @options
   * * "update" - converts all holems in a vav + holem sequence where vav is a consonant to HOLAM HASER FOR VAV
   * * "preserve" - leaves the text as is — does not remove HOLAM HASER FOR VAV, but does not update
   * * "remove" - converts all HOLAM HASER FOR VAV to regular holem
   *
   * @defaultValue `"preserve"`
   *
   * @example
   * update
   * ```ts
   * const holemHaser = /\u{05BA}/u;
   * const str = "עָוֹן" // vav + holem
   * holemHaser.test(str); // false
   * const newStr = new Text(updated, { holemHaser: "update" }).text;
   * holemHaser.test(newStr); // true
   *
   * ```
   *
   * @example
   * preserve
   * ```ts
   * const holemHaser = /\u{05BA}/u;
   * const str = "עָוֹן" // vav + holem
   * holemHaser.test(str); // false
   * const newStr = new Text(updated, { holemHaser: "preserve" }).text;
   * holemHaser.test(newStr); // false
   * ```
   *
   * @example
   * remove
   * ```ts
   * const holemHaser = /\u{05BA}/u;
   * const str = "עָוֺן" // vav + holem haser
   * holemHaser.test(str); // true
   * const newStr = new Text(updated, { holemHaser: "remove" }).text;
   * holemHaser.test(newStr); // false
   * ```
   */
  holemHaser?: "update" | "preserve" | "remove";
  /**
   * An array of KetivQere objects
   *
   * @defaultValue `undefined`
   *
   * @example
   * default
   * ```ts
   * const text = new Text("הִ֑וא", {
   *  ketivQeres: [
   *     {
   *       input: "הִוא",
   *       output: "הִיא"
   *     }
   *   ]
   * });
   * console.log(text.words[0].text);
   * // הִיא
   * ```
   *
   * @example
   * `captureTaamim` set to `true`
   * ```ts
   * const text = new Text("הִ֑וא", {
   *  ketivQeres: [
   *    {
   *      input: "הִוא",
   *      output: "הִיא",
   *      captureTaamim: true
   *    }
   *  ]
   * });
   * console.log(text.words[0].text);
   * // הִ֑יא
   * ```
   *
   * @example
   * `ignoreTaamim` set to `false`
   * ```ts
   * const text = new Text("הִ֑וא", {
   *  ketivQeres: [
   *    {
   *      input: "הִ֯וא",
   *      output: "הִיא",
   *      ignoreTaamim: false
   *    }
   *  ]
   * });
   * console.log(text.words[0].text);
   * // הִ֯וא
   * // does not match because the input taam is not the same as the Text taam
   * ```
   *
   * @example
   * `input` as a regular expression, and `output` as a callback
   * ```ts
   * const text = new Text("וַיָּבִיאּוּ", {
   *  ketivQeres: [
   *    {
   *      input: /אּ/,
   *      output: (word, input) => word.replace(input, "א")
   *    }
   *  ]
   * });
   * console.log(text.words[0].text);
   * // וַיָּבִיאוּ
   * ```
   *
   * @remarks
   * KetivQere objects allow for flexible handling of words, mimicking how ketiv/qeres are used in biblical manuscripts
   */
  ketivQeres?: KetivQere[];
  /**
   * Determines whether to regard a sheva after a long vowel (excluding waw-shureq, see {@link wawShureq}) as a _sheva na'_, unless preceded by a meteg (see {@link shevaAfterMeteg}).
   *
   * @defaultValue `true`
   *
   * @example
   * ```ts
   * const usingDefault = new Text("יָדְךָ");
   * usingDefault.syllables.map(syl => syl.text);
   * // ["יָ", "דְ", "ךָ"]
   *
   * const optional = new Text("יָדְךָ", { longVowels: false });
   * optional.syllables.map(syl => syl.text);
   * // ["יָדְ", "ךָ"]
   * ```
   *
   * @remarks
   * Results in example displayed in reverse order to mimic Hebrew writing; the rightmost value is the 0 item
   */
  longVowels?: boolean;
  /**
   * Converts regular qamets characters to qamets qatan characters where appropriate. The former is a "long-vowel" whereas the latter is a "short-vowel."
   *
   * @defaultValue `true`
   *
   * @example
   * ```ts
   * const qQRegx = /\u{05C7}/u;
   * const usingDefault = new Text("חָפְנִי֙");
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
   * Determines whether to regard the sheva after a meteg as a _sheva na'_.
   *
   * @defaultValue `true`
   *
   * @example
   * ```ts
   * const usingDefault = new Text("יְדַֽעְיָה");
   * usingDefault.syllables.map((s) => ({ text: s.text, isClosed: s.isClosed }));
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
   * Determines whether to regard a sheva with a meteg as a _sheva na'_. This is also called a sheva ga'ya.
   *
   * @defaultValue `true`
   *
   * @example
   * ```ts
   * const usingDefault = new Text("אַ֥שְֽׁרֵי");
   * usingusingDefault.syllables.map((s) => ({ text: s.text, isClosed: s.isClosed }));
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
   * Determines whether to regard the sheva under the letters שׁשׂסצנמלוי when preceded by a waw-consecutive with a missing dagesh chazaq as a _sheva na'_, unless preceded by a meteg (see {@link shevaAfterMeteg}).
   *
   * @defaultValue `true`
   *
   * @example
   * ```ts
   * const usingDefault = new Text("וַיְצַחֵק֙");
   * usingDefault.syllables.map(syl => syl.text);
   * // ["וַ", "יְ", "צַ", "חֵק֙"]
   *
   * const optional = new Text("וַיְצַחֵק֙", { sqnmlvy: false });
   * optional.syllables.map(syl => syl.text);
   * // ["וַיְ", "צַ", "חֵק֙"]
   * ```
   */
  sqnmlvy?: boolean;
  /**
   * Determines whether to syllabify incorrectly pointed text
   *
   * @defaultValue `true`
   *
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
   * When `false` results in syllabification can vary.
   */
  strict?: boolean;
  /**
   * Determines whether to regard a sheva after a vav-shureq as vocal, unless preceded by a meteg (see {@link shevaAfterMeteg}).
   *
   * @defaultValue `true`
   *
   * @example
   * ```ts
   * const usingDefault = new Text("וּלְמַזֵּר");
   * usingDefault.syllables.map(syl => syl.text);
   * // "וּ", "לְ", "מַ", "זֵּר"]
   *
   * const optional = new Text("וּלְמַזֵּר", { wawShureq: false });
   * optional.syllables.map(syl => syl.text);
   * // ["וּלְ", "מַ", "זֵּר"]
   * ```
   *
   * @remarks
   * Results in example displayed in reverse order to mimic Hebrew writing; the rightmost value is the 0 item
   */
  wawShureq?: boolean;
}

/**
 * Processes and analyzes Hebrew text with niqqud, offering syllabification
 * and breakdown into linguistic components (words, syllables, clusters, chars).
 */
export class Text {
  #original: string;
  private options: SylOpts;
  /**
   * Cache for {@link SylOpts.ketivQeres}
   *
   * @privateRemarks
   * This cache can be improved. Currently, it can only check for exact matches.
   * So for example, if you have ketivQere options like this:
   * ```js
   * new Text("לֹא־נִפְלֵ֥את הִוא֙ מִמְּךָ֔ וְלֹ֥א רְחֹקָ֖ה הִֽוא׃", {
   *  ketivQeres: [
   *    { input: "הִוא", output: "הִוא" },
   *  ]
   * })
   * ```
   *
   * The cache will miss because `הִוא֙` and `הִֽוא׃` are not exact matches, even though `ignoreTaamim` is `true`.
   */
  private ketivQereCache: { [k: string]: string } = {};

  /**
   * `Text` requires an input string,
   * and has optional arguments for syllabification,
   * which can be read about in the [Syllabification](/guides/syllabification) page
   *
   * @param text input string
   * @param options syllabification options
   */
  constructor(text: string, options: SylOpts = {}) {
    this.options = this.setOptions(options);
    this.#original = this.options.allowNoNiqqud ? text : this.validateInput(text);
  }

  private applyKetivQere = (text: string, kq: KetivQere) => {
    if (kq.input instanceof RegExp) {
      const match = text.match(kq.input);
      if (match) {
        return typeof kq.output === "string" ? kq.output : kq.output(text, kq.input);
      }
    }

    if (kq.input === text) {
      return typeof kq.output === "string" ? kq.output : kq.output(text, kq.input);
    }

    return null;
  };

  private captureTaamim = (text: string) => {
    return text.matchAll(Text.taamimCaptureGroup);
  };

  private processKetivQeres = (text: string) => {
    if (this.ketivQereCache[text]) {
      return this.ketivQereCache[text];
    }

    const ketivQeres = this.options.ketivQeres;

    if (!ketivQeres?.length) {
      return text;
    }

    for (const ketivQere of ketivQeres) {
      const textWithoutTaamim = ketivQere.ignoreTaamim ? this.removeTaamim(text) : text;

      const appliedKetivQere = this.applyKetivQere(textWithoutTaamim, ketivQere);

      if (!appliedKetivQere) {
        return text;
      }

      const taamimChars = ketivQere.captureTaamim ? this.captureTaamim(text) : null;

      const newText = taamimChars ? this.setTaamim(appliedKetivQere, taamimChars) : appliedKetivQere;

      this.ketivQereCache[text] = newText;

      return newText;
    }

    return text;
  };

  private validateInput(text: string): string {
    const niqqud = /[\u{05B0}-\u{05BC}\u{05C7}]/u;
    if (!niqqud.test(text)) {
      throw new Error("Text must contain niqqud");
    }
    return text;
  }

  private validateKetivQeres(ketivQeres: SylOpts["ketivQeres"]) {
    // if it's undefined, it's fine
    if (!ketivQeres) {
      return true;
    }

    // if there's no ketivQeres, it's fine
    if (!ketivQeres.length) {
      return true;
    }

    // validate the shape of the ketivQeres
    for (const [index, ketivQere] of ketivQeres.entries()) {
      const { input, output, ignoreTaamim, captureTaamim } = ketivQere;

      if (input === undefined) {
        throw new Error(`The ketivQere at index ${index} must have an input`);
      }

      if (!(input instanceof RegExp) && typeof input !== "string") {
        throw new Error(`The input property of the ketivQere at index ${index} must be a string or RegExp`);
      }

      if (output === undefined) {
        throw new Error(`The ketivQere at index ${index} must have an output`);
      }

      if (typeof output !== "string" && typeof output !== "function") {
        throw new Error(`The output property of the ketivQere at index ${index} must be a string or function`);
      }

      if (ignoreTaamim && typeof ignoreTaamim !== "boolean") {
        throw new Error(`The ignoreTaamim property of the ketivQere at index ${index} must be a boolean`);
      }

      if (captureTaamim && typeof captureTaamim !== "boolean") {
        throw new Error(`The captureTaamim property of the ketivQere at index ${index} must be a boolean`);
      }
    }

    return true;
  }

  private validateOptions(options: SylOpts): SylOpts {
    const validOpts = [
      "allowNoNiqqud",
      "article",
      "holemHaser",
      "ketivQeres",
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
      if (k === "ketivQeres") {
        this.validateKetivQeres(v);
        continue;
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

  private removeTaamim = (text: string) => {
    return text.replace(taamim, "");
  };

  private setOptions(options: SylOpts): SylOpts {
    const validOpts = this.validateOptions(options);
    return {
      allowNoNiqqud: validOpts.allowNoNiqqud ?? false,
      article: validOpts.article ?? true,
      holemHaser: validOpts.holemHaser ?? "preserve",
      ketivQeres:
        validOpts.ketivQeres?.map((kq) => ({
          ...kq,
          ignoreTaamim: kq.ignoreTaamim ?? true,
          captureTaamim: kq.captureTaamim ?? false
        })) ?? [],
      longVowels: validOpts.longVowels ?? true,
      qametsQatan: validOpts.qametsQatan ?? true,
      shevaAfterMeteg: validOpts.shevaAfterMeteg ?? true,
      shevaWithMeteg: validOpts.shevaWithMeteg ?? true,
      sqnmlvy: validOpts.sqnmlvy ?? true,
      strict: validOpts.strict ?? true,
      wawShureq: validOpts.wawShureq ?? true
    };
  }

  private setTaamim(newText: string, taamimCapture: ReturnType<Text["captureTaamim"]>) {
    return [...taamimCapture].reduce((text, taamim) => {
      return text.slice(0, taamim.index) + taamim[1] + text.slice(taamim.index);
    }, newText);
  }

  private static get taamimCaptureGroup() {
    return taamimCaptureGroup;
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
   * Gets all the {@link Char | Chars} in the Text
   *
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

  /**
   * Gets all the {@link Cluster | Clusters} in the Text
   *
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
   * The original string passed
   *
   * @returns the original string passed
   *
   * @remarks
   * The original string passed to the constructor that has not been normalized or sequenced. See {@link text}
   */
  get original(): string {
    return this.#original;
  }

  /**
   * Gets all the {@link Syllable | Syllables} in the Text
   *
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
   * Gets the text
   *
   * @returns a string that has been decomposed, sequenced, qamets qatan patterns converted to the appropriate unicode character (U+05C7), and holem-waw sequences corrected
   *
   * @example
   * ```ts
   * import { Text } from "havarotjs";
   * const text = new Text("וַתָּשָׁב");
   * text.text;
   * // וַתָּשׇׁב
   * ```
   */
  get text(): string {
    return this.words.reduce((a, c) => `${a}${c.text}${c.whiteSpaceAfter ?? ""}`, "");
  }

  /**
   * Gets all the {@link Word | Words} in the Text
   *
   * @returns a one dimensional array of Words
   *
   * @example
   * ```ts
   * const text = new Text("הֲבָרֹות");
   * text.words;
   * // [ Word { original: "הֲבָרֹות" } ]
   * ```
   */
  get words(): Word[] {
    const split = this.sanitized.split(splitGroup);
    const groups = split.filter((group) => group);
    const words = groups.map((original) => {
      const word = this.processKetivQeres(original);
      return new Word(word, this.options, word !== original ? original : undefined);
    });
    const [first, ...rest] = words;
    first.siblings = rest;

    return words;
  }
}
