import { Text } from "../src/index";

describe.each`
  description                                       | heb                               | whiteSpaceBefore    | whiteSpaceAfter
  ${"whiteSpace: single word: leading is deleted"}  | ${" מֶלֶךְ"}                      | ${[""]}             | ${[""]}
  ${"whiteSpace: single word: trailing is deleted"} | ${"מֶלךְ "}                       | ${[""]}             | ${[""]}
  ${"whiteSpace: two words"}                        | ${"מֶלֶךְ יִשְׁרָאֵל"}             | ${["", ""]}         | ${[" ", ""]}
  ${"whiteSpace: two words, first w/ maqqef"}       | ${"כָּל־הָעָם"}                   | ${["", ""]}         | ${["", ""]}
  ${"whiteSpace: two words, two spaces between"}    | ${"מֶלֶךְ  יִשְׁרָאֵל"}            | ${["", ""]}         | ${["  ", ""]}
  ${"whiteSpace: text with two spaces and maqqefs"} | ${"מֶלֶךְ  יִשְׁרָאֵל כָּל־הָעָם"} | ${["", "", "", ""]} | ${["  ", " ", "", ""]}
  ${"whiteSpace: text with maqqefs and two spaces"} | ${"כָּל־הָעָם מֶלֶךְ  יִשְׁרָאֵל"} | ${["", "", "", ""]} | ${["", " ", "  ", ""]}
`("$description", ({ heb, whiteSpaceBefore, whiteSpaceAfter }) => {
  const text = new Text(heb);
  const words = text.words;
  const before = words.map((word) => word.whiteSpaceBefore);
  const after = words.map((word) => word.whiteSpaceAfter);
  test("Space Before", () => {
    expect(before).toEqual(whiteSpaceBefore);
  });
  test("Space After", () => {
    expect(after).toEqual(whiteSpaceAfter);
  });
});

describe.each`
  description                | name          | isDivineName
  ${"isDivineName: Yehwah"}  | ${"יְהוָה"}   | ${true}
  ${"isDivineName: Yehowah"} | ${"יְהֹוָ֨ה"} | ${true}
  ${"isDivineName: Yehowih"} | ${"יֱהֹוִ֡ה"} | ${true}
  ${"isDivineName: Yehwih"}  | ${"יֱהוִה֙"}  | ${true}
  ${"isDivineName: Yǝhowih"} | ${"יְהֹוִה֙"} | ${true}
  ${"isDivineName: Yǝhwih"}  | ${"יְהוִֽה"}  | ${true}
`("$description", ({ name, isDivineName }) => {
  const text = new Text(name);
  const word = text.words[0];
  const isDivine = word.isDivineName;
  test(`is it the Divine Name: ${isDivineName}`, () => {
    expect(isDivine).toEqual(isDivineName);
  });
});
