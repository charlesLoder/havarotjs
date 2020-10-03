import { Cluster } from "../cluster";
import { Syllable } from "../syllable";

/**
 * @description determines the Cluster[] that will become the final Syllable
 */
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
    vowelPresent = "hasVowel" in curr ? curr.hasVowel : true;
    i--;
    if (i < 0) {
      break;
    }
  }

  const remainder = arr.slice(0, i + 1);
  result = remainder;
  result.push(syl);

  return result;
};

/**
 * @description groups shewas either by themselves or with preceding short vowel
 */
const groupShewas = (arr: (Cluster[] | Cluster)[]): (Cluster[] | Cluster)[] => {
  const reversed = arr.reverse();
  let shewaPresent = false;
  let syl: Cluster[] = [];
  let result: (Cluster[] | Cluster)[] = [];
  const len = arr.length;
  for (let index = 0; index < len; index++) {
    const cluster = reversed[index];
    if (Array.isArray(cluster)) {
      result.unshift(cluster);
      continue;
    }
    if (cluster.hasShewa && !shewaPresent) {
      shewaPresent = true;
      syl.push(cluster);
      continue;
    }
    if (cluster.hasShewa && shewaPresent) {
      result.unshift(syl);
      syl = [];
      syl.push(cluster);
      continue;
    }
    if (cluster.hasShortVowel && shewaPresent) {
      syl.push(cluster);
      result.unshift(syl);
      syl = [];
      shewaPresent = false;
      continue;
    }
    if (cluster.hasLongVowel && shewaPresent) {
      result.unshift(syl);
      result.unshift(cluster);
      syl = [];
      shewaPresent = false;
      continue;
    }
    result.unshift(cluster);
  }

  if (syl.length) {
    result.unshift(syl);
  }

  return result;
};

/**
 * @description groups no-final maters with preceding cluster
 */
const groupMaters = (arr: (Cluster[] | Cluster)[]): (Cluster[] | Cluster)[] => {
  const reversed = arr.reverse();
  const len = arr.length;
  let syl: Cluster[] = [];
  let result: (Cluster[] | Cluster)[] = [];
  for (let index = 0; index < len; index++) {
    const cluster = reversed[index];
    if (Array.isArray(cluster)) {
      result.unshift(cluster);
      continue;
    }
    if (cluster.isMater) {
      syl.push(cluster);
      const nxt = reversed[index + 1];
      if (Array.isArray(nxt)) {
        result.unshift(nxt);
        continue;
      }
      syl.push(nxt);
      result.unshift(syl);
      syl = [];
      index++;
    } else {
      result.unshift(cluster);
    }
  }
  return result;
};

/**
 * @description groups non-final shureqs with preceding cluster
 */
const groupShureqs = (arr: (Cluster[] | Cluster)[]): (Cluster[] | Cluster)[] => {
  const reversed = arr.reverse();
  const len = arr.length;
  let syl: Cluster[] = [];
  let result: (Cluster[] | Cluster)[] = [];
  for (let index = 0; index < len; index++) {
    const cluster = reversed[index];
    if (Array.isArray(cluster)) {
      result.unshift(cluster);
      continue;
    }
    if (cluster.isShureq) {
      syl.push(cluster);
      const nxt = reversed[index + 1];
      if (Array.isArray(nxt)) {
        result.unshift(nxt);
        continue;
      }
      syl.push(nxt);
      result.unshift(syl);
      syl = [];
      index++;
    } else {
      result.unshift(cluster);
    }
  }
  return result;
};

/**
 * @description a preprocessing step that groups clusters into intermediate syllables by vowels or shewas
 */
const groupClusters = (arr: Cluster[]): Cluster[][] => {
  const finalGrouped = groupFinal(arr);
  const shewasGrouped = groupShewas(finalGrouped);
  const matersGroups = groupMaters(shewasGrouped);
  const shureqGroups = groupShureqs(matersGroups);
  const notReal = shureqGroups.map((cluster) => {
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
