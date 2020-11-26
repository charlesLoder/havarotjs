import { Cluster } from "../cluster";
import { Syllable } from "../syllable";
import { SylOpts } from "../text";

/**
 * @description determines the Cluster[] that will become the final Syllable
 */
const groupFinal = (arr: Cluster[]): (Syllable | Cluster)[] => {
  // grouping the final first helps to avoid issues with final kafs/tavs
  const len = arr.length;
  let i = len - 1;
  const syl: Cluster[] = [];
  let result: (Syllable | Cluster)[] = [];
  let vowelPresent = false;
  let isClosed = false;

  // get final cluster and push to syl
  const finalCluster = arr[i];
  syl.unshift(finalCluster);

  if (finalCluster.hasVowel) {
    // check if finalCluster is syllable
    vowelPresent = true;
    i--;
  } else if (finalCluster.isShureq) {
    // check if final cluster isShureq and get preceding Cluster
    i--;
    syl.unshift(arr[i]);
    vowelPresent = true;
    i--;
  } else {
    isClosed = !finalCluster.isMater;
    i--;
  }

  while (!vowelPresent) {
    const curr = arr[i];
    syl.unshift(curr);
    if (curr.isShureq) {
      i--;
      syl.unshift(arr[i]);
      vowelPresent = true;
    } else {
      const clusterHasVowel = "hasVowel" in curr ? curr.hasVowel : true;
      vowelPresent = clusterHasVowel || curr.isShureq;
    }
    i--;
    if (i < 0) {
      break;
    }
  }

  const finalSyllable = new Syllable(syl, { isClosed });
  const remainder = arr.slice(0, i + 1);
  result = remainder;
  result.push(finalSyllable);

  return result;
};

/**
 * @description groups shewas either by themselves or with preceding short vowel
 */
const groupShewas = (arr: (Syllable | Cluster)[], options: SylOpts): (Syllable | Cluster)[] => {
  const reversed = arr.reverse();
  let shewaPresent = false;
  let syl: Cluster[] = [];
  const result: (Syllable | Cluster)[] = [];
  const len = arr.length;

  for (let index = 0; index < len; index++) {
    const cluster = reversed[index];

    // skip if already a syllable
    if (cluster instanceof Syllable) {
      result.unshift(cluster);
      continue;
    }

    const clusterHasShewa = cluster.hasShewa;
    if (!shewaPresent && clusterHasShewa) {
      shewaPresent = true;
      syl.push(cluster);
      continue;
    }

    if (shewaPresent && clusterHasShewa) {
      const syllable = new Syllable(syl);
      result.unshift(syllable);
      syl = [];
      syl.push(cluster);
      continue;
    }

    if (shewaPresent && cluster.hasShortVowel) {
      if (cluster.hasMetheg) {
        result.unshift(new Syllable(syl));
        syl = [];
        syl.unshift(cluster);
        continue;
      }
      const dageshRegx = /\u{05BC}/u;
      const prev = syl[0].text;
      const sqenemlevy = /[שסצקנמלוי]/;
      const wawConsecutive = /וַ/;
      // check if there is a doubling dagesh
      if (dageshRegx.test(prev)) {
        result.unshift(new Syllable(syl));
        syl = [];
      }
      // check for waw-consecutive w/ sqenemlevy letter
      else if (options.sqnmlvy && sqenemlevy.test(prev) && wawConsecutive.test(cluster.text)) {
        result.unshift(new Syllable(syl));
        result.unshift(new Syllable([cluster]));
        syl = [];
        shewaPresent = false;
        continue;
      }
      syl.unshift(cluster);
      const syllable = new Syllable(syl, { isClosed: true });
      result.unshift(syllable);
      syl = [];
      shewaPresent = false;
      continue;
    }

    if (shewaPresent && cluster.hasLongVowel) {
      if (options.longVowels) {
        const syllable = new Syllable(syl);
        result.unshift(syllable);
        result.unshift(cluster);
        syl = [];
        shewaPresent = false;
      } else {
        syl.unshift(cluster);
        const syllable = new Syllable(syl, { isClosed: true });
        result.unshift(syllable);
        syl = [];
        shewaPresent = false;
      }
      continue;
    }

    if (shewaPresent && cluster.isShureq) {
      if (!options.wawShureq && !cluster.hasMetheg && len - 1 === index) {
        syl.unshift(cluster);
        const syllable = new Syllable(syl, { isClosed: true });
        result.unshift(syllable);
        syl = [];
      } else {
        const syllable = new Syllable(syl);
        result.unshift(syllable);
        result.unshift(cluster);
        syl = [];
        shewaPresent = false;
      }
      continue;
    }

    if (shewaPresent && cluster.isMater) {
      const syllable = new Syllable(syl);
      result.unshift(syllable);
      result.unshift(cluster);
      syl = [];
      shewaPresent = false;
      continue;
    }

    result.unshift(cluster);
  }

  if (syl.length) {
    const syllable = new Syllable(syl);
    result.unshift(syllable);
  }

  return result;
};

/**
 * @description groups non-final maters with preceding cluster
 */
const groupMaters = (arr: (Syllable | Cluster)[]): (Syllable | Cluster)[] => {
  const reversed = arr.reverse();
  const len = arr.length;
  let syl: Cluster[] = [];
  const result: (Syllable | Cluster)[] = [];

  for (let index = 0; index < len; index++) {
    const cluster = reversed[index];

    if (cluster instanceof Syllable) {
      result.unshift(cluster);
      continue;
    }

    if (cluster.isMater) {
      syl.push(cluster);
      const nxt = reversed[index + 1];

      if (nxt instanceof Syllable) {
        throw new Error("Syllable should not precede a Cluster with a Mater");
      }

      syl.unshift(nxt);
      const syllable = new Syllable(syl);
      result.unshift(syllable);
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
const groupShureqs = (arr: (Syllable | Cluster)[]): (Syllable | Cluster)[] => {
  const reversed = arr.reverse();
  const len = arr.length;
  let syl: Cluster[] = [];
  const result: (Syllable | Cluster)[] = [];

  for (let index = 0; index < len; index++) {
    const cluster = reversed[index];

    if (cluster instanceof Syllable) {
      result.unshift(cluster);
      continue;
    }

    if (cluster.isShureq) {
      syl.push(cluster);
      const nxt = reversed[index + 1];

      if (nxt instanceof Syllable) {
        throw new Error("Syllable should not precede a Cluster with a Mater");
      }

      if (nxt !== undefined) {
        syl.unshift(nxt);
      }

      const syllable = new Syllable(syl);
      result.unshift(syllable);
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
const groupClusters = (arr: Cluster[], options: SylOpts): (Syllable | Cluster)[] => {
  const finalGrouped = groupFinal(arr);
  const shewasGrouped = groupShewas(finalGrouped, options);
  const matersGroups = groupMaters(shewasGrouped);
  const shureqGroups = groupShureqs(matersGroups);
  return shureqGroups;
};

export const makeClusters = (word: string): Cluster[] => {
  const consonantSplit = /(?=[\u{05D0}-\u{05F2}])/u;
  const groups = word.split(consonantSplit);
  const clusters = groups.map((group) => new Cluster(group));
  return clusters;
};

const setIsClosed = (syllable: Syllable, index: number, arr: Syllable[]) => {
  if (index === arr.length - 1) {
    return syllable;
  }
  if (!syllable.isClosed) {
    const dageshRegx = /\u{05BC}/u;
    const hasShortVowel = syllable.clusters.filter((cluster) => cluster.hasShortVowel).length ? true : false;
    const prev = arr[index + 1];
    const prevDagesh = dageshRegx.test(prev.text);
    syllable.isClosed = hasShortVowel && prevDagesh;
  }
};

const setIsAccented = (syllable: Syllable) => {
  const isAccented = syllable.clusters.filter((cluster) => cluster.hasTaamim).length ? true : false;
  syllable.isAccented = isAccented;
};

export const syllabify = (clusters: Cluster[], options: SylOpts): Syllable[] => {
  const groupedClusters = groupClusters(clusters, options);
  const syllables = groupedClusters.map((group) => (group instanceof Syllable ? group : new Syllable([group])));
  syllables.forEach((syllable, index, arr) => setIsClosed(syllable, index, arr));
  syllables.forEach((syllable) => setIsAccented(syllable));
  syllables[syllables.length - 1].isFinal = true;
  return syllables;
};
