import { Text } from "../src/index";
import { Cluster } from "../src/cluster";

describe.each`
  description                                        | hebrew              | clusterNum | hasMeteg
  ${"word with single meteg"}                        | ${"הַֽ֭יְחָבְרְךָ"} | ${0}       | ${true}
  ${"word with single silluq"}                       | ${"נַפְשִֽׁי׃"}     | ${2}       | ${false}
  ${"word with meteg & silluq"}                      | ${"הָֽאֲדָמָֽה׃"}   | ${0}       | ${true}
  ${"word with meteg & silluq"}                      | ${"הָֽאֲדָמָֽה׃"}   | ${3}       | ${false}
  ${"words with meteg & silluq, joined with maqqef"} | ${"וַֽיְהִי־כֵֽן׃"} | ${0}       | ${true}
  ${"words with meteg & silluq, joined with maqqef"} | ${"וַֽיְהִי־כֵֽן׃"} | ${5}       | ${false}
`("hasMeteg:", ({ description, hebrew, clusterNum, hasMeteg }) => {
  const heb = new Text(hebrew);
  const cluster = heb.clusters[clusterNum];
  const meteg = cluster.hasMeteg;
  describe(description, () => {
    test(`hasMeteg to equal ${hasMeteg}`, () => {
      expect(meteg).toEqual(hasMeteg);
    });
  });
});

describe.each`
  description                                        | hebrew              | clusterNum | hasSilluq
  ${"word with single meteg"}                        | ${"הַֽ֭יְחָבְרְךָ"} | ${0}       | ${false}
  ${"word with single silluq"}                       | ${"נַפְשִֽׁי׃"}     | ${2}       | ${true}
  ${"word with meteg & silluq"}                      | ${"הָֽאֲדָמָֽה׃"}   | ${0}       | ${false}
  ${"word with meteg & silluq"}                      | ${"הָֽאֲדָמָֽה׃"}   | ${3}       | ${true}
  ${"words with meteg & silluq, joined with maqqef"} | ${"וַֽיְהִי־כֵֽן׃"} | ${0}       | ${false}
  ${"words with meteg & silluq, joined with maqqef"} | ${"וַֽיְהִי־כֵֽן׃"} | ${5}       | ${true}
`("hasSilluq:", ({ description, hebrew, clusterNum, hasSilluq }) => {
  const heb = new Text(hebrew);
  const cluster = heb.clusters[clusterNum];
  const silluq = cluster.hasSilluq;
  describe(description, () => {
    test(`hasSilluq to equal ${hasSilluq}`, () => {
      expect(silluq).toEqual(hasSilluq);
    });
  });
});

describe.each`
  description                | hebrew              | clusterNum | vowelName   | result
  ${"cluster with patah"}    | ${"הַֽ֭יְחָבְרְךָ"} | ${0}       | ${"PATAH"}  | ${true}
  ${"cluster with qamets"}   | ${"הַֽ֭יְחָבְרְךָ"} | ${0}       | ${"QAMATS"} | ${false}
  ${"cluster with no vowel"} | ${"י֔וֹם"}          | ${2}       | ${"HOLAM"}  | ${false}
`("hasVowelName:", ({ description, hebrew, clusterNum, vowelName, result }) => {
  const heb = new Text(hebrew);
  const cluster = heb.clusters[clusterNum];
  const clusterHasVowelName = cluster.hasVowelName(vowelName);
  describe(description, () => {
    test(`Should cluster have ${vowelName}? ${result}`, () => {
      expect(clusterHasVowelName).toEqual(result);
    });
  });
});

describe.each`
  description                                                     | original           | sylArr                               | isMaterArr
  ${"hiriq-yod, one syllable"}                                    | ${"פִּי"}          | ${["פִּי"]}                          | ${[false, true]}
  ${"hiriq-yod, two syllables"}                                   | ${"קָטִיל"}        | ${["קָ", "טִיל"]}                    | ${[false, false, true, false]}
  ${"hiriq-yod, three syllables"}                                 | ${"מַשִיחַ"}       | ${["מַ", "שִי", "חַ"]}               | ${[false, false, true, false]}
  ${"tsere-yod, one syllable"}                                    | ${"עֵיץ"}          | ${["עֵיץ"]}                          | ${[false, true, false]}
  ${"tsere-yod, two syllables"}                                   | ${"בֵּיצָה"}       | ${["בֵּי", "צָה"]}                   | ${[false, true, false, true]}
  ${"tsere-yod, two syllables"}                                   | ${"בֵּיצָה"}       | ${["בֵּי", "צָה"]}                   | ${[false, true, false, true]}
  ${"segol yod, four syllables"}                                  | ${"אֱלֹהֶ֑֔יךָ"}   | ${["אֱ", "לֹ", "הֶ֑֔י", "ךָ"]}       | ${[false, false, false, true, false]}
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
  ${"segol-he, two syllables"}                                    | ${"יָפֶה"}         | ${["יָ", "פֶה"]}                     | ${[false, false, true]}
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
  description    | hebrew         | clusterNum | isPunctuation
  ${"meteg"}     | ${"הָאָֽרֶץ׃"} | ${1}       | ${false}
  ${"sof pasuq"} | ${"הָאָֽרֶץ׃"} | ${3}       | ${true}
`("isPunctuation:", ({ description, hebrew, clusterNum, isPunctuation }) => {
  const heb = new Text(hebrew);
  const cluster = heb.clusters[clusterNum];
  const punc = cluster.isPunctuation;
  describe(description, () => {
    test(`isPunctuation to equal ${isPunctuation}`, () => {
      expect(punc).toEqual(punc);
    });
  });
});

describe.each`
  description                                 | hebrew         | clusterNum | isShureq
  ${"mid-word shureq"}                        | ${"קוּם"}      | ${1}       | ${true}
  ${"mid-word vav dagesh with vowel"}         | ${"שִׁוֵּק"}   | ${1}       | ${false}
  ${"mid-word vav dagesh with vowel before"}  | ${"שִׁוּוּק"}  | ${1}       | ${false}
  ${"mid-word shureq with vav dagesh before"} | ${"שִׁוּוּק"}  | ${2}       | ${true}
  ${"mid-word vav dagesh with sheva"}         | ${"מְצַוְּךָ"} | ${2}       | ${false}
  ${"final vav dagesh with vowel before"}     | ${"גֵּוּ"}     | ${1}       | ${false}
`("isShureq:", ({ description, hebrew, clusterNum, isShureq }) => {
  const heb = new Text(hebrew);
  const cluster = heb.clusters[clusterNum];
  const meteg = cluster.isShureq;
  describe(description, () => {
    test(`isShureq to equal ${isShureq}`, () => {
      expect(meteg).toEqual(isShureq);
    });
  });
});

describe.each`
  description    | hebrew         | clusterNum | isTaam
  ${"meteg"}     | ${"הָאָֽרֶץ׃"} | ${1}       | ${false}
  ${"sof pasuq"} | ${"הָאָֽרֶץ׃"} | ${3}       | ${true}
`("isTaam:", ({ description, hebrew, clusterNum, isTaam }) => {
  const heb = new Text(hebrew);
  const cluster = heb.clusters[clusterNum];
  const punc = cluster.isTaam;
  describe(description, () => {
    test(`isTaam to equal ${isTaam}`, () => {
      expect(punc).toEqual(punc);
    });
  });
});

describe("syllable:", () => {
  test("if no syllable, null", () => {
    const cluster = new Cluster("דָּ");
    expect(cluster.syllable).toEqual(null);
  });

  test("cluster text same as syllable text", () => {
    const text = new Text("דָּבָר");
    const first = text.clusters[0];
    expect(first?.syllable?.text).toEqual(first.text);
  });

  test("cluster text not the same as syllable text", () => {
    const text = new Text("דָּבָר");
    const last = text.clusters[text.clusters.length - 1];
    expect(last?.syllable?.text).not.toEqual("ר");
    expect(last?.syllable?.text).toEqual("בָר");
  });
});

describe.each`
  description                | hebrew              | clusterNum | vowel
  ${"cluster with patah"}    | ${"הַֽ֭יְחָבְרְךָ"} | ${0}       | ${"\u{05B7}"}
  ${"cluster with sheva"}    | ${"הַֽ֭יְחָבְרְךָ"} | ${3}       | ${null}
  ${"cluster with no vowel"} | ${"י֔וֹם"}          | ${2}       | ${null}
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

describe.each`
  description                | hebrew              | clusterNum | vowelName
  ${"cluster with patah"}    | ${"הַֽ֭יְחָבְרְךָ"} | ${0}       | ${"PATAH"}
  ${"cluster with qamets"}   | ${"הַֽ֭יְחָבְרְךָ"} | ${2}       | ${"QAMATS"}
  ${"cluster with sheva"}    | ${"הַֽ֭יְחָבְרְךָ"} | ${3}       | ${null}
  ${"cluster with no vowel"} | ${"י֔וֹם"}          | ${2}       | ${null}
`("vowelName:", ({ description, hebrew, clusterNum, vowelName }) => {
  const heb = new Text(hebrew);
  const cluster = heb.clusters[clusterNum];
  const clusterVowelName = cluster.vowelName;
  describe(description, () => {
    test(`vowel name to equal ${vowelName}`, () => {
      expect(clusterVowelName).toEqual(vowelName);
    });
  });
});
