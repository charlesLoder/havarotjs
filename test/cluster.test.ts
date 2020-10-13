import { Text } from "../src/index";

describe.each`
  description                                     | original        | sylArr                    | isMaterArr
  ${"isMater: hiriq-yod, one syllable"}           | ${"פִּי"}       | ${["פִּי"]}               | ${[false, true]}
  ${"isMater: hiriq-yod, two syllables"}          | ${"קָטִיל"}     | ${["קָ", "טִיל"]}         | ${[false, false, true, false]}
  ${"isMater: hiriq-yod, three syllables"}        | ${"מַשִיחַ"}    | ${["מַ", "שִי", "חַ"]}    | ${[false, false, true, false]}
  ${"isMater: holem-waw, one syllable"}           | ${"בֹּו"}       | ${["בֹּו"]}               | ${[false, true]}
  ${"isMater: holem-waw, three syllable"}         | ${"קֹולְךָ"}    | ${["קֹו", "לְ", "ךָ"]}    | ${[false, true, false, false]}
  ${"isMater: tsere-yod, one syllable"}           | ${"עֵיץ"}       | ${["עֵיץ"]}               | ${[false, true, false]}
  ${"isMater: tsere-yod, two syllable"}           | ${"בֵּיצָה"}    | ${["בֵּי", "צָה"]}        | ${[false, true, false, true]}
  ${"isMater: qamets-he, one syllable"}           | ${"בָּה"}       | ${["בָּה"]}               | ${[false, true]}
  ${"isMater: 3fs suffix, one syllable"}          | ${"בָּהּ"}      | ${["בָּהּ"]}              | ${[false, false]}
  ${"isMater: 3ms plural suffix, three syllable"} | ${"תֹּורֹתָיו"} | ${["תֹּו", "רֹ", "תָיו"]} | ${[false, true, false, false, false, false]}
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
