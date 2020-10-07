import { Text } from "../src/index";

describe.each`
  description                     | original     | sylArr                 | isMaterArr
  ${"hiriq-yod, one syllable"}    | ${"פִּי"}    | ${["פִּי"]}            | ${[false, true]}
  ${"hiriq-yod, two syllables"}   | ${"קָטִיל"}  | ${["קָ", "טִיל"]}      | ${[false, false, true, false]}
  ${"hiriq-yod, three syllables"} | ${"מַשִיחַ"} | ${["מַ", "שִי", "חַ"]} | ${[false, false, true, false]}
  ${"holem-waw, one syllable"}    | ${"בֹּו"}    | ${["בֹּו"]}            | ${[false, true]}
  ${"holem-waw, three syllable"}  | ${"קֹולְךָ"} | ${["קֹו", "לְ", "ךָ"]} | ${[false, true, false, false]}
  ${"tsere-yod, one syllable"}    | ${"עֵיץ"}    | ${["עֵיץ"]}            | ${[false, true, false]}
  ${"tsere-yod, two syllable"}    | ${"בֵּיצָה"} | ${["בֵּי", "צָה"]}     | ${[false, true, false, true]}
  ${"qamets-he, one syllable"}    | ${"בָּה"}    | ${["בָּה"]}            | ${[false, true]}
  ${"3fs suffix, one syllable"}   | ${"בָּהּ"}   | ${["בָּהּ"]}           | ${[false, false]}
`("$description", ({ original, sylArr, isMaterArr }) => {
  const heb = new Text(original);
  const sylText = heb.syllables.map((syllable) => syllable.text);
  const isMater = heb.clusters.map((cluster) => cluster.isMater);
  test(`syllable text to equal ${sylArr}`, () => {
    expect(sylText).toEqual(sylArr);
  });
  test(`isMater array to equal ${isMaterArr}`, () => {
    expect(isMater).toEqual(isMaterArr);
  });
});
