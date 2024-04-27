import { Text } from "../src/index";

describe.each`
  description                 | name             | isDivineName | hasDivineName
  ${"Yehwah"}                 | ${"יְהוָה"}      | ${true}      | ${true}
  ${"Yehowah"}                | ${"יְהֹוָ֨ה"}    | ${true}      | ${true}
  ${"Yehowih"}                | ${"יֱהֹוִ֡ה"}    | ${true}      | ${true}
  ${"Yehwih"}                 | ${"יֱהוִה֙"}     | ${true}      | ${true}
  ${"Yǝhowih"}                | ${"יְהֹוִה֙"}    | ${true}      | ${true}
  ${"Yǝhwih"}                 | ${"יְהוִֽה"}     | ${true}      | ${true}
  ${"Bayhwah"}                | ${"בַּֽיהוָ֔ה"}  | ${false}     | ${true}
  ${"Followed by Latin char"} | ${"יְהוִֽה,"}    | ${true}      | ${true}
  ${"Bayhwah w/ Latin char"}  | ${"בַּֽיהוָ֔ה,"} | ${false}     | ${true}
`("Divine Name:", ({ description, name, isDivineName, hasDivineName }) => {
  const text = new Text(name);
  const word = text.words[0];
  const isDivine = word.isDivineName;
  const hasDivine = word.hasDivineName;
  describe(`Form: ${description}`, () => {
    test(`is it the Divine Name: ${isDivineName}`, () => {
      expect(isDivine).toEqual(isDivineName);
    });

    test(`does it have the Divine Name: ${hasDivineName}`, () => {
      expect(hasDivine).toEqual(hasDivineName);
    });
  });
});

describe.each`
  description               | hebrew        | wordNum | consonants
  ${"consonant characters"} | ${"הָאָ֖רֶץ"} | ${0}    | ${["ה", "א", "ר", "ץ"]}
`("consonants:", ({ description, hebrew, wordNum, consonants }) => {
  const heb = new Text(hebrew);
  const word = heb.words[wordNum];
  const syllableconsonants = word.consonants;
  describe(description, () => {
    test(`consonants to equal ${consonants}`, () => {
      expect(syllableconsonants).toEqual(consonants);
    });
  });
});

describe.each`
  description               | hebrew        | wordNum | consonantNames
  ${"consonant characters"} | ${"הָאָ֖רֶץ"} | ${0}    | ${["HE", "ALEF", "RESH", "FINAL_TSADI"]}
`("consonantNames:", ({ description, hebrew, wordNum, consonantNames }) => {
  const heb = new Text(hebrew);
  const word = heb.words[wordNum];
  describe(description, () => {
    test(`consonants to equal ${consonantNames}`, () => {
      expect(word.consonantNames).toEqual(consonantNames);
    });
  });
});

describe.each`
  description        | hebrew        | consonantName | hasConsonant
  ${"has consonant"} | ${"מַדּוּעַ"} | ${"MEM"}      | ${true}
  ${"not consonant"} | ${"לֹ֥א"}     | ${"MEM"}      | ${false}
`("hasConsonantName:", ({ description, hebrew, consonantName, hasConsonant }) => {
  const heb = new Text(hebrew);
  const word = heb.words[0];
  describe(description, () => {
    test(`hasConsonant for ${consonantName} to equal ${hasConsonant}`, () => {
      expect(word.hasConsonantName(consonantName)).toEqual(hasConsonant);
    });
  });
});

describe.each`
  description                  | hebrew              | taamName    | result
  ${"has character"}           | ${"הָאָ֖רֶץ"}       | ${"TIPEHA"} | ${true}
  ${"no character"}            | ${"וַֽיְהִי־כֵֽן׃"} | ${"TIPEHA"} | ${false}
  ${"has wrong character"}     | ${"הָאָ֖רֶץ"}       | ${"ZINOR"}  | ${false}
  ${"has multiple characters"} | ${"מִתָּ֑͏ַ֜חַת"}    | ${"GERESH"} | ${true}
`("hasTaamName:", ({ description, hebrew, taamName, result }) => {
  const heb = new Text(hebrew);
  const word = heb.words[0];
  const hasTaamName = word.hasTaamName(taamName);
  describe(description, () => {
    test(`Should word have ${taamName}? ${result}`, () => {
      expect(hasTaamName).toEqual(result);
    });
  });
});

describe("hasTaamName (error)", () => {
  test("throws error", () => {
    const text = new Text("הָאָ֖רֶץ");
    // @ts-expect-error: testing an invalid parameter
    expect(() => text.words[0].hasTaamName("BOB")).toThrow();
  });
});

describe.each`
  description                      | hebrew              | vowelName   | result
  ${"with patah"}                  | ${"הַֽ֭יְחָבְרְךָ"} | ${"PATAH"}  | ${true}
  ${"sheva"}                       | ${"הַֽ֭יְחָבְרְךָ"} | ${"SHEVA"}  | ${true}
  ${"silent sheva"}                | ${"בַּרְנֵֽעַ׃"}    | ${"SHEVA"}  | ${false}
  ${"qamats"}                      | ${"הַֽ֭יְחָבְרְךָ"} | ${"QAMATS"} | ${true}
  ${"shureq"}                      | ${"תִגְּע֖וּ"}      | ${"SHUREQ"} | ${true}
  ${"vav and dagesh (not shureq)"} | ${"הַוּֽוֹת׃"}      | ${"SHUREQ"} | ${false}
  ${"tsere-yod"}                   | ${"קָדְשֵׁ֧י"}      | ${"TSERE"}  | ${true}
  ${"holam-vav"}                   | ${"בַּיּ֣וֹם"}      | ${"HOLAM"}  | ${true}
  ${"hiriq-yod"}                   | ${"אָנֹֽכִי"}       | ${"HIRIQ"}  | ${true}
  ${"mixed chars"}                 | ${"rˁִː֣"}          | ${"HIRIQ"}  | ${true}
`("hasVowelName:", ({ description, hebrew, vowelName, result }) => {
  const heb = new Text(hebrew);
  describe(description, () => {
    test(`vowelName to equal ${vowelName}`, () => {
      expect(heb.words[0].hasVowelName(vowelName)).toEqual(result);
    });
  });
});

describe("Implements node", () => {
  const text = new Text("בֶּן־אָדָ֕ם");
  const word = text.words[0];
  test("prev", () => {
    expect(word.prev).toEqual(null);
  });
  test("next", () => {
    expect(word.next?.value?.text).toEqual("אָדָ֕ם");
  });
  test("value", () => {
    expect(word.value?.text).toEqual("בֶּן־");
  });
});

describe.each`
  description      | heb              | isInConstructArray
  ${"with maqqef"} | ${"בֶּן־אָדָ֕ם"} | ${[true, false]}
  ${"now maqqef"}  | ${"בֶּן אָדָ֕ם"} | ${[false, false]}
`("isInConstruct:", ({ description, heb, isInConstructArray }) => {
  const text = new Text(heb);
  test(`${description}`, () => {
    expect(text.words.map((word) => word.isInConstruct)).toEqual(isInConstructArray);
  });
});

describe.each`
  description              | hebrew              | taamim
  ${"one character"}       | ${"הָאָ֖רֶץ"}       | ${["\u{596}"]}
  ${"no characters"}       | ${"וַֽיְהִי־כֵֽן׃"} | ${[]}
  ${"multiple characters"} | ${"מִתָּ֑͏ַ֜חַת"}    | ${["\u{591}", "\u{59C}"]}
  ${"ole veyored"}         | ${"רְשָׁ֫עִ֥ים"}    | ${["\u{5AB}", "\u{5A5}"]}
`("taamim:", ({ description, hebrew, taamim }) => {
  describe(description, () => {
    test(`taamim to equal ${taamim}`, () => {
      const text = new Text(hebrew);
      expect(text.words[0].taamim).toEqual(taamim);
    });
  });
});

describe.each`
  description              | hebrew              | taamimNames
  ${"one character"}       | ${"הָאָ֖רֶץ"}       | ${["TIPEHA"]}
  ${"no characters"}       | ${"וַֽיְהִי־כֵֽן׃"} | ${[]}
  ${"multiple characters"} | ${"רְשָׁ֫עִ֥ים"}    | ${["OLE", "MERKHA"]}
`("taamimNames:", ({ description, hebrew, taamimNames }) => {
  describe(description, () => {
    test(`taamimNames to equal ${taamimNames}`, () => {
      const text = new Text(hebrew);
      expect(text.words[0].taamimNames).toEqual(taamimNames);
    });
  });
});

describe.each`
  description                     | hebrew              | vowelNames
  ${"regular characters"}         | ${"הָאָ֖רֶץ"}       | ${["QAMATS", "QAMATS", "SEGOL"]}
  ${"with sheva"}                 | ${"וַֽיְהִי־כֵֽן׃"} | ${["PATAH", "SHEVA", "HIRIQ"]}
  ${"with shureq"}                | ${"מַדּ֥וּעַ"}      | ${["PATAH", "SHUREQ", "PATAH"]}
  ${"multiple vowels on one syl"} | ${"מִתָּ֑͏ַ֜חַת"}    | ${["HIRIQ", "QAMATS", "PATAH", "PATAH"]}
`("vowelNames:", ({ description, hebrew, vowelNames }) => {
  describe(description, () => {
    test(`vowelNames to equal ${vowelNames}`, () => {
      const text = new Text(hebrew);
      expect(text.words[0].vowelNames).toEqual(vowelNames);
    });
  });
});

describe.each`
  description                     | hebrew              | vowels
  ${"regular characters"}         | ${"הָאָ֖רֶץ"}       | ${["\u{05B8}", "\u{05B8}", "\u{05B6}"]}
  ${"with sheva"}                 | ${"וַֽיְהִי־כֵֽן׃"} | ${["\u{05B7}", "\u{05B0}", "\u{05B4}"]}
  ${"with shureq"}                | ${"מַדּ֥וּעַ"}      | ${["\u{05B7}", "\u{05D5}\u{05BC}", "\u{05B7}"]}
  ${"multiple vowels on one syl"} | ${"מִתָּ֑͏ַ֜חַת"}    | ${["\u{05B4}", "\u{05B8}", "\u{05B7}", "\u{05B7}"]}
`("vowels:", ({ description, hebrew, vowels }) => {
  describe(description, () => {
    test(`vowels to equal ${vowels}`, () => {
      const text = new Text(hebrew);
      expect(text.words[0].vowels).toEqual(vowels);
    });
  });
});

describe.each`
  description                           | heb                               | whiteSpaceBefore    | whiteSpaceAfter
  ${"single word: leading is deleted"}  | ${" מֶלֶךְ"}                      | ${[""]}             | ${[""]}
  ${"single word: trailing is deleted"} | ${"מֶלךְ "}                       | ${[""]}             | ${[""]}
  ${"two words"}                        | ${"מֶלֶךְ יִשְׁרָאֵל"}             | ${["", ""]}         | ${[" ", ""]}
  ${"two words, first w/ maqqef"}       | ${"כָּל־הָעָם"}                   | ${["", ""]}         | ${["", ""]}
  ${"two words, two spaces between"}    | ${"מֶלֶךְ  יִשְׁרָאֵל"}            | ${["", ""]}         | ${["  ", ""]}
  ${"text with two spaces and maqqefs"} | ${"מֶלֶךְ  יִשְׁרָאֵל כָּל־הָעָם"} | ${["", "", "", ""]} | ${["  ", " ", "", ""]}
  ${"text with maqqefs and two spaces"} | ${"כָּל־הָעָם מֶלֶךְ  יִשְׁרָאֵל"} | ${["", "", "", ""]} | ${["", " ", "  ", ""]}
`("whiteSpace:", ({ description, heb, whiteSpaceBefore, whiteSpaceAfter }) => {
  const text = new Text(heb);
  const words = text.words;
  const before = words.map((word) => word.whiteSpaceBefore);
  const after = words.map((word) => word.whiteSpaceAfter);
  describe(`${description}`, () => {
    test("Space Before", () => {
      expect(before).toEqual(whiteSpaceBefore);
    });
    test("Space After", () => {
      expect(after).toEqual(whiteSpaceAfter);
    });
  });
});
