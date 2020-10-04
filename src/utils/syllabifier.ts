import { Cluster } from "../cluster";
import { Syllable } from "../syllable";

// an intermediate step between Cluster and Syllables
interface Syl {
  clusters: Cluster[];
  isClosed: boolean;
}

const isSyl = (input: Syl | Cluster): input is Syl => {
  return (input as Syl).clusters !== undefined;
};

/**
 * @description determines the Cluster[] that will become the final Syllable
 */
const groupFinal = (arr: Cluster[]): (Syl | Cluster)[] => {
  // grouping the final first helps to avoid issues with final kafs/tavs
  const len = arr.length;
  let i = len - 1;
  let syl: Syl = { clusters: [], isClosed: false };
  let result: (Syl | Cluster)[] = [];
  let vowelPresent = false;
  // get final cluster ans push to syl
  const finalCluster = arr[i];
  syl.clusters.unshift(finalCluster);

  if (finalCluster.hasVowel) {
    // check if finalCluster is Syllable
    vowelPresent = true;
    i--;
  } else if (finalCluster.isShureq) {
    // check if final cluster isShureq and get preceding Cluster
    i--;
    syl.clusters.unshift(arr[i]);
    vowelPresent = true;
    i--;
  } else {
    syl.isClosed = !finalCluster.isMater;
    i--;
  }

  while (!vowelPresent) {
    let curr = arr[i];
    syl.clusters.unshift(curr);
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
const groupShewas = (arr: (Syl | Cluster)[]): (Syl | Cluster)[] => {
  const reversed = arr.reverse();
  let shewaPresent = false;
  let syl: Syl = { clusters: [], isClosed: false };
  let result: (Syl | Cluster)[] = [];
  const len = arr.length;
  for (let index = 0; index < len; index++) {
    const cluster = reversed[index];
    if (isSyl(cluster)) {
      result.unshift(cluster);
      continue;
    }
    if (cluster.hasShewa && !shewaPresent) {
      shewaPresent = true;
      syl.clusters.push(cluster);
      continue;
    }
    if (cluster.hasShewa && shewaPresent) {
      result.unshift(syl);
      syl.clusters = [];
      syl.clusters.push(cluster);
      continue;
    }
    if (cluster.hasShortVowel && shewaPresent) {
      syl.clusters.push(cluster);
      syl.isClosed = true;
      result.unshift(syl);
      syl.clusters = [];
      syl.isClosed = false;
      shewaPresent = false;
      continue;
    }
    if (cluster.hasLongVowel && shewaPresent) {
      result.unshift(syl);
      result.unshift(cluster);
      syl.clusters = [];
      shewaPresent = false;
      continue;
    }
    result.unshift(cluster);
  }

  if (syl.clusters.length) {
    result.unshift(syl);
  }

  return result;
};

/**
 * @description groups no-final maters with preceding cluster
 */
const groupMaters = (arr: (Syl | Cluster)[]): (Syl | Cluster)[] => {
  const reversed = arr.reverse();
  const len = arr.length;
  let syl: Syl = { clusters: [], isClosed: false };
  let result: (Syl | Cluster)[] = [];
  for (let index = 0; index < len; index++) {
    const cluster = reversed[index];
    if (isSyl(cluster)) {
      result.unshift(cluster);
      continue;
    }
    if (cluster.isMater) {
      syl.clusters.push(cluster);
      const nxt = reversed[index + 1];
      if (isSyl(nxt)) {
        result.unshift(nxt);
        continue;
      }
      syl.clusters.push(nxt);
      result.unshift(syl);
      syl.clusters = [];
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
const groupShureqs = (arr: (Syl | Cluster)[]): (Syl | Cluster)[] => {
  const reversed = arr.reverse();
  const len = arr.length;
  let syl: Syl = { clusters: [], isClosed: false };
  let result: (Syl | Cluster)[] = [];
  for (let index = 0; index < len; index++) {
    const cluster = reversed[index];
    if (isSyl(cluster)) {
      result.unshift(cluster);
      continue;
    }
    if (cluster.isShureq) {
      syl.clusters.push(cluster);
      const nxt = reversed[index + 1];
      if (isSyl(nxt)) {
        result.unshift(nxt);
        continue;
      }
      syl.clusters.push(nxt);
      result.unshift(syl);
      syl.clusters = [];
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
const groupClusters = (arr: Cluster[]): Syl[] => {
  const finalGrouped = groupFinal(arr);
  const shewasGrouped = groupShewas(finalGrouped);
  const matersGroups = groupMaters(shewasGrouped);
  const shureqGroups = groupShureqs(matersGroups);
  const notReal = shureqGroups.map((group) => {
    if (isSyl(group)) {
      return group;
    }
    let syl: Syl = { clusters: [], isClosed: false };
    syl.clusters = [group];
    return syl;
  });
  return notReal;
};

export const syllabify = (text: string): Syllable[] => {
  text = text.trim();
  const splits = /(?=[\u{05D0}-\u{05F2}])/u;
  const groups = text.split(splits);
  const clusters = groups.map((group) => new Cluster(group));
  const groupedClusters = groupClusters(clusters);
  const syllables = groupedClusters.map((syl) => new Syllable(syl.clusters, { isClosed: syl.isClosed }));
  // sets accents
  syllables.forEach((syllable) => {
    let isAccented = syllable.clusters.filter((cluster) => cluster.hasTaamei).length ? true : false;
    syllable.isAccented = isAccented;
  });
  // sets final
  syllables[syllables.length - 1].isFinal = true;
  return syllables;
};
