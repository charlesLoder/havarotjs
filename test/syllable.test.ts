import { Cluster } from "../src/cluster";
import { Text } from "../src/index";
import { Syllable } from "../src/syllable";

describe.each`
  description                                          | hebrew         | syllableNum | codaWithGemination
  ${"open syllable followed by gemination"}            | ${"מַדּוּעַ"}  | ${0}        | ${"דּ"}
  ${"open syllable followed by no gemination"}         | ${"מֶלֶךְ"}    | ${0}        | ${""}
  ${"closed syllable followed by dagesh qal"}          | ${"מַסְגֵּר"}  | ${0}        | ${"סְ"}
  ${"open syllable with sheva followed by dagesh qal"} | ${"שְׁתַּיִם"} | ${0}        | ${""}
`("codaWithGemination:", ({ description, hebrew, syllableNum, codaWithGemination }) => {
  const heb = new Text(hebrew);
  const syllable = heb.syllables[syllableNum];
  const syllableCodaWithGemination = syllable.codaWithGemination;
  describe(description, () => {
    test(`codaWithGemination to equal ${codaWithGemination}`, () => {
      expect(syllableCodaWithGemination).toEqual(codaWithGemination);
    });
  });
});

describe.each`
  description                                    | hebrew              | syllableNum | vowelName   | result
  ${"syllable with patah"}                       | ${"הַֽ֭יְחָבְרְךָ"} | ${0}        | ${"PATAH"}  | ${true}
  ${"syllable with sheva"}                       | ${"הַֽ֭יְחָבְרְךָ"} | ${1}        | ${"SHEVA"}  | ${true}
  ${"syllable with silent sheva"}                | ${"הַֽ֭יְחָבְרְךָ"} | ${2}        | ${"SHEVA"}  | ${false}
  ${"syllable with qamats"}                      | ${"הַֽ֭יְחָבְרְךָ"} | ${2}        | ${"QAMATS"} | ${true}
  ${"syllable with shureq"}                      | ${"תִגְּע֖וּ"}      | ${2}        | ${"SHUREQ"} | ${true}
  ${"syllable with vav and dagesh (not shureq)"} | ${"הַוּֽוֹת׃"}      | ${1}        | ${"SHUREQ"} | ${false}
  ${"syllable with tsere-yod"}                   | ${"קָדְשֵׁ֧י"}      | ${1}        | ${"TSERE"}  | ${true}
  ${"syllable with holam-vav"}                   | ${"בַּיּ֣וֹם"}      | ${1}        | ${"HOLAM"}  | ${true}
  ${"syllable with hiriq-yod"}                   | ${"אָנֹֽכִי"}       | ${2}        | ${"HIRIQ"}  | ${true}
`("hasVowelName:", ({ description, hebrew, syllableNum, vowelName, result }) => {
  const heb = new Text(hebrew);
  const syllable = heb.syllables[syllableNum];
  const syllableVowelName = syllable.hasVowelName(vowelName);
  describe(description, () => {
    test(`vowelName to equal ${vowelName}`, () => {
      expect(syllableVowelName).toEqual(result);
    });
  });
});

describe.each`
  description          | hebrew              | syllableNum | vowelName
  ${"Incorrect value"} | ${"הַֽ֭יְחָבְרְךָ"} | ${0}        | ${"TEST"}
`("hasVowelName, error:", ({ hebrew, syllableNum, vowelName }) => {
  const heb = new Text(hebrew);
  const syllable = heb.syllables[syllableNum];
  test(`vowelName${vowelName} should throw error`, () => {
    expect(() => syllable.hasVowelName(vowelName)).toThrowError();
  });
});

describe.each`
  description               | hebrew                 | syllableNum | nextExists | nextText
  ${"has next"}             | ${"הַֽ֭יְחָבְרְךָ"}    | ${0}        | ${true}    | ${"יְ"}
  ${"does not have next"}   | ${"כִּסֵּ֣א"}          | ${1}        | ${false}   | ${null}
  ${"does not cross words"} | ${"כִּסֵּ֣א הַוּ֑וֹת"} | ${1}        | ${false}   | ${null}
`("implements Node:", ({ description, hebrew, syllableNum, nextExists, nextText }) => {
  const heb = new Text(hebrew);
  const syllable = heb.syllables[syllableNum];
  const nextSyllable = syllable.next;
  describe(description, () => {
    test(`${description}`, () => {
      expect(nextSyllable).toBeDefined();
      if (nextExists && nextSyllable && nextSyllable instanceof Syllable) {
        expect(nextSyllable.text).toEqual(nextText);
      }
    });
  });
});

describe.each`
  description                                    | hebrew             | syllableNum | onset   | nucleus               | coda
  ${"closed syllable"}                           | ${"יָ֥ם"}          | ${0}        | ${"י"}  | ${"\u{05B8}\u{05A5}"} | ${"ם"}
  ${"open syllable"}                             | ${"מַדּוּעַ"}      | ${0}        | ${"מ"}  | ${"\u{05B7}"}         | ${""}
  ${"syllable with shureq"}                      | ${"מַדּוּעַ"}      | ${1}        | ${"דּ"} | ${"וּ"}               | ${""}
  ${"syllable with shureq and meteg"}            | ${"רֽוּחַ"}        | ${0}        | ${"רֽ"} | ${"וּ"}               | ${""}
  ${"syllable with furtive patah"}               | ${"מַדּוּעַ"}      | ${2}        | ${""}   | ${"\u{05B7}"}         | ${"ע"}
  ${"syllable with furtive patah and sof pasuq"} | ${"מַדּוּעַ׃"}     | ${2}        | ${""}   | ${"\u{05B7}"}         | ${"ע׃"}
  ${"word-initial shureq"}                       | ${"וּמֶלֶךְ"}      | ${0}        | ${""}   | ${"וּ"}               | ${""}
  ${"onset cluster (not supported)"}             | ${"שְׁתַּיִם"}     | ${0}        | ${"שׁ"} | ${"\u{05B0}"}         | ${""}
  ${"Jerusalem w/ patah penultimate syllable"}   | ${"יְרוּשָׁלִַ֗ם"} | ${3}        | ${"ל"}  | ${"\u{05B7}\u{0597}"} | ${""}
  ${"Jerusalem w/ patah final syllable"}         | ${"יְרוּשָׁלִַ֗ם"} | ${4}        | ${""}   | ${"\u{05B4}"}         | ${"ם"}
`("structure:", ({ description, hebrew, syllableNum, onset, nucleus, coda }) => {
  const heb = new Text(hebrew);
  const syllable = heb.syllables[syllableNum];
  const [syllableOnset, syllableNucleus, syllableCoda] = syllable.structure();
  describe(description, () => {
    test(`onset to equal ${onset}`, () => {
      expect(syllableOnset).toEqual(onset);
    });
    test(`nucleus to equal ${nucleus}`, () => {
      expect(syllableNucleus).toEqual(nucleus);
    });
    test(`coda to equal ${coda}`, () => {
      expect(syllableCoda).toEqual(coda);
    });
  });
});

describe("structure cache", () => {
  const str = "סַפִּ֖יר";
  test("without gemination", () => {
    const heb = new Text(str);
    const syllable = heb.syllables[0];
    // first call to structure() will cache the result
    // but use the opposite of what is being tested
    syllable.structure(true);
    const [syllableOnset, syllableNucleus, syllableCoda] = ["ס", "ַ", ""];
    expect(syllable.structure()).toEqual([syllableOnset, syllableNucleus, syllableCoda]);
  });

  test("with gemination", () => {
    const heb = new Text(str);
    const syllable = heb.syllables[0];
    // first call to structure() will cache the result
    // but use the opposite of what is being tested
    syllable.structure();
    const [syllableOnset, syllableNucleus, syllableCoda] = ["ס", "ַ", "פּ"];
    expect(syllable.structure(true)).toEqual([syllableOnset, syllableNucleus, syllableCoda]);
  });
});

describe.each`
  description                     | hebrew              | syllableNum | vowel                 | allowNoNiqqud
  ${"syllable with patah"}        | ${"הַֽ֭יְחָבְרְךָ"} | ${0}        | ${"\u{05B7}"}         | ${false}
  ${"syllable with sheva"}        | ${"הַֽ֭יְחָבְרְךָ"} | ${1}        | ${"\u{05B0}"}         | ${false}
  ${"syllable with silent sheva"} | ${"הַֽ֭יְחָבְרְךָ"} | ${2}        | ${"\u{05B8}"}         | ${false}
  ${"syllable with none"}         | ${"test"}           | ${0}        | ${null}               | ${true}
  ${"syllable with shureq"}       | ${"תִגְּע֖וּ"}      | ${2}        | ${"\u{05D5}\u{05BC}"} | ${false}
  ${"syllable with tsere-yod"}    | ${"קָדְשֵׁ֧י"}      | ${1}        | ${"\u{05B5}"}         | ${true}
  ${"syllable with holam-vav"}    | ${"בַּיּ֣וֹם"}      | ${1}        | ${"\u{05B9}"}         | ${true}
  ${"syllable with hiriq-yod"}    | ${"אָנֹֽכִי"}       | ${2}        | ${"\u{05B4}"}         | ${true}
`("vowel:", ({ description, hebrew, syllableNum, vowel, allowNoNiqqud }) => {
  // normally don't use `allowNoNiqqud` in testing, but needed to get `null`
  const heb = new Text(hebrew, { allowNoNiqqud });
  const syllable = heb.syllables[syllableNum];
  const syllableVowel = syllable.vowel;
  describe(description, () => {
    test(`vowel to equal ${vowel}`, () => {
      expect(syllableVowel).toEqual(vowel);
    });
  });
});

describe.each`
  description                     | hebrew              | syllableNum | vowelName   | allowNoNiqqud
  ${"syllable with patah"}        | ${"הַֽ֭יְחָבְרְךָ"} | ${0}        | ${"PATAH"}  | ${false}
  ${"syllable with sheva"}        | ${"הַֽ֭יְחָבְרְךָ"} | ${1}        | ${"SHEVA"}  | ${false}
  ${"syllable with silent sheva"} | ${"הַֽ֭יְחָבְרְךָ"} | ${2}        | ${"QAMATS"} | ${false}
  ${"syllable with none"}         | ${"test"}           | ${0}        | ${null}     | ${true}
  ${"syllable with shureq"}       | ${"תִגְּע֖וּ"}      | ${2}        | ${"SHUREQ"} | ${false}
  ${"syllable with tsere-yod"}    | ${"קָדְשֵׁ֧י"}      | ${1}        | ${"TSERE"}  | ${false}
  ${"syllable with holam-vav"}    | ${"בַּיּ֣וֹם"}      | ${1}        | ${"HOLAM"}  | ${true}
  ${"syllable with hiriq-yod"}    | ${"אָנֹֽכִי"}       | ${2}        | ${"HIRIQ"}  | ${true}
`("vowelName:", ({ description, hebrew, syllableNum, vowelName, allowNoNiqqud }) => {
  // normally don't use `allowNoNiqqud` in testing, but needed to get `null`
  const heb = new Text(hebrew, { allowNoNiqqud });
  const syllable = heb.syllables[syllableNum];
  const syllableVowelName = syllable.vowelName;
  describe(description, () => {
    test(`vowelName to equal ${vowelName}`, () => {
      expect(syllableVowelName).toEqual(vowelName);
    });
  });
});

describe("word:", () => {
  test("if no word, null", () => {
    const clusters = [new Cluster("דָּ")];
    const syllable = new Syllable(clusters);
    expect(syllable.word).toEqual(null);
  });

  test("syllable text same as word text", () => {
    const text = new Text("זֶה");
    const first = text.syllables[0];
    expect(first?.word?.text).toEqual(first.text);
  });

  test("syllable text not the same as word text", () => {
    const text = new Text("דָּבָר");
    const last = text.syllables[text.syllables.length - 1];
    expect(last?.word?.text).not.toEqual("דָּ");
  });
});
