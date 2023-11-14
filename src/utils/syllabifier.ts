import { Cluster } from "../cluster";
import { Syllable } from "../syllable";
import { SylOpts } from "../text";
import { vowels } from "./regularExpressions";

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
 *
 * @param arr an array of Clusters to be grouped
 * @param strict where to implement strict mode
 * @param vowelsRgx a regex for the set of Hebrew vowels excluding sheva
 */
const groupFinal = (arr: Cluster[], vowelsRgx: RegExp = vowels): Mixed => {
  // grouping the final first helps to avoid issues with final kafs/tavs
  const len = arr.length;
  let i = 0;
  const syl: Syl = [];
  let result: Mixed = [];
  let vowelPresent = false;

  // get final cluster and push to syl
  let finalCluster = arr[i];
  syl.unshift(finalCluster);

  // if the final cluster is punctuation and there is a next cluster
  // then push the next cluster to syl.
  if (finalCluster.isPunctuation && arr[i + 1]) {
    i++;
    finalCluster = arr[i];
    syl.unshift(finalCluster);
  }

  if (finalCluster.hasVowel) {
    // check if finalCluster is syllable
    vowelPresent = true;
    i++;
  } else if (finalCluster.isShureq) {
    // check if final cluster isShureq and get preceding Cluster
    i++;
    if (i <= len && arr[i]) {
      syl.unshift(arr[i]);
    }
    vowelPresent = true;
    i++;
  } else {
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
      if (arr[i]) syl.unshift(arr[i]);
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

  const finalChar = finalCluster.chars.filter((c) => c.sequencePosition !== 4).at(-1)?.text || "";
  const hasFinalVowel = vowelsRgx.test(finalChar);
  const isClosed =
    !finalCluster.isShureq &&
    !finalCluster.isMater &&
    // if final cluster is an aleph, then the syllable is open (e.g. בָּרָ֣א)
    // unless the preceding cluster has a sheva (e.g. וַיַּ֧רְא)
    (!/\u{05D0}/u.test(finalCluster.text) || finalCluster?.prev?.value?.hasSheva) &&
    // if the final cluster is an he but without a mappiq, then the syllable is open
    // this applies even to cases where the he is not a mater (e.g. פֹּ֖ה)
    !/\u{05D4}(?!\u{05bc})/u.test(finalCluster.text) &&
    !hasFinalVowel;
  const finalSyllable = new Syllable(syl, { isClosed });
  const remainder = arr.slice(i);
  result = remainder.length ? remainder : [];
  result.unshift(finalSyllable);

  return result;
};

/**
 * @description groups shevas either by themselves or with preceding short vowel
 */
const groupShevas = (arr: Mixed, options: SylOpts): Mixed => {
  let shevaPresent = false;
  let syl: Syl = [];
  const result: Mixed = [];
  const len = arr.length;
  const shevaNewSyllable = createNewSyllable.bind(groupShevas, result);

  for (let index = 0; index < len; index++) {
    const cluster = arr[index];

    // skip if already a syllable
    if (cluster instanceof Syllable) {
      result.push(cluster);
      continue;
    }

    const clusterHasSheva = cluster.hasSheva;
    if (!shevaPresent && clusterHasSheva) {
      shevaPresent = true;
      syl.unshift(cluster);
      continue;
    }

    if (shevaPresent && clusterHasSheva) {
      syl = shevaNewSyllable(syl);
      syl.unshift(cluster);
      continue;
    }

    if (shevaPresent && cluster.hasShortVowel) {
      if (options.shevaAfterMeteg && cluster.hasMeteg) {
        syl = shevaNewSyllable(syl);
        syl.unshift(cluster);
        continue;
      }
      const dageshRegx = /\u{05BC}/u;
      const prev = syl[0].text;
      const sqnmlvy = /[שסצקנמלוי]/;
      const wawConsecutive = /וַ/;
      // check if there is a doubling dagesh
      if (dageshRegx.test(prev)) {
        syl = shevaNewSyllable(syl);
      }
      // check for waw-consecutive w/ sqnmlvy letter
      else if (
        (options.sqnmlvy || (options.shevaAfterMeteg && cluster.hasMeteg)) &&
        sqnmlvy.test(prev) &&
        wawConsecutive.test(cluster.text)
      ) {
        syl = shevaNewSyllable(syl);
        result.push(new Syllable([cluster]));
        shevaPresent = false;
        continue;
      }
      // check for article preceding yod w/ sheva
      else if (options.article && /[ילמ]/.test(prev) && /הַ/.test(cluster.text)) {
        syl = shevaNewSyllable(syl);
        result.push(new Syllable([cluster]));
        shevaPresent = false;
        continue;
      }
      syl.unshift(cluster);
      syl = shevaNewSyllable(syl, true);
      shevaPresent = false;
      continue;
    }

    if (shevaPresent && cluster.hasLongVowel) {
      if (options.longVowels || (cluster.hasMeteg && options.shevaAfterMeteg)) {
        syl = shevaNewSyllable(syl);
        result.push(cluster);
        shevaPresent = false;
      } else {
        syl.unshift(cluster);
        syl = shevaNewSyllable(syl, true);
        shevaPresent = false;
      }
      continue;
    }

    if (shevaPresent && cluster.isShureq) {
      if (!options.wawShureq && (!options.shevaAfterMeteg || !cluster.hasMeteg) && len - 1 === index) {
        syl.unshift(cluster);
        syl = shevaNewSyllable(syl, true);
      } else {
        syl = shevaNewSyllable(syl);
        result.push(cluster);
        shevaPresent = false;
      }
      continue;
    }

    if (shevaPresent && cluster.isMater && options.longVowels) {
      syl = shevaNewSyllable(syl);
      result.push(cluster);
      shevaPresent = false;
      continue;
    }

    if (shevaPresent && !cluster.hasVowel) {
      syl.unshift(cluster);
      continue;
    }

    result.push(cluster);
  }

  if (syl.length) {
    shevaNewSyllable(syl);
  }

  return result;
};

/**
 * @description groups non-final maters with preceding cluster
 */
const groupMaters = (arr: Mixed, strict: boolean = true): Mixed => {
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

      if (!nxt && strict) {
        const word = arr.map((i) => i.text).join("");
        throw new Error(`The cluster ${cluster.text} is a mater, but nothing precedes it in ${word}`);
      }

      if (nxt instanceof Syllable) {
        const word = arr.map((i) => i.text).join("");
        throw new Error(`Syllable ${nxt.text} should not precede a Cluster with a Mater in ${word}`);
      }

      if (nxt) syl.unshift(nxt);

      syl = materNewSyllable(syl);
      index++;
    }
    // check for quiesced alef — not a mater, but similar
    else if (!cluster.hasVowel && /א/.test(cluster.text)) {
      syl.unshift(cluster);
      const nxt = arr[index + 1];

      if (!nxt && strict) {
        const word = arr.map((i) => i.text).join("");
        throw new Error(`The cluster ${cluster.text} is a quiesced alef, but nothing precedes it in ${word}`);
      }

      // at this point, only final syllables and shevas are Syllables
      if (nxt instanceof Syllable) {
        result.push(cluster);
        continue;
      }

      if (nxt) syl.unshift(nxt);

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
const groupShureqs = (arr: Mixed, strict: boolean = true): Mixed => {
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

      if (strict && nxt instanceof Syllable) {
        const word = arr.map((i) => i.text).join("");
        throw new Error(`Syllable ${nxt.text} should not precede a Cluster with a Shureq in ${word}`);
      }

      /**
       * cast as Cluster to a
       */
      if (nxt) syl.unshift(nxt as Cluster);

      syl = shureqNewSyllable(syl);
      index++;
    } else {
      result.push(cluster);
    }
  }
  return result;
};

/**
 * @description a preprocessing step that groups clusters into intermediate syllables by vowels or shevas
 */
const groupClusters = (arr: Cluster[], options: SylOpts): Mixed => {
  const rev = arr.reverse();
  const finalGrouped = groupFinal(rev);
  const shevasGrouped = groupShevas(finalGrouped, options);
  const shureqGroups = groupShureqs(shevasGrouped, options.strict);
  const matersGroups = groupMaters(shureqGroups, options.strict);
  const result = matersGroups.reverse();
  return result;
};

const setIsClosed = (syllable: Syllable, index: number, arr: Syllable[]) => {
  // no need to check, groupFinal takes care of it
  if (index === arr.length - 1) {
    return;
  }
  if (!syllable.isClosed) {
    const dageshRegx = /\u{05BC}/u;
    const hasShortVowel = !!syllable.clusters.filter((cluster) => cluster.hasShortVowel).length;
    /**
     * if `hasShortVowel` is true, nothing to check;
     * if a syllable has only one cluster with a sheva, then it is false;
     * else, it means the preceding cluster has no vowel
     */
    const hasNoVowel = hasShortVowel || !!(syllable.clusters.filter((cluster) => !cluster.hasVowel).length - 1);
    const prev = arr[index + 1];
    const prevDagesh = dageshRegx.test(prev.clusters[0].text);
    syllable.isClosed = (hasShortVowel || hasNoVowel) && prevDagesh;
  }
};

const setIsAccented = (syllable: Syllable) => {
  if (syllable.isAccented) {
    return;
  }
  // TODO: this is pretty hacky, but it works; find a more elegant solution
  const jerusalemFinal = /\u{5B4}\u{05DD}/u;
  const jerusalemPrev = /ל[\u{5B8}\u{5B7}]/u;
  let prev = syllable.prev?.value;
  if (jerusalemFinal.test(syllable.text) && prev && jerusalemPrev.test(prev.text)) {
    prev.isAccented = true;
    return;
  }

  /**
   * Note: Miqra Al Pi HaMesorah (MAPM) sometimes has "accent helpers".
   * Often if the taam is not placed on the accented syllable,
   * then a taam is added on the previous, accented syllable.
   *
   * E.g.: עַל־יֹאשִׁיָּ֒הוּ֒
   */

  // check for segolta
  const segolta = /\u{0592}/u;
  if (segolta.test(syllable.text)) {
    // see לָֽאָדָם֒ as an example of segolta on the final syllable
    if (syllable.isFinal && prev) {
      // see יֹאשִׁיָּ֒הוּ֒ as an example of segolta on a previous syllable
      while (prev) {
        if (segolta.test(prev.text)) {
          prev.isAccented = true;
          return;
        }
        prev = (prev?.prev?.value as Syllable) ?? null;
      }
    }

    // if the segolta is not final, then it is the accented syllable
    // though, it was likely already accented in the while loop above
    syllable.isAccented = true;
    return;
  }

  // if final syllable has a pashta character
  // it may not necessarily be the accented syllable
  // check if any preceding syllable has a pashta or qadma character
  const pashta = /\u{0599}/u;
  const sylText = syllable.text;
  if (syllable.isFinal && pashta.test(sylText)) {
    const qadma = /\u{05A8}/u;
    while (prev) {
      if (pashta.test(prev.text) || qadma.test(prev.text)) {
        return;
      }
      prev = (prev?.prev?.value as Syllable) ?? null;
    }
  }

  // the telisha qetana is a postpositive accent
  const telishaQetana = /\u{05A9}/u;
  if (telishaQetana.test(syllable.text) && prev) {
    // if the telisha qetana is preceded by a telisha qetana, then the previous syllable is accented
    // e.g. the last syllable in וְהֵסִ֩ירָה֩
    if (telishaQetana.test(prev.text)) {
      prev.isAccented = true;
      return;
    }

    // if the telisha qetana is followed by a telisha qetana, then the current syllable is accented
    // e.g. the penultimate syllable in וְהֵסִ֩ירָה֩
    const next = syllable.next?.value;
    if (next && telishaQetana.test(next.text)) {
      syllable.isAccented = true;
      return;
    }

    // if none of the above, then this is a standard telisha qetana
    // e.g. the final syllable in וַיֹּאמֶר֩
    if (!telishaQetana.test(prev.text)) {
      prev.isAccented = true;
      return;
    }
  }

  const isAccented = syllable.clusters.filter((cluster) => (cluster.hasTaamim || cluster.hasSilluq ? true : false))
    .length
    ? true
    : false;
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
        isAccented: firstSyl.isAccented,
        isClosed: firstSyl.isClosed,
        isFinal: firstSyl.isFinal
      });
    } else {
      const lastSyl = syls[numOfSyls - 1];
      while (index < latin.length) {
        partial.push(latin[index].cluster);
        index++;
      }
      syls[numOfSyls - 1] = new Syllable([...lastSyl.clusters, ...partial], {
        isAccented: lastSyl.isAccented,
        isClosed: lastSyl.isClosed,
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

  // set these before setting isClosed and isAccented siblings can be accsessed
  const [first, ...rest] = syllables;
  first.siblings = rest;

  // set syllable properties
  syllables[syllables.length - 1].isFinal = true;
  syllables.forEach(setIsClosed);
  syllables.forEach(setIsAccented);

  // if there is no accented syllable, then the last syllable is accented
  if (!syllables.map((s) => s.isAccented).includes(true)) {
    syllables[syllables.length - 1].isAccented = true;
  }

  // for each cluster, set its syllable
  syllables.forEach((s) => s.clusters.forEach((c) => (c.syllable = s)));
  return latinClusters.length ? reinsertLatin(syllables, latinClusters) : syllables;
};
