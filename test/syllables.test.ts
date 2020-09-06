import { Text } from "../src/index";
import { sequence } from "hebrew-transliteration";

const tests = (original: string, sylArr: string[], closedArr: boolean[], accentArr: boolean[]) => {
  let heb = new Text(original);
  let sylText = heb.syllables.map((syllable) => syllable.text);
  let sylRes = sylArr.map((el: string) => sequence(el));
  let isClosed = heb.syllables.map((syllable) => syllable.isClosed);
  let isAccented = heb.syllables.map((syllable) => syllable.isAccented);
  test(`syllable text to equal ${sylRes}`, () => {
    expect(sylText).toEqual(sylRes);
  });

  test(`closed pattern to equal ${closedArr}`, () => {
    expect(isClosed).toEqual(closedArr);
  });

  test(`accent pattern to equal ${accentArr}`, () => {
    expect(isAccented).toEqual(accentArr);
  });
};

describe.each`
  description                                          | original    | sylArr        | closedArr | accentArr
  ${"1 Syl: lexical form - one vowel (yām)"}           | ${"יָ֥ם"}   | ${["יָ֥ם"]}   | ${[true]} | ${[true]}
  ${"1 Syl: inflected preposition (lāk)"}              | ${"לֵךְ"}   | ${["לָךְ"]}   | ${[true]} | ${[true]}
  ${"1 Syl: prefixed prep w/ shewa"}                   | ${"וְיַ֥ד"} | ${["וְיַ֥ד"]} | ${[true]} | ${[true]}
  ${"1 Syl: lexical form contains hatef vowel (ĕmet)"} | ${"אֱמֶ֔ת"} | ${["אֱמֶ֔ת"]} | ${[true]} | ${[true]}
`("$description", ({ original, sylArr, closedArr, accentArr }) => {
  tests(original, sylArr, closedArr, accentArr);
});

describe.each`
  description                                                                 | original           | sylArr                       | closedArr               | accentArr
  ${"2 Syl: lexical form - two vowels (dābār)"}                               | ${"דָּבָ֑ר"}       | ${["דָּ", "בָ֑ר"]}           | ${[false, true]}        | ${[false, true]}
  ${"2 Syl: lexical form - two vowels (qodeš), accent on first"}              | ${"קֹ֔דֶשׁ"}       | ${["קֹ֔", "דֶשׁ"]}           | ${[false, true]}        | ${[true, false]}
  ${"2 Syl: lexical form - two vowels, final shewa (melek), accent on first"} | ${"מֶ֣לֶךְ"}       | ${["מֶ֣", "לֶךְ"]}           | ${[false, true]}        | ${[true, false]}
  ${"2 Syl: lexical form (dāwid) prefixed conj w/ shewa"}                     | ${"וְדָוִ֖ד"}      | ${["וְדָ", "וִ֖ד"]}          | ${[false, true]}        | ${[false, true]}
  ${"2 Syl: lexical form contains hatef (ĕlohim)"}                            | ${"אֱלֹהִ֑ים"}     | ${["אֱלֹ", "הִ֑ים"]}         | ${[false, true]}        | ${[false, true]}
  ${"2 Syl: lexical form contains hatef (ĕmet) prefixed conj w/ vowel"}       | ${"וֶאֱמֶ֔ת"}      | ${["וֶ", "אֱמֶ֔ת"]}          | ${[false, true]}        | ${[false, true]}
  ${"2 Syl: lexical form one shewa and closes syllable (midbar)"}             | ${"מִדְבַּ֣ר"}     | ${["מִדְ", "בַּ֣ר"]}         | ${[true, true]}         | ${[false, true]}
  ${"2 Syl: inflected form with one shewa and begins syllable (bārǝkî)"}      | ${"בָּרְכ֣וּ"}     | ${["בָּ", "רְכ֣וּ"]}         | ${[false, false]}       | ${[false, true]}
  ${"2 Syl: with qamets qatan (ḥokmâ)"}                                       | ${"חָכְמָ֑ה"}      | ${["ח\u{5C7}כְ", "מָ֑ה"]}    | ${[true, false]}        | ${[false, true]}
  ${"2 Syl: with qamets gadol (ḥākǝmâ)"}                                      | ${"חָֽכְמָ֖ה"}     | ${["חָֽ", "כְמָ֖ה"]}         | ${[false, false]}       | ${[false, true]}
  ${"3 Syl: 2ms qatal verb consecution (wǝšāmartā́)"}                          | ${"וְשָׁמַרְתָּ֖"} | ${["וְשָׁ", "מַרְ", "תָּ֖"]} | ${[false, true, false]} | ${[false, false, true]}
  ${"3 Syl: lexical form - two vowels (dābār) + article"}                     | ${"הַדָּבָ֥ר"}     | ${["הַ", "דָּ", "בָ֥ר"]}     | ${[true, false, true]}  | ${[false, false, true]}
`("$description", ({ original, sylArr, closedArr, accentArr }) => {
  tests(original, sylArr, closedArr, accentArr);
});

describe.each`
  description                                             | original           | sylArr                       | closedArr               | accentArr
  ${"3 Syl: 2ms qatal verb consecution (wǝšāmartā́)"}      | ${"וְשָׁמַרְתָּ֖"} | ${["וְשָׁ", "מַרְ", "תָּ֖"]} | ${[false, true, false]} | ${[false, false, true]}
  ${"3 Syl: lexical form - two vowels (dābār) + article"} | ${"הַדָּבָ֥ר"}     | ${["הַ", "דָּ", "בָ֥ר"]}     | ${[true, false, true]}  | ${[false, false, true]}
`("$description", ({ original, sylArr, closedArr, accentArr }) => {
  tests(original, sylArr, closedArr, accentArr);
});
