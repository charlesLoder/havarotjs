/* eslint-disable  sort-keys  */
/* eslint-disable  @typescript-eslint/naming-convention */
// it is better to have they keys sorted by unicode position rather then name

export type CharToNameMap = {
  // ------
  // TAAMIM
  // ------
  "\u{0591}": "ETNAHTA"; // HEBREW ACCENT ETNAHTA (U+0591)
  "\u{0592}": "SEGOL_ACCENT"; // HEBREW ACCENT SEGOL (U+0592)
  "\u{0593}": "SHALSHELET"; // HEBREW ACCENT SHALSHELET (U+0593)
  "\u{0594}": "ZAQEF_QATAN"; // HEBREW ACCENT ZAQEF QATAN (U+0594)
  "\u{0595}": "ZAQEF_GADOL"; // HEBREW ACCENT ZAQEF GADOL (U+0595)
  "\u{0596}": "TIPEHA"; // HEBREW ACCENT TIPEHA (U+0596)
  "\u{0597}": "REVIA"; // HEBREW ACCENT REVIA (U+0597)
  "\u{0598}": "ZARQA"; // HEBREW ACCENT ZARQA (U+0598)
  "\u{0599}": "PASHTA"; // HEBREW ACCENT PASHTA (U+0599)
  "\u{059A}": "YETIV"; // HEBREW ACCENT YETIV (U+059A)
  "\u{059B}": "TEVIR"; // HEBREW ACCENT TEVIR (U+059B)
  "\u{059C}": "GERESH"; // HEBREW ACCENT GERESH (U+059C)
  "\u{059D}": "GERESH_MUQDAM"; // HEBREW ACCENT GERESH MUQDAM (U+059D)
  "\u{059E}": "GERSHAYIM"; // HEBREW ACCENT GERSHAYIM (U+059E)
  "\u{059F}": "QARNEY_PARA"; // HEBREW ACCENT QARNEY PARA (U+059F)
  "\u{05A0}": "TELISHA_GEDOLA"; // HEBREW ACCENT TELISHA GEDOLA (U+05A0)
  "\u{05A1}": "PAZER"; // HEBREW ACCENT PAZER (U+05A1)
  "\u{05A2}": "ATNAH_HAFUKH"; // HEBREW ACCENT ATNAH HAFUKH (U+05A2)
  "\u{05A3}": "MUNAH"; // HEBREW ACCENT MUNAH (U+05A3)
  "\u{05A4}": "MAHAPAKH"; // HEBREW ACCENT MAHAPAKH (U+05A4)
  "\u{05A5}": "MERKHA"; // HEBREW ACCENT MERKHA (U+05A5)
  "\u{05A6}": "MERKHA_KEFULA"; // HEBREW ACCENT MERKHA KEFULA (U+05A6)
  "\u{05A7}": "DARGA"; // HEBREW ACCENT DARGA (U+05A7)
  "\u{05A8}": "QADMA"; // HEBREW ACCENT QADMA (U+05A8)
  "\u{05A9}": "TELISHA_QETANA"; // HEBREW ACCENT TELISHA QETANA (U+05A9)
  "\u{05AA}": "YERAH_BEN_YOMO"; // HEBREW ACCENT YERAH BEN YOMO (U+05AA)
  "\u{05AB}": "OLE"; // HEBREW ACCENT OLE (U+05AB)
  "\u{05AC}": "ILUY"; // HEBREW ACCENT ILUY (U+05AC)
  "\u{05AD}": "DEHI"; // HEBREW ACCENT DEHI (U+05AD)
  "\u{05AE}": "ZINOR"; // HEBREW ACCENT ZINOR (U+05AE)

  // ------
  // NIQQUD
  // ------
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

  // ------
  // CONSONANTS
  // ------
  "\u{05D0}": "ALEF"; // HEBREW LETTER ALEF (U+05D0)
  "\u{05D1}": "BET"; // HEBREW LETTER BET (U+05D1)
  "\u{05D2}": "GIMEL"; // HEBREW LETTER GIMEL (U+05D2)
  "\u{05D3}": "DALET"; // HEBREW LETTER DALET (U+05D3)
  "\u{05D4}": "HE"; // HEBREW LETTER HE (U+05D4)
  "\u{05D5}": "VAV"; // HEBREW LETTER VAV (U+05D5)
  "\u{05D6}": "ZAYIN"; // HEBREW LETTER ZAYIN (U+05D6)
  "\u{05D7}": "HET"; // HEBREW LETTER HET (U+05D7)
  "\u{05D8}": "TET"; // HEBREW LETTER TET (U+05D8)
  "\u{05D9}": "YOD"; // HEBREW LETTER YOD (U+05D9)
  "\u{05DA}": "FINAL_KAF"; // HEBREW LETTER FINAL KAF (U+05DA)
  "\u{05DB}": "KAF"; // HEBREW LETTER KAF (U+05DB)
  "\u{05DC}": "LAMED"; // HEBREW LETTER LAMED (U+05DC)
  "\u{05DD}": "FINAL_MEM"; // HEBREW LETTER FINAL MEM (U+05DD)
  "\u{05DE}": "MEM"; // HEBREW LETTER MEM (U+05DE)
  "\u{05DF}": "FINAL_NUN"; // HEBREW LETTER FINAL NUN (U+05DF)
  "\u{05E0}": "NUN"; // HEBREW LETTER NUN (U+05E0)
  "\u{05E1}": "SAMEKH"; // HEBREW LETTER SAMEKH (U+05E1)
  "\u{05E2}": "AYIN"; // HEBREW LETTER AYIN (U+05E2)
  "\u{05E3}": "FINAL_PE"; // HEBREW LETTER FINAL PE (U+05E3)
  "\u{05E4}": "PE"; // HEBREW LETTER PE (U+05E4)
  "\u{05E5}": "FINAL_TSADI"; // HEBREW LETTER FINAL TSADI (U+05E5)
  "\u{05E6}": "TSADI"; // HEBREW LETTER TSADI (U+05E6)
  "\u{05E7}": "QOF"; // HEBREW LETTER QOF (U+05E7)
  "\u{05E8}": "RESH"; // HEBREW LETTER RESH (U+05E8)
  "\u{05E9}": "SHIN"; // HEBREW LETTER SHIN (U+05E9)
  "\u{05EA}": "TAV"; // HEBREW LETTER TAV (U+05EA)

  // ------
  // DAGESH & RAFE
  // ------
  "\u{05BC}": "DAGESH"; // HEBREW POINT DAGESH OR MAPIQ (U+05BC)
  "\u{05BF}": "RAFE"; // HEBREW POINT RAFE (U+05BF)

  // ------
  // PUNCTUATION
  // ------
  "\u{05BE}": "MAQAF"; // HEBREW PUNCTUATION MAQAF (U+05BE)
  "\u{05C0}": "PASEQ"; // HEBREW PUNCTUATION PASEQ (U+05C0)
  "\u{05C3}": "SOF_PASUQ"; // HEBREW PUNCTUATION SOF PASUQ (U+05C3)
  "\u{05C6}": "NUN_HAFUKHA"; // HEBREW PUNCTUATION NUN HAFUKHA (U+05C6)
  "\u{05F3}": "GERESH_PUNCTUATION"; // HEBREW PUNCTUATION GERESH (U+05F3)
  "\u{05F4}": "GERSHAYIM_PUNCTUATION"; // HEBREW PUNCTUATION GERSHAYIM (U+05F4)

  // ------
  // LIGATURES
  // ------
  "\u{05C1}": "SHIN_DOT"; // HEBREW POINT SHIN DOT (U+05C1)
  "\u{05C2}": "SIN_DOT"; // HEBREW POINT SIN DOT (U+05C2)

  // ------
  // MARKS
  // ------
  "\u{05AF}": "MASORA_CIRCLE"; // HEBREW MARK MASORA CIRCLE (U+05AF)
  "\u{05C4}": "UPPER_DOT"; // HEBREW MARK UPPER DOT (U+05C4)
  "\u{05C5}": "LOWER_DOT"; // HEBREW MARK LOWER DOT (U+05C5)

  // ------
  // YOD TRIANGLE
  // ------
  "\u{05EF}": "YOD_TRIANGLE"; // HEBREW YOD TRIANGLE (U+05EF)

  // ------
  // YIDDISH
  // ------
  "\u{05F0}": "DOUBLE_VAV"; // HEBREW LIGATURE YIDDISH DOUBLE VAV (U+05F0)
  "\u{05F1}": "VAV_YOD"; // HEBREW LIGATURE YIDDISH VAV YOD (U+05F1)
  "\u{05F2}": "DOUBLE_YOD"; // HEBREW LIGATURE YIDDISH DOUBLE YOD (U+05F2)
};

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
export const charToNameMap: CharToNameMap = {
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
