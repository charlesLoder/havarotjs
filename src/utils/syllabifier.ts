import { Cluster } from "../cluster";
import { Syllable } from "../syllable";

export const syllabify = (text: string) => {
  text = text.trim();
  const splits = /(?=[\u{05D0}-\u{05F2}])/u;
  const groups = text.split(splits);
  const clusters = groups.map((group) => new Cluster(group));
  let syllables: Syllable[] = [];

  function pushSyls() {
    let vowelPresent: boolean = false;
    let currVowelShort: boolean = false;
    let isClosed: boolean = false;
    let isAccented: boolean = false;
    let syl: Cluster[] = [];

    clusters.forEach((cluster) => {
      //  A. Does the cluster have a vowel? YES
      if (cluster.hasVowel) {
        // A.1 Is there already a vowel present? NO
        if (!vowelPresent) {
          syl.push(cluster);
          vowelPresent = true;
          currVowelShort = cluster.hasShortVowel;
          isClosed = false;
        }
        // A.2 Is there already a vowel present? YES
        else {
          // A.2.a is the cluster a vav + holem? YES
          const holemVav = /וֹ/;
          if (holemVav.test(cluster.text)) {
            const pop: Cluster | undefined = syl.length ? syl.pop() : undefined;
            isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
            syllables.push(new Syllable(syl, { isClosed: false, isAccented: isAccented }));
            syl = [];
            if (pop) syl.push(pop);
            syl.push(cluster);
            isClosed = false;
          }
          // A.2.a is the cluster a vav + holem? NO
          else {
            const dageshRegx = /\u{05BC}/u;
            isClosed = dageshRegx.test(cluster.text);
            isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
            syllables.push(new Syllable(syl, { isClosed, isAccented }));
            syl = [];
            syl.push(cluster);
            isClosed = false;
            currVowelShort = cluster.hasShortVowel;
          }
        }
      }
      // B. Does the cluster have a vowel? NO
      else {
        // B.1 Does the cluster have a shewa? YES
        if (cluster.hasShewa) {
          // B.1.b Is there a vowel present already? NO
          if (!vowelPresent) {
            syllables.push(new Syllable([cluster], { isClosed: false, isAccented: false, isFinal: false }));
          }
          // B.1.a Is there a vowel present already? YES
          else {
            // B.1.a.iii Is it a final form? YES
            if (/תְּ|ךְ/.test(cluster.text)) {
              syl.push(cluster);
              isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
              isClosed = true;
            }
            // B.1.a.i Is the present vowel a short vowel? YES
            else if (currVowelShort) {
              const dageshRegx = /\u{05BC}/u;
              // B.1.a.i.A Does the cluster have a doubling dagesh? YES
              if (dageshRegx.test(cluster.text)) {
                isClosed = true;
                isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
                syllables.push(new Syllable(syl, { isClosed: isClosed, isAccented: isAccented }));
                syl = [];
                syl.push(cluster);
                vowelPresent = true;
              }
              // B.1.a.ii.B Does the cluster have a doubling dagesh? NO
              else {
                syl.push(cluster);
                isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
                syllables.push(new Syllable(syl, { isClosed: true, isAccented: isAccented }));
                syl = [];
                currVowelShort = false;
                vowelPresent = false;
              }
            }
            // B.1.a.ii Is the present vowel a short vowel? NO
            else {
              isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
              syllables.push(new Syllable(syl, { isClosed: false, isAccented: isAccented }));
              syl = [];
              syl.push(cluster);
              vowelPresent = true;
            }
          }
        }
        // B.2 Does the cluster have a shewa? NO
        else {
          // B.2.a Is a vowel present? YES
          if (vowelPresent) {
            const nonVowelmaterRegx = /[הא]/;
            const dageshRegx = /\u{05BC}/u;
            // B.2.a.i Is it a final-he or aleph
            if (nonVowelmaterRegx.test(cluster.text)) {
              // B.2.a.i.A&B does he have a mappiq?
              syl.push(cluster);
              isClosed = dageshRegx.test(cluster.text);
            }
            // B.2.a.ii it is a yod or vav?
            else {
              const vowelmaterRegx = /[יו]/;
              const shureqRegx = /וּ/;
              // B.2.a.ii.I it is a shureq? YES
              if (shureqRegx.test(cluster.text)) {
                const pop: Cluster | undefined = syl.length ? syl.pop() : undefined;
                isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
                syllables.push(new Syllable(syl, { isClosed: false, isAccented: isAccented }));
                syl = [];
                if (pop) syl.push(pop);
                syl.push(cluster);
                isClosed = false;
              }
              // B.2.a.ii.I it is a shureq? NO
              else {
                syl.push(cluster);
                isClosed = !vowelmaterRegx.test(cluster.text);
              }
            }
          }
          // B.2.b Is a vowel present? NO
          else {
            // it could be a shureq or a consonant waiting for a mater
            const shureqRegx = /וּ/;
            syl.push(cluster);
            vowelPresent = shureqRegx.test(cluster.text);
          }
        }
      }
    });

    if (syl.length) {
      isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
      syllables.push(new Syllable(syl, { isClosed, isAccented, isFinal: true }));
    }
  }

  pushSyls();

  return syllables;
};
