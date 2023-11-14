import { Text } from "../src/index";

function testIsAccented(hebrew: string, isAccentedArray: boolean[]) {
  const text = new Text(hebrew);
  const syllables = text.syllables;
  expect(syllables.map((s) => s.isAccented)).toEqual(isAccentedArray);
}

// Taamim and their relation to stress from Introduction to Tiberian Hebrew Accents by Sung Jin Park
// https://assets.cambridge.org/97811084/79936/excerpt/9781108479936_excerpt.pdf
// hence the use of non-Hebrew terms (i.e. little zaqeph instead of zaqeph qatan)
describe("Test if a syllable is accented", () => {
  test("No taaimim, default last syllable", () => {
    testIsAccented("דָּבָר", [false, true]);
  });

  describe("Taamim that fall on the stressed syllable", () => {
    test("silluq", () => {
      testIsAccented("חֽוּשָׁה׃", [true, false]);
    });

    test("atnah", () => {
      testIsAccented("בָּאָ֑רֶץ", [false, true, false]);
    });

    test("shaleshet", () => {
      testIsAccented("וַֽיִּתְמַהְמָ֓הּ", [false, false, false, true]);
    });

    test("little zaqeph", () => {
      testIsAccented("נַפְשֶׁ֔ךָ", [false, true, false]);
    });

    test("great zaqeph", () => {
      testIsAccented("וַתֹּ֕אמֶר", [false, true, false]);
    });

    test("rebia", () => {
      testIsAccented("וְעַתָּ֗ה", [false, false, true]);
    });

    test("tiphcha", () => {
      testIsAccented("גֹּאֵ֖ל", [false, true]);
    });

    test("tebir", () => {
      testIsAccented("וְגַ֛ם", [false, true]);
    });

    test("geresh", () => {
      testIsAccented("אָמַ֜רְתִּי", [false, true, false]);
    });

    test("garshaim", () => {
      testIsAccented("וַיִּקַּ֞ח", [false, false, true]);
    });

    test("pazer", () => {
      testIsAccented("הָֽרֹמֶ֡שֶׂת", [false, false, true, false]);
    });

    test("great pazer", () => {
      testIsAccented("בָּֽאַמָּ֟ה", [false, false, true]);
    });

    // though there is a differece between the two, they use the same character and both fall on the stressed syllable
    test("legarmeh/munach", () => {
      testIsAccented("וְיַעְזֵ֣ר", [false, false, true]);
    });

    test("mahphak", () => {
      testIsAccented("וְלָקַחְתָּ֤", [false, false, false, true]);
    });

    test("mereka", () => {
      testIsAccented("תֵרֵ֥ד", [false, true]);
    });

    test("double mereka", () => {
      testIsAccented("תַעֲשֶׂ֦ה", [false, false, true]);
    });

    test("darga", () => {
      testIsAccented("וְלֹ֧א ", [false, true]);
    });

    test("azla", () => {
      testIsAccented("וְאֵ֨לֶּה", [false, true, false]);
    });

    test("galgal (or yerah ben yomo)", () => {
      testIsAccented("אַלְפַּ֪יִם", [false, true, false]);
    });
  });

  describe("Taamim that do not fall on the stressed syllable", () => {
    test("segolta on accented syllable", () => {
      testIsAccented("לָֽאָדָם֒", [false, false, true]);
    });

    test("segolta on unaccented syllable", () => {
      testIsAccented("מֶּלֶךְ֒", [false, true]);
    });

    test("two segoltas", () => {
      testIsAccented("יֹאשִׁיָּ֒הוּ֒", [false, false, true, false]);
    });
  });
});
