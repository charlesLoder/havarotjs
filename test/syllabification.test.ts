import { Text } from "../src/index";
import { sequence } from "hebrew-transliteration";

const tests = (description: string, original: string, sylArr: string[], closedArr: boolean[], accentArr: boolean[]) => {
  const heb = new Text(original);
  const sylText = heb.syllables.map((syllable) => syllable.text);
  const sylRes = sylArr.map((el: string) => sequence(el));
  const isClosed = heb.syllables.map((syllable) => syllable.isClosed);
  const isAccented = heb.syllables.map((syllable) => syllable.isAccented);
  describe(description, () => {
    test(`syllable text to equal ${sylRes}`, () => {
      expect(sylText).toEqual(sylRes);
    });

    test(`closed pattern to equal ${closedArr}`, () => {
      expect(isClosed).toEqual(closedArr);
    });

    test(`accent pattern to equal ${accentArr}`, () => {
      expect(isAccented).toEqual(accentArr);
    });
  });
};

describe.each`
  description                                 | original   | sylArr       | closedArr  | accentArr
  ${"lexical form - one vowel, closed (yām)"} | ${"יָ֥ם"}  | ${["יָ֥ם"]}  | ${[true]}  | ${[true]}
  ${"final kaph (lāk)"}                       | ${"לָ֛ךְ"} | ${["לָ֛ךְ"]} | ${[true]}  | ${[true]}
  ${"with a mater (lô)"}                      | ${"ל֣וֹ"}  | ${["לֹ֣ו"]}  | ${[false]} | ${[true]}
`("1 Syllable:", ({ description, original, sylArr, closedArr, accentArr }) => {
  tests(description, original, sylArr, closedArr, accentArr);
});

describe.each`
  description                                                          | original       | sylArr                    | closedArr         | accentArr
  ${"lexical form - two vowels (dābār)"}                               | ${"דָּבָ֑ר"}   | ${["דָּ", "בָ֑ר"]}        | ${[false, true]}  | ${[false, true]}
  ${"lexical form - two vowels (qodeš), accent on first"}              | ${"קֹ֔דֶשׁ"}   | ${["קֹ֔", "דֶשׁ"]}        | ${[false, true]}  | ${[true, false]}
  ${"lexical form - two vowels, final shewa (melek), accent on first"} | ${"מֶ֣לֶךְ"}   | ${["מֶ֣", "לֶךְ"]}        | ${[false, true]}  | ${[true, false]}
  ${"lexical form contains hatef (ănî)"}                               | ${"אֲנִ֥י"}    | ${["אֲ", "נִ֥י"]}         | ${[false, false]} | ${[false, true]}
  ${"lexical form one shewa and closes syllable (midbar)"}             | ${"מִדְבַּ֣ר"} | ${["מִדְ", "בַּ֣ר"]}      | ${[true, true]}   | ${[false, true]}
  ${"with qamets qatan (ḥokmâ)"}                                       | ${"חָכְמָ֑ה"}  | ${["ח\u{5C7}כְ", "מָ֑ה"]} | ${[true, false]}  | ${[false, true]}
`("2 Syllables:", ({ description, original, sylArr, closedArr, accentArr }) => {
  tests(description, original, sylArr, closedArr, accentArr);
});

describe.each`
  description                                                        | original       | sylArr                   | closedArr                | accentArr
  ${"lexical form contains hatef (ĕlohim)"}                          | ${"אֱלֹהִ֑ים"} | ${["אֱ", "לֹ", "הִ֑ים"]} | ${[false, false, true]}  | ${[false, false, true]}
  ${"lexical form (dāwid) prefixed conj w/ shewa"}                   | ${"וְדָוִ֖ד"}  | ${["וְ", "דָ", "וִ֖ד"]}  | ${[false, false, true]}  | ${[false, false, true]}
  ${"lexical form contains hatef (ĕmet) prefixed conj w/ vowel"}     | ${"וֶאֱמֶ֔ת"}  | ${["וֶ", "אֱ", "מֶ֔ת"]}  | ${[false, false, true]}  | ${[false, false, true]}
  ${"inflected form with medial vocal shewa (bārǝkû)"}               | ${"בָּרְכ֣וּ"} | ${["בָּ", "רְ", "כ֣וּ"]} | ${[false, false, false]} | ${[false, false, true]}
  ${"inflected form with medial vocal shewa and doubling (sappǝrû)"} | ${"סַפְּר֤וּ"} | ${["סַ", "פְּ", "ר֤וּ"]} | ${[true, false, false]}  | ${[false, false, true]}
  ${"with qamets gadol (ḥākǝmâ)"}                                    | ${"חָֽכְמָ֖ה"} | ${["חָֽ", "כְ", "מָ֖ה"]} | ${[false, false, false]} | ${[false, false, true]}
  ${"lexical form - two vowels (dābār) + article"}                   | ${"הַדָּבָ֥ר"} | ${["הַ", "דָּ", "בָ֥ר"]} | ${[true, false, true]}   | ${[false, false, true]}
  ${"inflected with SQNMLVY letter"}                                 | ${"וַיְהִ֗י"}  | ${["וַ", "יְ", "הִ֗י"]}  | ${[false, false, false]} | ${[false, false, true]}
`("3 Syllables:", ({ description, original, sylArr, closedArr, accentArr }) => {
  tests(description, original, sylArr, closedArr, accentArr);
});

describe.each`
  description                                            | original           | sylArr                           | closedArr                      | accentArr
  ${"2ms qatal verb consecution (wǝšāmartā́)"}            | ${"וְשָׁמַרְתָּ֖"} | ${["וְ", "שָׁ", "מַרְ", "תָּ֖"]} | ${[false, false, true, false]} | ${[false, false, false, true]}
  ${"shewa preceded by short vowel, but metheg present"} | ${"הַֽמְכַסֶּ֬ה"}  | ${["הַֽ", "מְ", "כַ", "סֶּ֬ה"]}  | ${[false, false, true, false]} | ${[false, false, false, true]}
  ${"initial shureq followed by shewa"}                  | ${"וּלְזַמֵּ֖ר"}   | ${["וּ", "לְ", "זַ", "מֵּ֖ר"]}   | ${[false, false, true, true]}  | ${[false, false, false, true]}
`("4 Syllables:", ({ description, original, sylArr, closedArr, accentArr }) => {
  tests(description, original, sylArr, closedArr, accentArr);
});
