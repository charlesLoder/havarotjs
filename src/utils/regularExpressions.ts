export const taamim = /[\u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C4}-\u{05C6}\u{05F3}\u{05F4}]/u;

/**
 * a regular expression containing all the Hebrew characters of the category PUNCTUATION:
 *
 * - \u{05BE} HEBREW PUNCTUATION MAQAF ־
 * - \u{05C0} HEBREW PUNCTUATION PASEQ ׀
 * - \u{05C3} HEBREW PUNCTUATION SOF PASUQ ׃
 * - \u{05C6} HEBREW PUNCTUATION NUN HAFUKHA ׆
 *
 */
export const punctuation = /[\u{05BE}\u{05C0}\u{05C3}\u{05C6}]/u;

/**
 * a regular expression containing all the Hebrew characters of the category PUNCTUATION in a capture group:
 *
 * - \u{05BE} HEBREW PUNCTUATION MAQAF ־
 * - \u{05C0} HEBREW PUNCTUATION PASEQ ׀
 * - \u{05C3} HEBREW PUNCTUATION SOF PASUQ ׃
 * - \u{05C6} HEBREW PUNCTUATION NUN HAFUKHA ׆
 *
 */
export const punctuationCaptureGroup = /([\u{05BE}\u{05C0}\u{05C3}\u{05C6}])/u;

/**
 * a regular expression containing all the Hebrew point characters (excluding sheva and rafe)
 *
 * ```js
 * /[\u{05B1}-\u{05BB}\u{05C7}]/u;
 * ```
 */
export const vowels = /[\u{05B1}-\u{05BB}\u{05C7}]/u;

/**
 * a regular expression containing all the Hebrew point characters (excluding sheva and rafe) in a capture group
 *
 * ```js
 * /([\u{05B1}-\u{05BB}\u{05C7}])/u;
 * ```
 */
export const vowelsCaptureGroup = /([\u{05B1}-\u{05BB}\u{05C7}])/u;

/**
 * a regular expression containing all the Hebrew point characters (excluding rafe) in a capture group
 *
 * ```js
 * /([\u{05B0}-\u{05BB}\u{05C7}])/u;
 * ```
 */
export const vowelsCaptureGroupWithSheva = /([\u{05B0}-\u{05BB}\u{05C7}])/u;

/**
 * a Regex group of the entire Hebrew unicode block including alphabetic presentation forms
 */
export const hebChars = /[\u{0590}-\u{05FF}\u{FB1D}-\u{FB4F}]/u;

/**
 * @description
 * These groups must be in this order to work
 * - group 1: word w/ maqqef followed by word w/ maqqef;
 * - group 2: word w/ maqqef not followed by word w/ maqqef
 * - group 3: word w/ hyphen not followed by word w/ hyphen
 * - group 4: word w/ hyphen followed by word w/ hyphen
 * - group 5: word followed by white space
 */
export const splitGroup = /(\S*\u{05BE}(?=\S*\u{05BE})|\S*\u{05BE}(?!\S*\u{05BE})|\S*-(?!\S*-)|\S*-(?=\S*-)|\S*\s*)/u;

/**
 * A positive lookahead expression to split a word into clusters
 */
export const clusterSplitGroup =
  /(?=[\u{05BE}\u{05C3}\u{05C6}\u{05D0}-\u{05F2}\u{2000}-\u{206F}\u{2E00}-\u{2E7F}'!"#$%&()*+,-.\/:;<=>?@\[\]^_`\{|\}~])/u;

/**
 * A positive lookahead expression to split a word into clusters
 *
 * @deprecated use clusterSplitGroup instead; this is a typo
 */
export const clusterSlitGroup = clusterSplitGroup;

export const jerusalemTest = new RegExp(
  `(?<vowel>[\u{5B8}\u{5B7}])(?<hiriq>\u{5B4})(?<taamimMatch>${taamim.source}|\u{05BD})(?<mem>\u{05DD}.*)$`,
  "u"
);
