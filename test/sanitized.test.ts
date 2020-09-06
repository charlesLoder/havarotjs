import { Text } from "../src/index";

describe.each`
  description                          | word                                                   | hasQamQat | hasQamets
  ${"simple nominal pattern in array"} | ${"חָפְנִי֙"}                                          | ${true}   | ${false}
  ${"simple verbal pattern in array"}  | ${"וַיָּ֥קָם"}                                         | ${true}   | ${true}
  ${"qamets follwed by hatef-qamets"}  | ${"\u{5D0}\u{5B8}\u{5D4}\u{5B3}\u{5DC}\u{5B4}\u{5D9}"} | ${true}   | ${false}
  ${"qamets qatan and qamets"}         | ${"בָּשְׁתָּם"}                                         | ${true}   | ${true}
`("$description", ({ word, hasQamQat, hasQamets }) => {
  let text = new Text(word);
  let sanitized = text.text;
  const qQRegx = /\u{05C7}/u;
  const qamRegx = /\u{05B8}/u;
  test(`Has Qamets Qatan should equal ${hasQamQat}`, () => {
    expect(qQRegx.test(sanitized)).toEqual(hasQamQat);
  });

  test(`Has Qamets should equal ${hasQamets}`, () => {
    expect(qamRegx.test(sanitized)).toEqual(hasQamets);
  });
});
