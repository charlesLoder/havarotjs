import { Text } from "../src/index";

describe.each`
  description                           | word           | hasQamQat | hasQamets
  ${"simple nominal pattern in array"}  | ${"חָפְנִי֙"}  | ${true}   | ${false}
  ${"simple verbal pattern in array"}   | ${"וַיָּ֥קָם"} | ${true}   | ${true}
  ${"qamets follwed by hatef-qamets"}   | ${"אָהֳלִי"}   | ${true}   | ${false}
  ${"qamets qatan and qamets"}          | ${"בָּשְׁתָּם"} | ${true}   | ${true}
  ${"nominal with boundary assertions"} | ${"יָמִים"}    | ${true}   | ${false}
`("Qamets Qatan, Single Word:", ({ description, word, hasQamQat, hasQamets }) => {
  const text = new Text(word);
  const sanitized = text.words[0].text;
  const qQRegx = /\u{05C7}/u;
  const qamRegx = /\u{05B8}/u;
  describe(description, () => {
    test(`Has Qamets Qatan should equal ${hasQamQat}`, () => {
      expect(qQRegx.test(sanitized)).toEqual(hasQamQat);
    });

    test(`Has Qamets should equal ${hasQamets}`, () => {
      expect(qamRegx.test(sanitized)).toEqual(hasQamets);
    });
  });
});

describe.each`
  description                  | word                       | firstHasQamQat | firstHasQamets | secHasQamQat | secHasQamets
  ${"nominal with maqqef"}     | ${"כָּל־הָעָם"}            | ${true}        | ${false}       | ${false}     | ${true}
  ${"nominal without maqqef"}  | ${"כָּל הָעָם"}            | ${true}        | ${false}       | ${false}     | ${true}
  ${"nominal no qamets qatan"} | ${"בְּרָכָ֗ל וְלַאֲשֶׁר֙"} | ${false}       | ${true}        | ${false}     | ${false}
`("Qamets Qatan, Two Words:", ({ description, word, firstHasQamQat, firstHasQamets, secHasQamQat, secHasQamets }) => {
  const text = new Text(word);
  const first = text.words[0].text;
  const second = text.words[1].text;
  const qQRegx = /\u{05C7}/u;
  const qamRegx = /\u{05B8}/u;
  describe(description, () => {
    test(`First word`, () => {
      expect(qQRegx.test(first)).toEqual(firstHasQamQat);
      expect(qamRegx.test(first)).toEqual(firstHasQamets);
    });

    test(`Second Word`, () => {
      expect(qQRegx.test(second)).toEqual(secHasQamQat);
      expect(qamRegx.test(second)).toEqual(secHasQamets);
    });
  });
});

describe.each`
  description                                                     | word          | holemWaw | wawHolem
  ${"const + holem + waw remains the same"}                       | ${"שָׁלֹום"}  | ${true}  | ${false}
  ${"const + waw + holem is swapped"}                             | ${"שָׁלוֹם"}  | ${true}  | ${false}
  ${"const + waw + holem is swapped, accent present"}             | ${"שָׁל֑וֹם"} | ${true}  | ${false}
  ${"consonatal waw with holem remains the same"}                 | ${"עֲוֹן"}    | ${false} | ${true}
  ${"consonatal waw with holem remains the same, accent present"} | ${"הֶעָוֹ֖ן"} | ${false} | ${true}
`("Holem Waw:", ({ description, word, holemWaw, wawHolem }) => {
  const text = new Text(word);
  const sanitized = text.text;
  const holemWawX = /\u{05B9}\u{05D5}/u;
  const wawHolemX = /\u{05D5}\u{05B9}/u;
  describe(description, () => {
    test(`Holem Precedes Waw ${holemWaw}`, () => {
      expect(holemWawX.test(sanitized)).toEqual(holemWaw);
    });

    test(`Waw Precedes Holem ${wawHolem}`, () => {
      expect(wawHolemX.test(sanitized)).toEqual(wawHolem);
    });
  });
});

describe.each`
  description                           | hebrew                | errorMssg
  ${"Text without niqqud, throw error"} | ${"בראשית ברא אלהים"} | ${"Text must contain niqqud"}
`("No Niqqud, throw error:", ({ hebrew, errorMssg }) => {
  test("Should throw error", () => {
    expect(() => new Text(hebrew)).toThrow(errorMssg);
  });
});

describe.each`
  description       | hebrew
  ${"Regular Text"} | ${"בְּרֵאשִׁית בָּרָא אֱלֹהִים"}
  ${"Only Mater"}   | ${"קוּם"}
`("Niqqud, no error:", ({ hebrew }) => {
  test("Should NOT throw error", () => {
    expect(() => new Text(hebrew)).not.toThrow();
  });
});

describe.each`
  description               | hebrew                           | numOfWords
  ${"Basic words"}          | ${"יְהוָ֣ה מָלָךְ֮"}             | ${2}
  ${"With Maqqef"}          | ${"לֹא־יִטֹּ֣שׁ"}                | ${2}
  ${"Multiple Maqqefs"}     | ${"עַל־כָּל־הַשָּׂרִים֙ דָּבָר"} | ${4}
  ${"Hyphen as Maqqefs"}    | ${"לֹא-יִטֹּ֣שׁ"}                | ${2}
  ${"2 Hyphens as Maqqefs"} | ${"לֹא--יִטֹּ֣שׁ"}               | ${2}
  ${"With Paseq"}           | ${"כִּ֤י ׀ לֹא־יִטֹּ֣שׁ"}        | ${4}
  ${"With English"}         | ${"כִּ֤י ׀ לֹא־יִטֹּ֣שׁ Psalm"}  | ${5}
`("Split Correctly:", ({ hebrew, numOfWords }) => {
  const text = new Text(hebrew);
  const words = text.words;
  const len = words.length;
  test("Correct Number of Words", () => {
    expect(len).toEqual(numOfWords);
  });
});
