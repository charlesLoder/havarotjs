import { Cluster } from "../cluster";
import { Syllable } from "../syllable";

const groupFinal = (arr: Cluster[]): (Cluster[] | Cluster)[] => {
  // grouping the final first helps to avoid issues with final kafs/tavs
  const len = arr.length;
  let i = len - 1;
  let syl: Cluster[] = [];
  let result: (Cluster[] | Cluster)[] = [];
  let vowelPresent = false;
  // get final cluster ans push to syl
  const finalCluster = arr[i];
  syl.unshift(finalCluster);

  if (finalCluster.hasVowel) {
    // check if finalCluster is Syllable
    vowelPresent = true;
    i--;
  } else if (finalCluster.isShureq) {
    // check if final cluster isShureq and get preceding Cluster
    i--;
    syl.unshift(arr[i]);
    vowelPresent = true;
    i--;
  } else {
    i--;
  }

  while (!vowelPresent) {
    let curr = arr[i];
    syl.unshift(curr);
    vowelPresent = curr.hasVowel;
    i--;
  }

  const remainder = arr.slice(0, i + 1);
  result = remainder;
  result.push(syl);

  return result;
};

/**
 * @description a preprocessing step that groups clusters into intermediate syllables by vowels or shewas
 */
const groupClusters = (arr: Cluster[]): Cluster[][] => {
  const finalGrouped = groupFinal(arr);
  const notReal = finalGrouped.map((cluster) => {
    if (Array.isArray(cluster)) {
      return cluster;
    }
    return [cluster];
  });
  return notReal;
};

export const syllabify = (text: string): Syllable[] => {
  text = text.trim();
  const splits = /(?=[\u{05D0}-\u{05F2}])/u;
  const groups = text.split(splits);
  const clusters = groups.map((group) => new Cluster(group));
  const groupedClusters = groupClusters(clusters);
  const syllables = groupedClusters.map((arr) => new Syllable(arr));
  // sets accents
  syllables.forEach((syllable) => {
    let isAccented = syllable.clusters.filter((cluster) => cluster.hasTaamei).length ? true : false;
    syllable.isAccented = isAccented;
  });
  // sets final
  syllables[syllables.length - 1].isFinal = true;
  return syllables;
};
