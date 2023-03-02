import { Text } from "../src/index";

describe("validate options", () => {
  test("throw error when passed incorrect prop", () => {
    // TypeScript throws error:
    // "Object literal may only specify known properties, and 'foo' does not exist in type 'SylOpts'.ts(2345)"
    // but we ignore in order to test validation
    // @ts-ignore
    expect(() => new Text("וּלְמַזֵּר", { foo: true })).toThrowError();
  });

  describe("throw error when passed incorrect prop value", () => {
    test.each(["qametsQatan", "sqnmlvy", "wawShureq", "longVowels", "article", "strict", "holemHaser"])("%s", (key) => {
      expect(() => new Text("וּלְמַזֵּר", { [key]: "foo" })).toThrowError();
    });
  });

  describe("no error when passed bool", () => {
    test.each(["qametsQatan", "sqnmlvy", "wawShureq", "longVowels", "article", "strict"])("%s", (key) => {
      expect(() => new Text("וּלְמַזֵּר", { [key]: true })).not.toThrowError();
    });
  });

  describe("no error when holemHaser passed valid option", () => {
    test.each(["update", "preserve", "remove"])("%s", (key) => {
      //@ts-ignore
      expect(() => new Text("וּלְמַזֵּר", { holemHaser: key })).not.toThrowError();
    });
  });
});

describe.each`
  description                              | word             | syllables                      | isClosedArr                   | articleOpt
  ${"article, with he and yod, default"}   | ${"הַיְאֹ֗ר"}    | ${["הַ", "יְ", "אֹ֗ר"]}        | ${[false, false, true]}       | ${true}
  ${"article, with he and yod, false"}     | ${"הַיְאֹ֗ר"}    | ${["הַיְ", "אֹ֗ר"]}            | ${[true, true]}               | ${false}
  ${"article, with he and mem, default"}   | ${"הַמְעַ֖ט"}    | ${["הַ", "מְ", "עַ֖ט"]}        | ${[false, false, true]}       | ${true}
  ${"article, with he and mem, false"}     | ${"הַמְעַ֖ט"}    | ${["הַמְ", "עַ֖ט"]}            | ${[true, true]}               | ${false}
  ${"article, with he and lamed, default"} | ${"הַלְוִיִּ֞ם"} | ${["הַ", "לְ", "וִ", "יִּ֞ם"]} | ${[false, false, true, true]} | ${true}
  ${"article, with he and lamed, false"}   | ${"הַלְוִיִּ֞ם"} | ${["הַלְ", "וִ", "יִּ֞ם"]}     | ${[true, true, true]}         | ${false}
`("article:", ({ description, word, syllables, isClosedArr, articleOpt }) => {
  const text = new Text(word, { article: articleOpt });
  const sylText = text.syllables.map((syl) => syl.text);
  const isClosed = text.syllables.map((syl) => syl.isClosed);
  describe(description, () => {
    test(`article is ${articleOpt}`, () => {
      expect(sylText).toEqual(syllables);
    });

    test(`isClosed`, () => {
      expect(isClosed).toEqual(isClosedArr);
    });
  });
});

describe.each`
  word           | sequence                           | holemHaser    | shouldHaveholemHaser | resultString
  ${"עָוֺ֔ן"}    | ${"V + zaqef qatan + holem haser"} | ${"update"}   | ${true}              | ${"עָוֺ֔ן"}
  ${"עָוֺ֔ן"}    | ${"V + zaqef qatan + holem haser"} | ${"preserve"} | ${true}              | ${"עָוֺ֔ן"}
  ${"עָוֺ֔ן"}    | ${"V + zaqef qatan + holem haser"} | ${"remove"}   | ${false}             | ${"עָוֹ֔ן"}
  ${"עָוֹ֔ן"}    | ${"V + zaqef qatan + holem"}       | ${"update"}   | ${true}              | ${"עָוֺ֔ן"}
  ${"עָוֹ֔ן"}    | ${"V + zaqef qatan + holem"}       | ${"preserve"} | ${false}             | ${"עָוֹ֔ן"}
  ${"עָוֹ֔ן"}    | ${"V + zaqef qatan + holem"}       | ${"remove"}   | ${false}             | ${"עָוֹ֔ן"}
  ${"אוֹר"}      | ${"C + holem male + V"}            | ${"remove"}   | ${false}             | ${"אֹור"}
  ${"כּ֫וֹרֶשׁ"} | ${"holem male with taam"}          | ${"update"}   | ${false}             | ${"כֹּ֫ורֶשׁ"}
  ${"כּ֫וֹרֶשׁ"} | ${"holem male with taam"}          | ${"preserve"} | ${false}             | ${"כֹּ֫ורֶשׁ"}
  ${"כּ֫וֹרֶשׁ"} | ${"holem male with taam"}          | ${"remove"}   | ${false}             | ${"כֹּ֫ורֶשׁ"}
  ${"כּוֹרֶשׁ"}  | ${"holem male w/o taam"}           | ${"update"}   | ${false}             | ${"כֹּורֶשׁ"}
  ${"כּוֹרֶשׁ"}  | ${"holem male w/o taam"}           | ${"update"}   | ${false}             | ${"כֹּורֶשׁ"}
  ${"כּוֹרֶשׁ"}  | ${"holem male w/o taam"}           | ${"update"}   | ${false}             | ${"כֹּורֶשׁ"}
`("holemHaser:", ({ word, sequence, holemHaser, shouldHaveholemHaser, resultString }) => {
  describe(`Sequence "${sequence}" with value "${holemHaser}" should ${
    !shouldHaveholemHaser ? "not " : ""
  }have a holem haser`, () => {
    const holemHaserRegx = /\u{05BA}/u;
    test(`${word}`, () => {
      const text = new Text(word, { holemHaser }).text;
      expect(holemHaserRegx.test(text)).toEqual(shouldHaveholemHaser);
      expect(text).toEqual(resultString);
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

describe.each`
  description                               | word                       | hasQamQat | hasQamets | qamQatOpt
  ${"simple nominal"}                       | ${"חָפְנִי֙"}              | ${false}  | ${true}   | ${false}
  ${"simple nominal"}                       | ${"חָפְנִי֙"}              | ${true}   | ${false}  | ${true}
  ${"kol with maqqef"}                      | ${"כָּל־דְּבַר"}           | ${true}   | ${false}  | ${true}
  ${"kol with maqqef"}                      | ${"כָּל־דְּבַר"}           | ${false}  | ${true}   | ${false}
  ${"kol w/ maqqef + mem prefix"}           | ${"מִכָּל־הַיְּהוּדִֽים׃"} | ${true}   | ${false}  | ${true}
  ${"kol w/ maqqef + mem prefix"}           | ${"מִכָּל־הַיְּהוּדִֽים׃"} | ${false}  | ${true}   | ${false}
  ${"kol w/o maqqef + mem prefix"}          | ${"מִכָּל הַלֵּילוֹת"}     | ${true}   | ${false}  | ${true}
  ${"kol w/o maqqef + mem prefix"}          | ${"מִכָּל הַלֵּילוֹת"}     | ${false}  | ${true}   | ${false}
  ${"kol w/o maqqef"}                       | ${"כָּל דְּבַר"}           | ${true}   | ${false}  | ${true}
  ${"kol w/o maqqef"}                       | ${"כָּל דְּבַר"}           | ${false}  | ${true}   | ${false}
  ${"kol w/ maqqef + waw prefix"}           | ${"וְכָל־יֵ֙צֶר֙"}         | ${true}   | ${false}  | ${true}
  ${"kol w/ maqqef + waw prefix"}           | ${"וְכָל־יֵ֙צֶר֙"}         | ${false}  | ${true}   | ${false}
  ${"kol w/ maqqef + shureq & bet prefix"}  | ${"וּבְכָל־נַפְשְׁכֶֽם׃"}  | ${true}   | ${false}  | ${true}
  ${"kol w/ maqqef + shureq & bet prefix"}  | ${"וּבְכָל־נַפְשְׁכֶֽם׃"}  | ${false}  | ${true}   | ${false}
  ${"kol w/ maqqef + bet prefix"}           | ${"לְכָל־חֵ֖פֶץ"}          | ${true}   | ${false}  | ${true}
  ${"kol w/ maqqef + bet prefix"}           | ${"בְּכָל־לְבַבְכֶ֖ם"}     | ${false}  | ${true}   | ${false}
  ${"kol w/ maqqef + lamed prefix"}         | ${"לְכָל־חֵ֖פֶץ"}          | ${true}   | ${false}  | ${true}
  ${"kol w/ maqqef + lamed prefix"}         | ${"לְכָל־חֵ֖פֶץ"}          | ${false}  | ${true}   | ${false}
  ${"kol w/o maqqef + waw prefix"}          | ${"וְכָל יֵ֙צֶר֙"}         | ${true}   | ${false}  | ${true}
  ${"kol w/o maqqef + waw prefix"}          | ${"וְכָל יֵ֙צֶר֙"}         | ${false}  | ${true}   | ${false}
  ${"kol w/o maqqef + shureq & bet prefix"} | ${"וּבְכָל נַפְשְׁכֶֽם׃"}  | ${true}   | ${false}  | ${true}
  ${"kol w/o maqqef + shureq & bet prefix"} | ${"וּבְכָל נַפְשְׁכֶֽם׃"}  | ${false}  | ${true}   | ${false}
  ${"kol w/o maqqef + bet prefix"}          | ${"בְּכָל לְבַבְכֶ֖ם"}     | ${true}   | ${false}  | ${true}
  ${"kol w/o maqqef + bet prefix"}          | ${"בְּכָל לְבַבְכֶ֖ם"}     | ${false}  | ${true}   | ${false}
  ${"kol w/o maqqef + lamed prefix"}        | ${"לְכָל חֵ֖פֶץ"}          | ${true}   | ${false}  | ${true}
  ${"kol w/o maqqef + lamed prefix"}        | ${"לְכָל חֵ֖פֶץ"}          | ${false}  | ${true}   | ${false}
  ${"kol alone"}                            | ${"כָּל"}           | ${true}   | ${false}  | ${true}
  ${"kol alone"}                            | ${"כָּל"}           | ${false}  | ${true}   | ${false}
  ${"kol alone + mem prefix"}               | ${"מִכָּל"}     | ${true}   | ${false}  | ${true}
  ${"kol alone + mem prefix"}               | ${"מִכָּל"}     | ${false}  | ${true}   | ${false}
  ${"kol alone + waw prefix"}               | ${"וְכָל"}         | ${true}   | ${false}  | ${true}
  ${"kol alone + waw prefix"}               | ${"וְכָל"}         | ${false}  | ${true}   | ${false}
  ${"kol alone + shureq & bet prefix"}      | ${"וּבְכָל"}  | ${true}   | ${false}  | ${true}
  ${"kol alone + shureq & bet prefix"}      | ${"וּבְכָל"}  | ${false}  | ${true}   | ${false}
  ${"kol alone + bet prefix"}               | ${"בְּכָל"}     | ${true}   | ${false}  | ${true}
  ${"kol alone + bet prefix"}               | ${"בְּכָל"}     | ${false}  | ${true}   | ${false}
  ${"kol alone + lamed prefix"}             | ${"לְכָל"}          | ${true}   | ${false}  | ${true}
  ${"kol alone + lamed prefix"}             | ${"לְכָל"}          | ${false}  | ${true}   | ${false}
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
  description              | word            | syllables                     | isClosedArr                    | sqnmlvyOpt
  ${"wayyiqtol, no meteg"} | ${"וַיְצַחֵק֙"} | ${["וַיְ", "צַ", "חֵק֙"]}     | ${[true, false, true]}         | ${false}
  ${"wayyiqtol, no meteg"} | ${"וַיְצַחֵק֙"} | ${["וַ", "יְ", "צַ", "חֵק֙"]} | ${[false, false, false, true]} | ${true}
  ${"wayyiqtol,  meteg"}   | ${"וַֽיְהִי֙"}  | ${["וַֽ", "יְ", "הִי֙"]}      | ${[false, false, false]}       | ${false}
  ${"wayyiqtol,  meteg"}   | ${"וַֽיְהִי֙"}  | ${["וַֽ", "יְ", "הִי֙"]}      | ${[false, false, false]}       | ${true}
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
  description                            | word                | strict
  ${"threw hasShortVowel error"}         | ${"אלִי"}           | ${true}
  ${"threw hasShortVowel error"}         | ${"אלִי"}           | ${false}
  ${"threw Cluster with a Shureq error"} | ${"לְוּדְרְדַּיְל"} | ${true}
  ${"threw Cluster with a Shureq error"} | ${"לְוּדְרְדַּיְל"} | ${false}
`("strict, errors:", ({ description, word, strict }) => {
  describe(description, () => {
    if (strict) {
      test(`${word}`, () => {
        expect(() => new Text(word, { strict: strict }).syllables).toThrowError();
      });
    } else {
      test(`${word}`, () => {
        expect(() => new Text(word, { strict: strict }).syllables).not.toThrowError();
      });
    }
  });
});

describe.each`
  description               | word              | strict   | syllables
  ${"medial matres"}        | ${"רָקִ֖יעַ"}     | ${false} | ${["רָ", "קִ֖י", "עַ"]}
  ${"medial quiesced alef"} | ${"בְּרֵאשִׁ֖ית"} | ${false} | ${["בְּ", "רֵא", "שִׁ֖ית"]}
  ${"medial segol yod"}     | ${"אֱלֹהֶ֑יךָ"}   | ${false} | ${["אֱ", "לֹ", "הֶ֑י", "ךָ"]}
  ${"medial shureq"}        | ${"רוּחַ"}        | ${false} | ${["רוּ", "חַ"]}
  ${"medial shureq"}        | ${"רוּחַ"}        | ${true}  | ${["רוּ", "חַ"]}
`("strict, correct syls:", ({ description, word, strict, syllables }) => {
  describe(description, () => {
    test(`${word}`, () => {
      const sylsText = new Text(word, { strict: strict }).syllables.map((s) => s.text);
      expect(sylsText).toEqual(syllables);
    });
  });
});

describe.each`
  description               | word             | syllables                      | isClosedArr                   | wawShureqOpt
  ${"vav-shureq, no meteg"} | ${"וּלְמַזֵּר"}  | ${["וּ", "לְ", "מַ", "זֵּר"]}  | ${[false, false, true, true]} | ${true}
  ${"vav-shureq, no meteg"} | ${"וּלְמַזֵּר"}  | ${["וּלְ", "מַ", "זֵּר"]}      | ${[true, true, true]}         | ${false}
  ${"vav-shureq, meteg"}    | ${"וּֽלְמַזֵּר"} | ${["וּֽ", "לְ", "מַ", "זֵּר"]} | ${[false, false, true, true]} | ${true}
  ${"vav-shureq, meteg"}    | ${"וּֽלְמַזֵּר"} | ${["וּֽ", "לְ", "מַ", "זֵּר"]} | ${[false, false, true, true]} | ${false}
  ${"medial shureq"}        | ${"פְּקוּדָה"}   | ${["פְּ", "קוּ", "דָה"]}       | ${[false, false, false]}      | ${false}
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
