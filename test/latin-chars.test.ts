import { Text } from "../src/index";

describe.each`
  description       | original  | numOfSyls | clusterArr          | firstCluster | finalCluster
  ${"with a comma"} | ${"עָד,"} | ${1}      | ${["עָ", "ד", ","]} | ${"עָ"}      | ${","}
`("Full Vowels:", ({ description, original, numOfSyls, clusterArr, firstCluster, finalCluster }) => {
  const heb = new Text(original);
  const clusters = heb.clusters.map((el) => el.text);
  describe(description, () => {
    test(`original: ${original}`, () => {
      expect(heb.syllables.length).toEqual(numOfSyls);
      expect(clusters).toEqual(clusterArr);
      expect(clusters[0]).toEqual(firstCluster);
      expect(clusters[clusters.length - 1]).toEqual(finalCluster);
    });
  });
});
