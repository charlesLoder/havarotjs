import { Text } from "../src/index";

function testIsAccented(hebrew: string, isAccentedArray: boolean[]) {
  const text = new Text(hebrew);
  const syllables = text.syllables;
  expect(syllables.map((s) => s.isAccented)).toEqual(isAccentedArray);
}

describe("Test if a syllable is accented", () => {
  test("No taaimim, default last syllable", () => {
    testIsAccented("דָּבָר", [false, true]);
  });
});
