import { Text } from "../src/index";

describe.each`
  description                                                     | original           | sylArr                               | isMaterArr
  ${"hiriq-yod, one syllable"}                                    | ${"פִּי"}          | ${["פִּי"]}                          | ${[false, true]}
  ${"hiriq-yod, two syllables"}                                   | ${"קָטִיל"}        | ${["קָ", "טִיל"]}                    | ${[false, false, true, false]}
  ${"hiriq-yod, three syllables"}                                 | ${"מַשִיחַ"}       | ${["מַ", "שִי", "חַ"]}               | ${[false, false, true, false]}
  ${"tsere-yod, one syllable"}                                    | ${"עֵיץ"}          | ${["עֵיץ"]}                          | ${[false, true, false]}
  ${"tsere-yod, two syllables"}                                   | ${"בֵּיצָה"}       | ${["בֵּי", "צָה"]}                   | ${[false, true, false, true]}
  ${"tsere-yod, two syllables"}                                   | ${"בֵּיצָה"}       | ${["בֵּי", "צָה"]}                   | ${[false, true, false, true]}
  ${"seghol yod, four syllables"}                                 | ${"אֱלֹהֶ֑֔יךָ"}   | ${["אֱ", "לֹ", "הֶ֑֔י", "ךָ"]}       | ${[false, false, false, true, false]}
  ${"holem-waw, one syllable"}                                    | ${"בֹּו"}          | ${["בֹּו"]}                          | ${[false, true]}
  ${"holem-waw, one syllable, closed"}                            | ${"י֔וֹם"}         | ${["יֹ֔ום"]}                         | ${[false, true, false]}
  ${"holem-waw, two syllables, holem final"}                      | ${"כְּמוֹ"}        | ${["כְּ", "מֹו"]}                    | ${[false, false, true]}
  ${"holem-waw, two syllables, two holems"}                       | ${"חוֹרֹן"}        | ${["חֹו", "רֹן"]}                    | ${[false, true, false, false]}
  ${"holem-waw, three syllables"}                                 | ${"קֹולְךָ"}       | ${["קֹו", "לְ", "ךָ"]}               | ${[false, true, false, false]}
  ${"holem-waw, and waw with holem"}                              | ${"עֲוֹנוֹתֵינוּ"} | ${["עֲ", "וֹ", "נֹו", "תֵי", "נוּ"]} | ${[false, false, false, true, false, true, false, false]}
  ${"holem-waw, and final aleph"}                                 | ${"ס֣וֹא"}         | ${["סֹ֣וא"]}                         | ${[false, true, false]}
  ${"two holem-waws in same word"}                                | ${"אוֹחָיוֹן"}     | ${["אֹו", "חָ", "יֹון"]}             | ${[false, true, false, false, true, false]}
  ${"qamets-he, one syllable"}                                    | ${"בָּה"}          | ${["בָּה"]}                          | ${[false, true]}
  ${"qamets-he, two syllables"}                                   | ${"יָפָה"}         | ${["יָ", "פָה"]}                     | ${[false, false, true]}
  ${"qamets-he follwed by shureq (not mater)"}                    | ${"אֵלִיָּ֨הוּ"}   | ${["אֵ", "לִ", "יָּ֨", "הוּ"]}       | ${[false, false, false, false, false]}
  ${"seghol-he, two syllables"}                                   | ${"יָפֶה"}         | ${["יָ", "פֶה"]}                     | ${[false, false, true]}
  ${"3fs suffix, one syllable"}                                   | ${"בָּהּ"}         | ${["בָּהּ"]}                         | ${[false, false]}
  ${"3ms plural suffix, three syllable"}                          | ${"תֹּורֹתָיו"}    | ${["תֹּו", "רֹ", "תָיו"]}            | ${[false, true, false, false, false, false]}
  ${"quiesced aleph, two syllables"}                              | ${"רִאשׁ֔וֹן"}     | ${["רִא", "שֹׁ֔ון"]}                 | ${[false, false, false, true, false]}
  ${"quiesced aleph, two syllables w/ closed syl (non biblical)"} | ${"זַאנְבִיל"}     | ${["זַאנְ", "בִיל"]}                 | ${[false, false, false, false, true, false]}
`("isMater:", ({ description, original, sylArr, isMaterArr }) => {
  const heb = new Text(original);
  const sylText = heb.syllables.map((syllable) => syllable.text);
  const isMater = heb.clusters.map((cluster) => cluster.isMater);
  describe(description, () => {
    test(`syllable text to equal ${sylArr}`, () => {
      expect(sylText).toEqual(sylArr);
    });
    test(`isMater array to equal ${isMaterArr}`, () => {
      expect(isMater).toEqual(isMaterArr);
    });
  });
});

describe.each`
  description                                         | hebrew              | clusterNum | hasMetheg
  ${"word with single metheg"}                        | ${"הַֽ֭יְחָבְרְךָ"} | ${0}       | ${true}
  ${"word with single silluq"}                        | ${"נַפְשִֽׁי׃"}     | ${2}       | ${false}
  ${"word with metheg & silluq"}                      | ${"הָֽאֲדָמָֽה׃"}   | ${0}       | ${true}
  ${"word with metheg & silluq"}                      | ${"הָֽאֲדָמָֽה׃"}   | ${3}       | ${false}
  ${"words with metheg & silluq, joined with maqqef"} | ${"וַֽיְהִי־כֵֽן׃"} | ${0}       | ${true}
  ${"words with metheg & silluq, joined with maqqef"} | ${"וַֽיְהִי־כֵֽן׃"} | ${4}       | ${false}
`("hasMetheg:", ({ description, hebrew, clusterNum, hasMetheg }) => {
  const heb = new Text(hebrew);
  const cluster = heb.clusters[clusterNum];
  const metheg = cluster.hasMetheg;
  describe(description, () => {
    test(`hasMetheg to equal ${hasMetheg}`, () => {
      expect(metheg).toEqual(hasMetheg);
    });
  });
});

describe.each`
  description                | hebrew              | clusterNum | vowel
  ${"cluster with patach"}   | ${"הַֽ֭יְחָבְרְךָ"} | ${0}       | ${"\u{05B7}"}
  ${"cluster with shewa"}    | ${"הַֽ֭יְחָבְרְךָ"} | ${3}       | ${null}
`("vowel:", ({ description, hebrew, clusterNum, vowel }) => {
  const heb = new Text(hebrew);
  const cluster = heb.clusters[clusterNum];
  const clusterVowel = cluster.vowel;
  describe(description, () => {
    test(`vowel to equal ${vowel}`, () => {
      expect(clusterVowel).toEqual(vowel);
    });
  });
});
