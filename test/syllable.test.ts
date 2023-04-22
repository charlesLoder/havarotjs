import { Text } from "../src/index";
import { Syllable } from "../src/syllable";

describe.each`
  description                     | hebrew              | syllableNum | vowel         | allowNoNiqqud
  ${"syllable with patah"}        | ${"הַֽ֭יְחָבְרְךָ"} | ${0}        | ${"\u{05B7}"} | ${false}
  ${"syllable with sheva"}        | ${"הַֽ֭יְחָבְרְךָ"} | ${1}        | ${"\u{05B0}"} | ${false}
  ${"syllable with silent sheva"} | ${"הַֽ֭יְחָבְרְךָ"} | ${2}        | ${"\u{05B8}"} | ${false}
  ${"syllable with none"}         | ${"test"}           | ${0}        | ${null}       | ${true}
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

describe.each`
  description                     | hebrew              | syllableNum | vowelName   | result
  ${"syllable with patah"}        | ${"הַֽ֭יְחָבְרְךָ"} | ${0}        | ${"PATAH"}  | ${true}
  ${"syllable with sheva"}        | ${"הַֽ֭יְחָבְרְךָ"} | ${1}        | ${"SHEVA"}  | ${true}
  ${"syllable with silent sheva"} | ${"הַֽ֭יְחָבְרְךָ"} | ${2}        | ${"SHEVA"}  | ${false}
  ${"syllable with qamats"}       | ${"הַֽ֭יְחָבְרְךָ"} | ${2}        | ${"QAMATS"} | ${true}
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
  description                                  | hebrew             | syllableNum | onset   | nucleus               | coda
  ${"closed syllable"}                         | ${"יָ֥ם"}          | ${0}        | ${"י"}  | ${"\u{05B8}\u{05A5}"} | ${"ם"}
  ${"open syllable"}                           | ${"מַדּוּעַ"}      | ${0}        | ${"מ"}  | ${"\u{05B7}"}         | ${""}
  ${"syllable with shureq"}                    | ${"מַדּוּעַ"}      | ${1}        | ${"דּ"} | ${"וּ"}               | ${""}
  ${"syllable with furtive patah"}             | ${"מַדּוּעַ"}      | ${2}        | ${""}   | ${"\u{05B7}"}         | ${"ע"}
  ${"word-initial shureq"}                     | ${"וּמֶלֶךְ"}      | ${0}        | ${""}   | ${"וּ"}               | ${""}
  ${"onset cluster (not supported)"}           | ${"שְׁתַּיִם"}     | ${0}        | ${"שׁ"} | ${"\u{05B0}"}         | ${""}
  ${"Jerusalem w/ patah penultimate syllable"} | ${"יְרוּשָׁלִַ֗ם"} | ${3}        | ${"ל"}  | ${"\u{05B7}\u{0597}"} | ${""}
  ${"Jerusalem w/ patah final syllable"}       | ${"יְרוּשָׁלִַ֗ם"} | ${4}        | ${""}   | ${"\u{05B4}"}         | ${"ם"}
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

describe.each`
  description                                  | hebrew        | syllableNum | codaWithGemination
  ${"open syllable followed by gemination"}    | ${"מַדּוּעַ"} | ${0}        | ${"דּ"}
  ${"open syllable followed by no gemination"} | ${"מֶלֶךְ"}   | ${0}        | ${""}
  ${"closed syllable followed by dagesh qal"}  | ${"מַסְגֵּר"} | ${0}        | ${"סְ"}
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
