import { Text } from "../src/index";

describe.each`
  description          | word             | hasQamQat | hasQamets | qamQatOpt
  ${"simple nominal"}  | ${"חָפְנִי֙"}    | ${false}  | ${true}   | ${false}
  ${"simple nominal"}  | ${"חָפְנִי֙"}    | ${true}   | ${false}  | ${true}
  ${"kol with maqqef"} | ${"כָּל־דְּבַר"} | ${true}   | ${false}  | ${true}
  ${"kol with maqqef"} | ${"כָּל־דְּבַר"} | ${false}  | ${true}   | ${false}
`("qametsQatan:", ({ description, word, hasQamQat, hasQamets, qamQatOpt }) => {
  const text = new Text(word, { qametsQatan: qamQatOpt });
  const sanitized = text.text;
  const qQRegx = /\u{05C7}/u;
  const qamRegx = /\u{05B8}/u;
  describe(`pattern: ${description}, qametsQatan: ${qamQatOpt}`, () => {
    test(`Has Qamets Qatan should equal ${hasQamQat}`, () => {
      expect(qQRegx.test(sanitized)).toEqual(hasQamQat);
    });

    test(`Has Qamets should equal ${hasQamets}`, () => {
      expect(qamRegx.test(sanitized)).toEqual(hasQamets);
    });
  });
});

describe.each`
  description               | word            | syllables                     | isClosedArr                    | sqnmlvyOpt
  ${"wayyiqtol, no metheg"} | ${"וַיְצַחֵק֙"} | ${["וַיְ", "צַ", "חֵק֙"]}     | ${[true, false, true]}         | ${false}
  ${"wayyiqtol, no metheg"} | ${"וַיְצַחֵק֙"} | ${["וַ", "יְ", "צַ", "חֵק֙"]} | ${[false, false, false, true]} | ${true}
  ${"wayyiqtol,  metheg"}   | ${"וַֽיְהִי֙"}  | ${["וַֽ", "יְ", "הִי֙"]}      | ${[false, false, false]}       | ${false}
  ${"wayyiqtol,  metheg"}   | ${"וַֽיְהִי֙"}  | ${["וַֽ", "יְ", "הִי֙"]}      | ${[false, false, false]}       | ${true}
`("sqnmlvy:", ({ description, word, syllables, isClosedArr, sqnmlvyOpt }) => {
  const text = new Text(word, { sqnmlvy: sqnmlvyOpt });
  const sylText = text.syllables.map((syl) => syl.text);
  const isClosed = text.syllables.map((syl) => syl.isClosed);
  describe(description, () => {
    test(`sqnlvy is ${sqnmlvyOpt}`, () => {
      expect(sylText).toEqual(syllables);
    });

    test(`isClosed`, () => {
      expect(isClosed).toEqual(isClosedArr);
    });
  });
});

describe.each`
  description                | word             | syllables                      | isClosedArr                   | wawShureqOpt
  ${"vav-shureq, no metheg"} | ${"וּלְמַזֵּר"}  | ${["וּ", "לְ", "מַ", "זֵּר"]}  | ${[false, false, true, true]} | ${true}
  ${"vav-shureq, no metheg"} | ${"וּלְמַזֵּר"}  | ${["וּלְ", "מַ", "זֵּר"]}      | ${[true, true, true]}         | ${false}
  ${"vav-shureq,  metheg"}   | ${"וּֽלְמַזֵּר"} | ${["וּֽ", "לְ", "מַ", "זֵּר"]} | ${[false, false, true, true]} | ${true}
  ${"vav-shureq,  metheg"}   | ${"וּֽלְמַזֵּר"} | ${["וּֽ", "לְ", "מַ", "זֵּר"]} | ${[false, false, true, true]} | ${false}
  ${"medial shureq"}         | ${"פְּקוּדָה"}   | ${["פְּ", "קוּ", "דָה"]}       | ${[false, false, false]}      | ${false}
`("wawShureq:", ({ description, word, syllables, isClosedArr, wawShureqOpt }) => {
  const text = new Text(word, { wawShureq: wawShureqOpt });
  const sylText = text.syllables.map((syl) => syl.text);
  const isClosed = text.syllables.map((syl) => syl.isClosed);
  describe(description, () => {
    test(`wawShureq is ${wawShureqOpt}`, () => {
      expect(sylText).toEqual(syllables);
    });

    test(`isClosed`, () => {
      expect(isClosed).toEqual(isClosedArr);
    });
  });
});

describe.each`
  description         | word         | syllables              | isClosedArr              | longVowelsOpt | qametsQatanOpt
  ${"regular qamets"} | ${"יָדְךָ"}  | ${["יָ", "דְ", "ךָ"]}  | ${[false, false, false]} | ${true}       | ${true}
  ${"regular qamets"} | ${"יָדְךָ"}  | ${["יָדְ", "ךָ"]}      | ${[true, false]}         | ${false}      | ${true}
  ${"qamets qatan"}   | ${"חָפְנִי"} | ${["חׇפְ", "נִי"]}     | ${[true, false]}         | ${true}       | ${true}
  ${"qamets qatan"}   | ${"חָפְנִי"} | ${["חׇפְ", "נִי"]}     | ${[true, false]}         | ${false}      | ${true}
  ${"qamets qatan"}   | ${"חָפְנִי"} | ${["חָ", "פְ", "נִי"]} | ${[false, false, false]} | ${true}       | ${false}
  ${"qamets qatan"}   | ${"חָפְנִי"} | ${["חָפְ", "נִי"]}     | ${[true, false]}         | ${false}      | ${false}
`("longVowels:", ({ description, word, syllables, isClosedArr, longVowelsOpt, qametsQatanOpt }) => {
  const text = new Text(word, { longVowels: longVowelsOpt, qametsQatan: qametsQatanOpt });
  const sylText = text.syllables.map((syl) => syl.text);
  const isClosed = text.syllables.map((syl) => syl.isClosed);
  describe(description, () => {
    test(`longVowels is ${longVowelsOpt}`, () => {
      expect(sylText).toEqual(syllables);
    });

    test(`isClosed`, () => {
      expect(isClosed).toEqual(isClosedArr);
    });
  });
});
