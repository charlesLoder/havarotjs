import { Text } from "../src/index";

describe.each`
  description                     | hebrew              | syllableNum | vowel         | allowNoNiqqud
  ${"syllable with patach"}       | ${"הַֽ֭יְחָבְרְךָ"} | ${0}        | ${"\u{05B7}"} | ${false}
  ${"syllable with shewa"}        | ${"הַֽ֭יְחָבְרְךָ"} | ${1}        | ${"\u{05B0}"} | ${false}
  ${"syllable with silent shewa"} | ${"הַֽ֭יְחָבְרְךָ"} | ${2}        | ${"\u{05B8}"} | ${false}
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
