export type CharToNameMap = {
  /* eslint-disable  @typescript-eslint/naming-convention */
  "\u{05B1}": "HATAF_SEGOL"; // HEBREW POINT HATAF SEGOL (U+05B1)
  "\u{05B2}": "HATAF_PATAH"; // HEBREW POINT HATAF PATAH (U+05B2)
  "\u{05B3}": "HATAF_QAMATS"; // HEBREW POINT HATAF QAMATS (U+05B3)
  "\u{05B4}": "HIRIQ"; // HEBREW POINT HIRIQ (U+05B4)
  "\u{05B5}": "TSERE"; // HEBREW POINT TSERE (U+05B5)
  "\u{05B6}": "SEGOL"; // HEBREW POINT SEGOL (U+05B6)
  "\u{05B7}": "PATAH"; // HEBREW POINT PATAH (U+05B7)
  "\u{05B8}": "QAMATS"; // HEBREW POINT QAMATS (U+05B8)
  "\u{05B9}": "HOLAM"; // HEBREW POINT HOLAM (U+05B9)
  "\u{05BA}": "HOLAM_HASER"; // HEBREW POINT HOLAM HASER FOR VAV (U+05BA)
  "\u{05BB}": "QUBUTS"; // HEBREW POINT QUBUTS (U+05BB)
  "\u{05C7}": "QAMATS_QATAN"; // HEBREW POINT QAMATS QATAN (U+05C7)
};

export type NameToCharMap = { [K in keyof CharToNameMap as CharToNameMap[K]]: K };

/**
 * an object where the key is a character and the value is its partial Unicode name
 * — HEBREW POINT has been removed and spaces replaced wiith underscores (e.g. "HATAF_PATAH")
 */
export const charToNameMap: CharToNameMap = {
  /* eslint-disable  @typescript-eslint/naming-convention */
  "\u{05B1}": "HATAF_SEGOL",
  "\u{05B2}": "HATAF_PATAH",
  "\u{05B3}": "HATAF_QAMATS",
  "\u{05B4}": "HIRIQ",
  "\u{05B5}": "TSERE",
  "\u{05B6}": "SEGOL",
  "\u{05B7}": "PATAH",
  "\u{05B8}": "QAMATS",
  "\u{05B9}": "HOLAM",
  "\u{05BA}": "HOLAM_HASER",
  "\u{05BB}": "QUBUTS",
  "\u{05C7}": "QAMATS_QATAN"
};

/**
 * an object where the key is a character's partial Unicode name and the value is the character
 * — HEBREW POINT has been removed and spaces replaced wiith underscores (e.g. "HATAF_PATAH")
 */
export const nameToCharMap: NameToCharMap = {
  /* eslint-disable  @typescript-eslint/naming-convention */
  HATAF_SEGOL: "\u{05B1}",
  HATAF_PATAH: "\u{05B2}",
  HATAF_QAMATS: "\u{05B3}",
  HIRIQ: "\u{05B4}",
  TSERE: "\u{05B5}",
  SEGOL: "\u{05B6}",
  PATAH: "\u{05B7}",
  QAMATS: "\u{05B8}",
  HOLAM: "\u{05B9}",
  HOLAM_HASER: "\u{05BA}",
  QUBUTS: "\u{05BB}",
  QAMATS_QATAN: "\u{05C7}"
};
