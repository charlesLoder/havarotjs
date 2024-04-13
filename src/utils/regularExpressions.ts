/**
 * A positive lookahead expression to split a word into clusters
 */
export const clusterSplitGroup =
  /(?=[\u{05BE}\u{05C3}\u{05C6}\u{05D0}-\u{05F2}\u{2000}-\u{206F}\u{2E00}-\u{2E7F}'!"#$%&()*+,-.\/:;<=>?@\[\]^_`\{|\}~])/u;

/**
 * A positive lookahead expression to split a word into clusters
 * @deprecated use clusterSplitGroup instead; this is a typo
 *
 */
export const clusterSlitGroup = clusterSplitGroup;

/**
 * A regular expression for the Hebrew consonants
 *
 * ```js
 * /[\u{05D0}-\u{05F2}]/u;
 * ```
 */
export const consonants = /[\u{05D0}-\u{05F2}]/u;

/**
 * A regular expression for the  dagesh character
 *
 * ```js
 * /[\u{05BC}]/u;
 * ```
 */
export const dagesh = /[\u{05BC}]/u;

/**
 * A regular expression group of the entire Hebrew unicode block including alphabetic presentation forms
 *
 * ```js
 * /[\u{0590}-\u{05FF}\u{FB1D}-\u{FB4F}]/u;
 * ```
 */
export const hebChars = /[\u{0590}-\u{05FF}\u{FB1D}-\u{FB4F}]/u;

/**
 * A regular expression for the Hebrew ligatures (i.e. Shin and Sin dots)
 *
 * ```js
 * /[\u{05C1}-\u{05C2}]/u;
 * ```
 */
export const ligatures = /[\u{05C1}-\u{05C2}]/u;

/**
 * A regular expression for the Meteg character
 *
 * ```js
 * /\u{05BD}]u;
 * ```
 */
export const meteg = /\u{05BD}/u;

/**
 * A regular expression containing all the Hebrew characters of the category PUNCTUATION:
 *
 * - \u{05BE} HEBREW PUNCTUATION MAQAF ־
 * - \u{05C0} HEBREW PUNCTUATION PASEQ ׀
 * - \u{05C3} HEBREW PUNCTUATION SOF PASUQ ׃
 * - \u{05C6} HEBREW PUNCTUATION NUN HAFUKHA ׆
 *
 * ```js
 * /[\u{05BE}\u{05C0}\u{05C3}\u{05C6}]/u;
 * ```
 *
 */
export const punctuation = /[\u{05BE}\u{05C0}\u{05C3}\u{05C6}]/u;

/**
 * A regular expression containing all the Hebrew characters of the category PUNCTUATION in a capture group:
 *
 * - \u{05BE} HEBREW PUNCTUATION MAQAF ־
 * - \u{05C0} HEBREW PUNCTUATION PASEQ ׀
 * - \u{05C3} HEBREW PUNCTUATION SOF PASUQ ׃
 * - \u{05C6} HEBREW PUNCTUATION NUN HAFUKHA ׆
 *
 * ```js
 * /([\u{05BE}\u{05C0}\u{05C3}\u{05C6}])/u;
 * ```
 *
 */
export const punctuationCaptureGroup = /([\u{05BE}\u{05C0}\u{05C3}\u{05C6}])/u;

/**
 * A regular expression for the rafe character
 *
 * ```js
 * /\u{05BF}/u;
 * ```
 */
export const rafe = /\u{05BF}/u;

/**
 * A regular expression for splitting a word into groups
 *
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
 * A regular expression for the sheva character
 *
 * ```js
 * /\u{05B0}/u;
 * ```
 */
export const sheva = /\u{05B0}/u;

/**
 * A regular expression containing all the Hebrew characters of the category ACCENT:
 *
 * ```js
 * /[\u{0591}-\u{05AE}]/u;
 * ```
 */
export const taamim = /[\u{0591}-\u{05AE}]/u;

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
 * A regular expression containing all the Hebrew point characters (excluding rafe) in a capture group
 *
 * ```js
 * /([\u{05B0}-\u{05BB}\u{05C7}])/u;
 * ```
 */
export const vowelsCaptureGroupWithSheva = /([\u{05B0}-\u{05BB}\u{05C7}])/u;

// This needs to be at the end becuase taamim needs to be initalized first

export const jerusalemTest = new RegExp(
  `(?<vowel>[\u{5B8}\u{5B7}])(?<hiriq>\u{5B4})(?<taamimMatch>${taamim.source}|\u{05BD})(?<mem>\u{05DD}.*)$`,
  "u"
);
