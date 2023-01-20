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
