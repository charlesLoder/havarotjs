import { Text } from "../src/index";

describe.each`
  description                    | original         | numOfSyls | clusterArr                                                                                | firstCluster | finalCluster
  ${"with a comma"}              | ${"עָד,"}        | ${1}      | ${["עָ", "ד", ","]}                                                                       | ${"עָ"}      | ${","}
  ${"with parentheses"}          | ${"(אָב)"}       | ${1}      | ${["(", "אָ", "ב", ")"]}                                                                  | ${"("}       | ${")"}
  ${"with a comma, 2 words"}     | ${"אָמַר, לֹא"}  | ${3}      | ${["אָ", "מַ", "ר", ",", "לֹ", "א"]}                                                      | ${"אָ"}      | ${"א"}
  ${"with parentheses, 2 words"} | ${"(אָמַר לֹא)"} | ${3}      | ${["(", "\u{5D0}\u{5B8}", "\u{5DE}\u{5B7}", "\u{5E8}", "\u{5DC}\u{5B9}", "\u{5D0}", ")"]} | ${"("}       | ${")"}
`("Full Vowels:", ({ description, original, numOfSyls, clusterArr, firstCluster, finalCluster }) => {
  const heb = new Text(original);
  const clusterTexts = heb.clusters.map((el) => el.text);
  describe(description, () => {
    test(`original: ${original}`, () => {
      expect(heb.syllables.length).toEqual(numOfSyls);
      expect(clusterTexts).toEqual(clusterArr);
      expect(clusterTexts[0]).toEqual(firstCluster);
      expect(clusterTexts[clusterTexts.length - 1]).toEqual(finalCluster);
    });
  });
});
