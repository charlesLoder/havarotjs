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

describe.each`
  description                                                     | word          | holemWaw | wawHolem
  ${"const + holem + waw remains the same"}                       | ${"שָׁלֹום"}  | ${true}  | ${false}
  ${"const + waw + holem is swapped"}                             | ${"שָׁלוֹם"}  | ${true}  | ${false}
  ${"const + waw + holem is swapped, accent present"}             | ${"שָׁל֑וֹם"} | ${true}  | ${false}
  ${"consonatal waw with holem remains the same"}                 | ${"עֲוֹן"}    | ${false} | ${true}
  ${"consonatal waw with holem remains the same, accent present"} | ${"הֶעָוֹ֖ן"} | ${false} | ${true}
`("$description", ({ word, holemWaw, wawHolem }) => {
  let text = new Text(word);
  let sanitized = text.text;
  const holemWawX = /\u{05B9}\u{05D5}/u;
  const wawHolemX = /\u{05D5}\u{05B9}/u;
  test(`Holem Precedes Waw ${holemWaw}`, () => {
    expect(holemWawX.test(sanitized)).toEqual(holemWaw);
  });

  test(`Waw Precedes Holem ${wawHolem}`, () => {
    expect(wawHolemX.test(sanitized)).toEqual(wawHolem);
  });
});

describe.each`
  description        | name          | isDivineName
  ${"Form: Yehwah"}  | ${"יְהוָה"}   | ${true}
  ${"Form: Yehowah"} | ${"יְהֹוָ֨ה"} | ${true}
  ${"Form: Yehowih"} | ${"יֱהֹוִ֡ה"} | ${true}
  ${"Form: Yehwih"}  | ${"יֱהוִה֙"}  | ${true}
  ${"Form: Yǝhowih"} | ${"יְהֹוִה֙"} | ${true}
  ${"Form: Yǝhwih"}  | ${"יְהוִֽה"}  | ${true}
`("$description", ({ name, isDivineName, sanitized }) => {
  let text = new Text(name);
  let word = text.words[0];
  let wordText = word.text;
  let isDivine = word.isDivineName;
  test(`is it the Divine Name: ${isDivineName}`, () => {
    expect(isDivine).toEqual(isDivineName);
  });
});
