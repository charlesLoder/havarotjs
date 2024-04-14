/* eslint-disable  sort-keys  */
/* eslint-disable  @typescript-eslint/naming-convention */
// it is better to have they keys sorted by unicode position rather then name

/**
 * An object where the key is a character and the value is its partial Unicode name
 *
 * @description
 * Typically, the partial Unicode name is the same as the name of the character without any prefixes (e.g. HEBREW ACCENT).
 * The only exceptions that had to be changed were:
 * - \u{0592} from `"SEGOL"` to `"SEGOL_ACCENT"`
 * - \u{05F3} from `"GERESH"` to `"GERESH_PUNCTUATION"`
 * - \u{05F4} from `"GERSHAYIM"` to `"GERSHAYIM_PUNCTUATION"`
 *
 */
export const charToNameMap = {
  // ------
  // TAAMIM
  // ------
  "\u{0591}": "ETNAHTA",
  "\u{0592}": "SEGOL_ACCENT",
  "\u{0593}": "SHALSHELET",
  "\u{0594}": "ZAQEF_QATAN",
  "\u{0595}": "ZAQEF_GADOL",
  "\u{0596}": "TIPEHA",
  "\u{0597}": "REVIA",
  "\u{0598}": "ZARQA",
  "\u{0599}": "PASHTA",
  "\u{059A}": "YETIV",
  "\u{059B}": "TEVIR",
  "\u{059C}": "GERESH",
  "\u{059D}": "GERESH_MUQDAM",
  "\u{059E}": "GERSHAYIM",
  "\u{059F}": "QARNEY_PARA",
  "\u{05A0}": "TELISHA_GEDOLA",
  "\u{05A1}": "PAZER",
  "\u{05A2}": "ATNAH_HAFUKH",
  "\u{05A3}": "MUNAH",
  "\u{05A4}": "MAHAPAKH",
  "\u{05A5}": "MERKHA",
  "\u{05A6}": "MERKHA_KEFULA",
  "\u{05A7}": "DARGA",
  "\u{05A8}": "QADMA",
  "\u{05A9}": "TELISHA_QETANA",
  "\u{05AA}": "YERAH_BEN_YOMO",
  "\u{05AB}": "OLE",
  "\u{05AC}": "ILUY",
  "\u{05AD}": "DEHI",
  "\u{05AE}": "ZINOR",

  // ------
  // SHEVA
  // ------
  "\u{05B0}": "SHEVA",

  // ------
  // NIQQUD
  // ------
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
  "\u{05C7}": "QAMATS_QATAN",

  // ------
  // CONSONANTS
  // ------
  "\u{05D0}": "ALEF",
  "\u{05D1}": "BET",
  "\u{05D2}": "GIMEL",
  "\u{05D3}": "DALET",
  "\u{05D4}": "HE",
  "\u{05D5}": "VAV",
  "\u{05D6}": "ZAYIN",
  "\u{05D7}": "HET",
  "\u{05D8}": "TET",
  "\u{05D9}": "YOD",
  "\u{05DA}": "FINAL_KAF",
  "\u{05DB}": "KAF",
  "\u{05DC}": "LAMED",
  "\u{05DD}": "FINAL_MEM",
  "\u{05DE}": "MEM",
  "\u{05DF}": "FINAL_NUN",
  "\u{05E0}": "NUN",
  "\u{05E1}": "SAMEKH",
  "\u{05E2}": "AYIN",
  "\u{05E3}": "FINAL_PE",
  "\u{05E4}": "PE",
  "\u{05E5}": "FINAL_TSADI",
  "\u{05E6}": "TSADI",
  "\u{05E7}": "QOF",
  "\u{05E8}": "RESH",
  "\u{05E9}": "SHIN",
  "\u{05EA}": "TAV",

  // ------
  // DAGESH & RAFE
  // ------
  "\u{05BC}": "DAGESH",
  "\u{05BF}": "RAFE",

  // ------
  // PUNCTUATION
  // ------
  "\u{05BE}": "MAQAF",
  "\u{05C0}": "PASEQ",
  "\u{05C3}": "SOF_PASUQ",
  "\u{05C6}": "NUN_HAFUKHA",
  "\u{05F3}": "GERESH_PUNCTUATION",
  "\u{05F4}": "GERSHAYIM_PUNCTUATION",

  // ------
  // LIGATURES
  // ------
  "\u{05C1}": "SHIN_DOT",
  "\u{05C2}": "SIN_DOT",

  // ------
  // MARKS
  // ------
  "\u{05AF}": "MASORA_CIRCLE",
  "\u{05C4}": "UPPER_DOT",
  "\u{05C5}": "LOWER_DOT",

  // ------
  // YOD TRIANGLE
  // ------
  "\u{05EF}": "YOD_TRIANGLE",

  // ------
  // YIDDISH
  // ------
  "\u{05F0}": "DOUBLE_VAV",
  "\u{05F1}": "VAV_YOD",
  "\u{05F2}": "DOUBLE_YOD"
} as const;

export type CharToNameMap = typeof charToNameMap;

/**
 * A type guard to check that the character is a key of the `CharToNameMap` type
 *
 * @param char a character
 * @returns true if the character is a key in the `CharToNameMap`
 */
export const isCharKeyOfCharToNameMap = (char: string): char is keyof CharToNameMap => {
  return char in charToNameMap;
};

export type NameToCharMap = { [K in keyof CharToNameMap as CharToNameMap[K]]: K };

/**
 * an object where the key is a character's partial Unicode name and the value is the character
 * — HEBREW POINT has been removed and spaces replaced wiith underscores (e.g. "HATAF_PATAH")
 */
export const nameToCharMap: NameToCharMap = {
  // ------
  // TAAMIM
  // ------
  ETNAHTA: "\u{0591}",
  SEGOL_ACCENT: "\u{0592}",
  SHALSHELET: "\u{0593}",
  ZAQEF_QATAN: "\u{0594}",
  ZAQEF_GADOL: "\u{0595}",
  TIPEHA: "\u{0596}",
  REVIA: "\u{0597}",
  ZARQA: "\u{0598}",
  PASHTA: "\u{0599}",
  YETIV: "\u{059A}",
  TEVIR: "\u{059B}",
  GERESH: "\u{059C}",
  GERESH_MUQDAM: "\u{059D}",
  GERSHAYIM: "\u{059E}",
  QARNEY_PARA: "\u{059F}",
  TELISHA_GEDOLA: "\u{05A0}",
  PAZER: "\u{05A1}",
  ATNAH_HAFUKH: "\u{05A2}",
  MUNAH: "\u{05A3}",
  MAHAPAKH: "\u{05A4}",
  MERKHA: "\u{05A5}",
  MERKHA_KEFULA: "\u{05A6}",
  DARGA: "\u{05A7}",
  QADMA: "\u{05A8}",
  TELISHA_QETANA: "\u{05A9}",
  YERAH_BEN_YOMO: "\u{05AA}",
  OLE: "\u{05AB}",
  ILUY: "\u{05AC}",
  DEHI: "\u{05AD}",
  ZINOR: "\u{05AE}",

  // ------
  // SHEVA
  // ------
  SHEVA: "\u{05B0}",

  // ------
  // NIQQUD
  // ------
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
  QAMATS_QATAN: "\u{05C7}",

  // ------
  // CONSONANTS
  // ------
  ALEF: "\u{05D0}",
  BET: "\u{05D1}",
  GIMEL: "\u{05D2}",
  DALET: "\u{05D3}",
  HE: "\u{05D4}",
  VAV: "\u{05D5}",
  ZAYIN: "\u{05D6}",
  HET: "\u{05D7}",
  TET: "\u{05D8}",
  YOD: "\u{05D9}",
  FINAL_KAF: "\u{05DA}",
  KAF: "\u{05DB}",
  LAMED: "\u{05DC}",
  FINAL_MEM: "\u{05DD}",
  MEM: "\u{05DE}",
  FINAL_NUN: "\u{05DF}",
  NUN: "\u{05E0}",
  SAMEKH: "\u{05E1}",
  AYIN: "\u{05E2}",
  FINAL_PE: "\u{05E3}",
  PE: "\u{05E4}",
  FINAL_TSADI: "\u{05E5}",
  TSADI: "\u{05E6}",
  QOF: "\u{05E7}",
  RESH: "\u{05E8}",
  SHIN: "\u{05E9}",
  TAV: "\u{05EA}",

  // ------
  // DAGESH & RAFE
  // ------
  DAGESH: "\u{05BC}",
  RAFE: "\u{05BF}",

  // ------
  // PUNCTUATION
  // ------
  MAQAF: "\u{05BE}",
  PASEQ: "\u{05C0}",
  SOF_PASUQ: "\u{05C3}",
  NUN_HAFUKHA: "\u{05C6}",
  GERESH_PUNCTUATION: "\u{05F3}",
  GERSHAYIM_PUNCTUATION: "\u{05F4}",

  // ------
  // LIGATURES
  // ------
  SHIN_DOT: "\u{05C1}",
  SIN_DOT: "\u{05C2}",

  // ------
  // MARKS
  // ------
  MASORA_CIRCLE: "\u{05AF}",
  UPPER_DOT: "\u{05C4}",
  LOWER_DOT: "\u{05C5}",

  // ------
  // YOD TRIANGLE
  // ------
  YOD_TRIANGLE: "\u{05EF}",

  // ------
  // YIDDISH
  // ------
  DOUBLE_VAV: "\u{05F0}",
  VAV_YOD: "\u{05F1}",
  DOUBLE_YOD: "\u{05F2}"
};

export const isNameKeyOfNameToCharMap = (name: string): name is keyof NameToCharMap => {
  return name in nameToCharMap;
};
