import { Text } from "../src/index";

function testIsAccented(hebrew: string, isAccentedArray: boolean[]) {
  const text = new Text(hebrew);
  const syllables = text.syllables;
  expect(syllables.map((s) => s.isAccented)).toEqual(isAccentedArray);
}

// Taamim and their relation to stress from Introduction to Tiberian Hebrew Accents by Sung Jin Park
// https://assets.cambridge.org/97811084/79936/excerpt/9781108479936_excerpt.pdf
// hence the use of non-Hebrew terms (i.e. little zaqeph instead of zaqeph qatan).
// The poetic accents are not complete, but rather the test aimed to deal with those that are most complicated.
// Poetic accents from http://jamesdprice.com/images/21_Syntax_of_Accents_rev._ed..pdf
describe("Test if a syllable is accented", () => {
  test("No taaimim, default last syllable", () => {
    testIsAccented("דָּבָר", [false, true]);
  });

  test("If in construct, no accent", () => {
    testIsAccented("כָּל־הָעָ֖ם", [false, false, true]);
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
    describe("Disjunctive taamim", () => {
      describe("postpositive taamim", () => {
        describe("segolta", () => {
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

        describe("zarqa", () => {
          // note that the zarqa is incorrectly named in the Unicode spec as ZINOR (U+05AE)
          test("zarqa on accented syllable", () => {
            testIsAccented("לִבָּם֮ ", [false, true]);
          });

          // the zarqa over the yod is a "helper" unique to MAM, it is encoded as a zinor (which is actually called a zarqa in the Unicode spec)
          test("two zarqas", () => {
            testIsAccented("וַיֹּ֘אמֶר֮", [false, true, false]);
          });

          xtest("zarqa on unaccented syllable", () => {
            // this will never pass
            testIsAccented("וַיֹּאמֶר֮", [false, true, false]);
          });
        });

        describe("pashta", () => {
          test("pashta on accented syllable", () => {
            testIsAccented("לָאוֹר֙", [false, true]);
          });

          xtest("pashta on unaccented syllable", () => {
            // I'm not sure if this is possible to have in a text
          });

          test("qadma, with no pashta", () => {
            testIsAccented("רָגַ֨ל", [false, true]);
          });

          test("pastha and qadma", () => {
            testIsAccented("יֹאשִׁיָּ֒הוּ֒", [false, false, true, false]);
          });
        });

        describe("sinor", () => {
          // note that the sinor is uses the same character as the zarqa, and like the zarqa is always postpositive
          // unlike the zarqa, in MAM, there is not a "helper."
          test("sinor on accented syllable", () => {
            testIsAccented("אֱלֹהַי֮", [false, false, true]);
          });

          xtest("sinor on unaccented syllable", () => {
            // this will never pass
            testIsAccented("פָּנֶיךָ֮", [false, true, false]);
          });
        });
      });

      describe("prepositive taamim", () => {
        describe("yethib", () => {
          test("yethib on accented syllable", () => {
            testIsAccented("יַ֚עַן ", [true, false]);
          });

          xtest("two yethibs", () => {
            // unable to find an example of this
          });

          xtest("yethib on unaccented syllable", () => {
            // unable to find an example of this
          });
        });

        describe("great telisha", () => {
          test("great telisha on accented syllable", () => {
            testIsAccented("כִּ֠י", [true]);
          });

          xtest("great telisha on unaccented syllable", () => {
            // this will never pass
            testIsAccented("הָ֠עָם", [false, true]);
          });

          test("two great telishas", () => {
            testIsAccented("הָ֠עָ֠ם", [false, true]);
          });
        });

        test("ole-weyored", () => {
          // only the ole is prepositive
          testIsAccented("רְשָׁ֫עִ֥ים", [false, false, true]);
        });

        describe("dechi", () => {
          // for dechi, always assume the final syllable is accented
          test("dechi on unaccented syllable", () => {
            testIsAccented("נָ֭בוּב", [false, true]);
          });

          // this will incorrectly accent the final syllable
          xtest("dechi on accented syllable", () => {
            testIsAccented("לַ֭יְלָה", [false, true]);
          });
        });
      });
    });

    describe("Conjunctive taamim", () => {
      describe("postpositive taamim", () => {
        describe("little telisha", () => {
          test("little telisha on accented syllable", () => {
            testIsAccented("וַיִּבְכּוּ֩", [false, false, true]);
          });

          xtest("little telisha on unaccented syllable", () => {
            // this will never pass
            testIsAccented("לְמַעַן֩", [false, true, false]);
          });

          test("two little telishas", () => {
            testIsAccented("לְמַ֩עַן֩", [false, true, false]);
          });
        });
      });

      describe("prepositive taamim", () => {
        test("sinnorit", () => {
          // the sinnorit is incorrectly named in the Unicode spec as ZARQA (U+0598)
          // it does not appear by itself
          testIsAccented("אֱלֹ֘הֵ֤י", [false, false, true]);
        });
      });
    });
  });
});
