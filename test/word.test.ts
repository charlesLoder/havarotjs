import { Text } from "../src/index";

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
  description      | heb              | isInConstructArray
  ${"with maqqef"} | ${"בֶּן־אָדָ֕ם"} | ${[true, false]}
  ${"now maqqef"}  | ${"בֶּן אָדָ֕ם"} | ${[false, false]}
`("isInConstruct:", ({ description, heb, isInConstructArray }) => {
  const text = new Text(heb);
  test(`${description}`, () => {
    expect(text.words.map((word) => word.isInConstruct)).toEqual(isInConstructArray);
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
