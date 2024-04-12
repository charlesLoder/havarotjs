import { Text } from "../src/text";
import { Cluster } from "../src/cluster";
import { Char } from "../src/char";

describe("Char", () => {
  describe("constructor", () => {
    it("should create a Char instance with the correct text and sequencePosition", () => {
      const char = new Char("א");
      expect(char.text).toBe("א");
      expect(char.sequencePosition).toBe(0);

      const niqqud = new Char("ֶ");
      expect(niqqud.text).toBe("ֶ");
      expect(niqqud.sequencePosition).toBe(3);

      const nonHebrew = new Char("a");
      expect(nonHebrew.text).toBe("a");
      expect(nonHebrew.sequencePosition).toBe(10);
    });
  });

  describe("isCharacterName", () => {
    it("should return true if the Char instance matches the given character name", () => {
      const aleph = new Char("א");
      expect(aleph.isCharacterName("ALEF")).toBe(true);
      expect(aleph.isCharacterName("BET")).toBe(false);

      const patach = new Char("ַ");
      expect(patach.isCharacterName("PATAH")).toBe(true);
      expect(patach.isCharacterName("SHEVA")).toBe(false);

      const sheva = new Char("ְ");
      expect(sheva.isCharacterName("SHEVA")).toBe(true);
      expect(sheva.isCharacterName("REVIA")).toBe(false);

      const rebia = new Char("֗");
      expect(rebia.isCharacterName("REVIA")).toBe(true);
      expect(rebia.isCharacterName("MAQAF")).toBe(false);

      const maqqaf = new Char("־");
      expect(maqqaf.isCharacterName("MAQAF")).toBe(true);
      expect(maqqaf.isCharacterName("SOF_PASUQ")).toBe(false);

      const sofPasuq = new Char("׃");
      expect(sofPasuq.isCharacterName("SOF_PASUQ")).toBe(true);
      expect(sofPasuq.isCharacterName("ALEF")).toBe(false);
    });

    it("should throw an error if the given character name is invalid", () => {
      const char = new Char("א");
      // @ts-ignore: need to pass an invalid name
      expect(() => char.isCharacterName("INVALID_NAME")).toThrow("INVALID_NAME is not a valid value");
    });
  });

  describe("characterName", () => {
    it("should return the correct character name for Hebrew characters", () => {
      const aleph = new Char("א");
      expect(aleph.characterName).toBe("ALEF");

      const bet = new Char("ב");
      expect(bet.characterName).toBe("BET");

      const patach = new Char("ַ");
      expect(patach.characterName).toBe("PATAH");

      const sheva = new Char("ְ");
      expect(sheva.characterName).toBe("SHEVA");

      const rebia = new Char("֗");
      expect(rebia.characterName).toBe("REVIA");

      const maqqaf = new Char("־");
      expect(maqqaf.characterName).toBe("MAQAF");

      const sofPasuq = new Char("׃");
      expect(sofPasuq.characterName).toBe("SOF_PASUQ");
    });

    it("should return null for non-Hebrew characters", () => {
      const nonHebrew = new Char("a");
      expect(nonHebrew.characterName).toBeNull();
    });
  });

  describe("cluster", () => {
    it("should allow setting and getting the cluster property", () => {
      const char = new Char("א");
      const cluster = new Cluster("אָ");

      expect(char.cluster).toBeNull();

      char.cluster = cluster;
      expect(char.cluster).toBe(cluster);
    });
  });

  describe("is* properties", () => {
    it("should correctly identify character types", () => {
      const consonant = new Char("א");
      expect(consonant.isConsonant).toBe(true);
      expect(consonant.isLigature).toBe(false);
      expect(consonant.isDagesh).toBe(false);
      expect(consonant.isRafe).toBe(false);
      expect(consonant.isVowel).toBe(false);
      expect(consonant.isTaamim).toBe(false);
      expect(consonant.isNotHebrew).toBe(false);

      const dagesh = new Char("ּ");
      expect(dagesh.isConsonant).toBe(false);
      expect(dagesh.isLigature).toBe(false);
      expect(dagesh.isDagesh).toBe(true);
      expect(dagesh.isRafe).toBe(false);
      expect(dagesh.isVowel).toBe(false);
      expect(dagesh.isTaamim).toBe(false);
      expect(dagesh.isNotHebrew).toBe(false);

      const rafe = new Char("ֿ");
      expect(rafe.isConsonant).toBe(false);
      expect(rafe.isLigature).toBe(false);
      expect(rafe.isDagesh).toBe(false);
      expect(rafe.isRafe).toBe(true);
      expect(rafe.isVowel).toBe(false);
      expect(rafe.isTaamim).toBe(false);
      expect(rafe.isNotHebrew).toBe(false);

      const vowel = new Char("ָ");
      expect(vowel.isConsonant).toBe(false);
      expect(vowel.isLigature).toBe(false);
      expect(vowel.isDagesh).toBe(false);
      expect(vowel.isRafe).toBe(false);
      expect(vowel.isVowel).toBe(true);
      expect(vowel.isTaamim).toBe(false);
      expect(vowel.isNotHebrew).toBe(false);

      const taamim = new Char("֑");
      expect(taamim.isConsonant).toBe(false);
      expect(taamim.isLigature).toBe(false);
      expect(taamim.isDagesh).toBe(false);
      expect(taamim.isRafe).toBe(false);
      expect(taamim.isVowel).toBe(false);
      expect(taamim.isTaamim).toBe(true);
      expect(taamim.isNotHebrew).toBe(false);

      const nonHebrew = new Char("a");
      expect(nonHebrew.isConsonant).toBe(false);
      expect(nonHebrew.isLigature).toBe(false);
      expect(nonHebrew.isDagesh).toBe(false);
      expect(nonHebrew.isRafe).toBe(false);
      expect(nonHebrew.isVowel).toBe(false);
      expect(nonHebrew.isTaamim).toBe(false);
      expect(nonHebrew.isNotHebrew).toBe(true);
    });
  });

  describe("text", () => {
    it("should return the correct text", () => {
      const char = new Char("א");
      expect(char.text).toBe("א");
    });
  });

  describe("with Hebrew words", () => {
    it("should handle words from the Hebrew Bible correctly", () => {
      const word1 = "וְהָאָ֗רֶץ";
      const chars1 = new Text(word1).chars;
      expect(chars1.map((char) => char.sequencePosition)).toEqual([0, 3, 0, 3, 0, 3, 4, 0, 3, 0]);

      const word2 = "קָ֣רָא";
      const chars2 = new Text(word2).chars;
      expect(chars2.map((char) => char.sequencePosition)).toEqual([0, 3, 4, 0, 3, 0]);
    });
  });
});
