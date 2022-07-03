export const taamim = /[\u{0591}-\u{05AF}\u{05BF}\u{05C0}\u{05C3}-\u{05C6}\u{05F3}\u{05F4}]/u;

/**
 * a Regex group of the entire Hebrew unicode block including alphabetic presentation forms
 */
export const hebChars = /[\u{0590}-\u{05FF}\u{FB1D}-\u{FB4F}]/u;

/**
 * @description group1: word w/ maqqef followed by word w/ maqqef;
 * group2: word w/ maqqef not followed by word w/ maqqef
 * group3: word followed by white space
 */
export const splitGroup = /(\S*\u{05BE}(?=\S*\u{05BE})|\S*\u{05BE}(?!\S*\u{05BE})|\S*\s*)/u;
