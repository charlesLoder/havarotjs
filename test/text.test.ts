import { Text } from "../src/index";

describe.each`
  description                                | word                                                   | hasQamQat | hasQamets
  ${"text: simple nominal pattern in array"} | ${"חָפְנִי֙"}                                          | ${true}   | ${false}
  ${"text: simple verbal pattern in array"}  | ${"וַיָּ֥קָם"}                                         | ${true}   | ${true}
  ${"text: qamets follwed by hatef-qamets"}  | ${"\u{5D0}\u{5B8}\u{5D4}\u{5B3}\u{5DC}\u{5B4}\u{5D9}"} | ${true}   | ${false}
  ${"text: qamets qatan and qamets"}         | ${"בָּשְׁתָּם"}                                         | ${true}   | ${true}
`("$description", ({ word, hasQamQat, hasQamets }) => {
  const text = new Text(word);
  const sanitized = text.text;
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
  description                                                           | word          | holemWaw | wawHolem
  ${"text: const + holem + waw remains the same"}                       | ${"שָׁלֹום"}  | ${true}  | ${false}
  ${"text: const + waw + holem is swapped"}                             | ${"שָׁלוֹם"}  | ${true}  | ${false}
  ${"text: const + waw + holem is swapped, accent present"}             | ${"שָׁל֑וֹם"} | ${true}  | ${false}
  ${"text: consonatal waw with holem remains the same"}                 | ${"עֲוֹן"}    | ${false} | ${true}
  ${"text: consonatal waw with holem remains the same, accent present"} | ${"הֶעָוֹ֖ן"} | ${false} | ${true}
`("$description", ({ word, holemWaw, wawHolem }) => {
  const text = new Text(word);
  const sanitized = text.text;
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
  description                                 | hebrew                | errorMssg
  ${"text: Text without niqqud, throw error"} | ${"בראשית ברא אלהים"} | ${"Text must contain niqqud"}
`("$description", ({ hebrew, errorMssg }) => {
  test("Should throw error", () => {
    expect(() => new Text(hebrew)).toThrow(errorMssg);
  });
});

describe.each`
  description             | hebrew
  ${"text: Regular Text"} | ${"בְּרֵאשִׁית בָּרָא אֱלֹהִים"}
  ${"text: Only Mater"}   | ${"קוּם"}
`("$description", ({ hebrew }) => {
  test("Should NOT throw error", () => {
    expect(() => new Text(hebrew)).not.toThrow();
  });
});
