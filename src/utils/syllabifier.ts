import { Cluster } from "../cluster";
import { Syllable } from "../syllable";
import { SylOpts } from "../text";

type Syl = Cluster[];
type Mixed = (Syllable | Cluster)[];

/**
 * @description creates a new Syllable, pushes to results[], and resets syl[]
 */
const createNewSyllable = (result: Mixed, syl: Syl, isClosed?: boolean): Syl => {
  isClosed = isClosed || false;
  const syllable = new Syllable(syl, { isClosed });
  result.push(syllable);
  return [];
};

/**
 * @description determines the Cluster[] that will become the final Syllable
 */
const groupFinal = (arr: Cluster[]): Mixed => {
  // grouping the final first helps to avoid issues with final kafs/tavs
  const len = arr.length;
  let i = 0;
  const syl: Syl = [];
  let result: Mixed = [];
  let vowelPresent = false;
  let isClosed = false;

  // get final cluster and push to syl
  // but first check if final cluster is notHebrew
  const finalCluster = arr[i];
  syl.unshift(finalCluster);

  if (finalCluster.hasVowel) {
    // check if finalCluster is syllable
    vowelPresent = true;
    i++;
  } else if (finalCluster.isShureq) {
    // check if final cluster isShureq and get preceding Cluster
    i++;
    if (i <= len) {
      syl.unshift(arr[i]);
    }
    vowelPresent = true;
    i++;
  } else {
    isClosed = !finalCluster.isMater;
    i++;
  }

  while (!vowelPresent) {
    const nxt = arr[i];
    const curr = nxt ? nxt : false;
    if (!curr) {
      break;
    }
    syl.unshift(curr);
    if (curr.isShureq) {
      i++;
      syl.unshift(arr[i]);
      vowelPresent = true;
    } else {
      const clusterHasVowel = "hasVowel" in curr ? curr.hasVowel : true;
      vowelPresent = clusterHasVowel || curr.isShureq;
    }
    i++;
    if (i > len) {
      break;
    }
  }

  const finalSyllable = new Syllable(syl, { isClosed });
  const remainder = arr.slice(i);
  result = remainder.length ? remainder : [];
  result.unshift(finalSyllable);

  return result;
};

/**
 * @description groups shewas either by themselves or with preceding short vowel
 */
const groupShewas = (arr: Mixed, options: SylOpts): Mixed => {
  let shewaPresent = false;
  let syl: Syl = [];
  const result: Mixed = [];
  const len = arr.length;
  const shewaNewSyllable = createNewSyllable.bind(groupShewas, result);

  for (let index = 0; index < len; index++) {
    const cluster = arr[index];

    // skip if already a syllable
    if (cluster instanceof Syllable) {
      result.push(cluster);
      continue;
    }

    const clusterHasShewa = cluster.hasShewa;
    if (!shewaPresent && clusterHasShewa) {
      shewaPresent = true;
      syl.unshift(cluster);
      continue;
    }

    if (shewaPresent && clusterHasShewa) {
      syl = shewaNewSyllable(syl);
      syl.unshift(cluster);
      continue;
    }

    if (shewaPresent && cluster.hasShortVowel) {
      if (cluster.hasMetheg) {
        syl = shewaNewSyllable(syl);
        syl.unshift(cluster);
        continue;
      }
      const dageshRegx = /\u{05BC}/u;
      const prev = syl[0].text;
      const sqenemlevy = /[שסצקנמלוי]/;
      const wawConsecutive = /וַ/;
      // check if there is a doubling dagesh
      if (dageshRegx.test(prev)) {
        syl = shewaNewSyllable(syl);
      }
      // check for waw-consecutive w/ sqenemlevy letter
      else if (options.sqnmlvy && sqenemlevy.test(prev) && wawConsecutive.test(cluster.text)) {
        syl = shewaNewSyllable(syl);
        result.push(new Syllable([cluster]));
        shewaPresent = false;
        continue;
      }
      syl.unshift(cluster);
      syl = shewaNewSyllable(syl, true);
      shewaPresent = false;
      continue;
    }

    if (shewaPresent && cluster.hasLongVowel) {
      if (options.longVowels) {
        syl = shewaNewSyllable(syl);
        result.push(cluster);
        shewaPresent = false;
      } else {
        syl.unshift(cluster);
        syl = shewaNewSyllable(syl, true);
        shewaPresent = false;
      }
      continue;
    }

    if (shewaPresent && cluster.isShureq) {
      if (!options.wawShureq && !cluster.hasMetheg && len - 1 === index) {
        syl.unshift(cluster);
        syl = shewaNewSyllable(syl, true);
      } else {
        syl = shewaNewSyllable(syl);
        result.push(cluster);
        shewaPresent = false;
      }
      continue;
    }

    if (shewaPresent && cluster.isMater) {
      syl = shewaNewSyllable(syl);
      result.push(cluster);
      shewaPresent = false;
      continue;
    }

    result.push(cluster);
  }

  if (syl.length) {
    shewaNewSyllable(syl);
  }

  return result;
};

/**
 * @description groups non-final maters with preceding cluster
 */
const groupMaters = (arr: Mixed): Mixed => {
  const len = arr.length;
  let syl: Syl = [];
  const result: Mixed = [];
  const materNewSyllable = createNewSyllable.bind(groupMaters, result);

  for (let index = 0; index < len; index++) {
    const cluster = arr[index];

    if (cluster instanceof Syllable) {
      result.push(cluster);
      continue;
    }

    if (cluster.isMater) {
      syl.unshift(cluster);
      const nxt = arr[index + 1];

      if (nxt instanceof Syllable) {
        throw new Error("Syllable should not precede a Cluster with a Mater");
      }

      syl.unshift(nxt);
      syl = materNewSyllable(syl);
      index++;
    } else {
      result.push(cluster);
    }
  }

  return result;
};

/**
 * @description groups non-final shureqs with preceding cluster
 */
const groupShureqs = (arr: Mixed): Mixed => {
  const len = arr.length;
  let syl: Syl = [];
  const result: Mixed = [];
  const shureqNewSyllable = createNewSyllable.bind(groupShureqs, result);

  for (let index = 0; index < len; index++) {
    const cluster = arr[index];

    if (cluster instanceof Syllable) {
      result.push(cluster);
      continue;
    }

    if (cluster.isShureq) {
      syl.unshift(cluster);
      const nxt = arr[index + 1];

      if (nxt instanceof Syllable) {
        throw new Error("Syllable should not precede a Cluster with a Mater");
      }

      if (nxt !== undefined) {
        syl.unshift(nxt);
      }
      syl = shureqNewSyllable(syl);
      index++;
    } else {
      result.push(cluster);
    }
  }
  return result;
};

/**
 * @description a preprocessing step that groups clusters into intermediate syllables by vowels or shewas
 */
const groupClusters = (arr: Cluster[], options: SylOpts): Mixed => {
  const rev = arr.reverse();
  const finalGrouped = groupFinal(rev);
  const shewasGrouped = groupShewas(finalGrouped, options);
  const matersGroups = groupMaters(shewasGrouped);
  const shureqGroups = groupShureqs(matersGroups);
  const result = shureqGroups.reverse();
  return result;
};

/**
 *
 * @param word the word to be split into Cluster
 * @description splits a word at each consonant or the punctuation character
 * Sof Pasuq and Nun Hafukha
 */
export const makeClusters = (word: string): Cluster[] => {
  const split =
    /(?=[\u{05C3}\u{05C6}\u{05D0}-\u{05F2}\u{2000}-\u{206F}\u{2E00}-\u{2E7F}'!"#$%&()*+,-.\/:;<=>?@\[\]^_`\{|\}~])/u;
  const groups = word.split(split);
  const clusters = groups.map((group) => new Cluster(group));
  return clusters;
};

const setIsClosed = (syllable: Syllable, index: number, arr: Syllable[]) => {
  // no need to check, groupFinal takes care of it
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

/**
 *
 * @description a step to get a Cluster's original position before filtering out latin
 */
const clusterPos = (cluster: Cluster, i: number): { cluster: Cluster; pos: number } => {
  return { cluster, pos: i };
};

const reinsertLatin = (syls: Syllable[], latin: { cluster: Cluster; pos: number }[]): Syllable[] => {
  const numOfSyls = syls.length;
  for (let index = 0; index < latin.length; index++) {
    const group = latin[index];
    const partial: Cluster[] = [];
    // if a latin cluster was at the beginning
    if (group.pos === 0) {
      partial.push(group.cluster);
      while (index + 1 < latin.length && latin[index + 1].pos === group.pos + 1) {
        partial.push(latin[index + 1].cluster);
        index++;
      }
      const firstSyl = syls[0];
      syls[0] = new Syllable([...partial, ...firstSyl.clusters], {
        isClosed: firstSyl.isClosed,
        isAccented: firstSyl.isAccented,
        isFinal: firstSyl.isFinal
      });
    } else {
      const lastSyl = syls[numOfSyls - 1];
      while (index < latin.length) {
        partial.push(latin[index].cluster);
        index++;
      }
      syls[numOfSyls - 1] = new Syllable([...lastSyl.clusters, ...partial], {
        isClosed: lastSyl.isClosed,
        isAccented: lastSyl.isAccented,
        isFinal: lastSyl.isFinal
      });
    }
  }
  return syls;
};

export const syllabify = (clusters: Cluster[], options: SylOpts): Syllable[] => {
  const removeLatin = clusters.filter((cluster) => !cluster.isNotHebrew);
  const latinClusters = clusters.map(clusterPos).filter((c) => c.cluster.isNotHebrew);
  const groupedClusters = groupClusters(removeLatin, options);
  const syllables = groupedClusters.map((group) => (group instanceof Syllable ? group : new Syllable([group])));
  syllables.forEach((syllable, index, arr) => setIsClosed(syllable, index, arr));
  syllables.forEach((syllable) => setIsAccented(syllable));
  syllables[syllables.length - 1].isFinal = true;
  return latinClusters.length ? reinsertLatin(syllables, latinClusters) : syllables;
};
