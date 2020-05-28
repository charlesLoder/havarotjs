import { Syllable } from "./syllable";
import { Cluster } from "./cluster";

interface WordInterface {
  original: string;
  syllables: Syllable[];
  text: string;
}

export class Word implements WordInterface {
  original: string;

  constructor(text: string) {
    this.original = text;
  }

  get syllables() {
    return this.syllabify();
  }

  get text() {
    return this.syllables.reduce((init, syl) => init + syl.text, "");
  }

  private syllabify() {
    const text = this.original;
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
        if (cluster.hasVowel) {
          if (!vowelPresent) {
            syl.push(cluster);
            vowelPresent = !vowelPresent;
            currVowelShort = cluster.hasShortVowel;
            isClosed = false;
          } else {
            const dageshRegx = /\u{05BC}/u;
            isClosed = dageshRegx.test(cluster.text);
            isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
            syllables.push(new Syllable(syl, { isClosed, isAccented }));
            syl = [];
            syl.push(cluster);
            isClosed = false;
            currVowelShort = cluster.hasShortVowel;
          }
        } else if (cluster.hasHalfVowel) {
          if (syl.length) {
            isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
            syllables.push(new Syllable(syl, { isClosed, isAccented }));
            syl = [];
            vowelPresent = !vowelPresent;
            currVowelShort = cluster.hasShortVowel;
          }
          syl.push(cluster);
        } else if (cluster.hasShewa) {
          if (!vowelPresent) {
            syl.push(cluster);
          } else if (vowelPresent) {
            if (currVowelShort) {
              isClosed = !isClosed;
              syl.push(cluster);
              let isFinal = /תְּ|ךְ/.test(cluster.text);
              isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
              syllables.push(new Syllable(syl, { isClosed, isAccented, isFinal }));
              syl = [];
              vowelPresent = !vowelPresent;
              currVowelShort = cluster.hasShortVowel;
            } else {
              syllables.push(new Syllable(syl, { isClosed, isAccented }));
              isClosed = !isClosed;
              syl = [];
              syl.push(cluster);
              vowelPresent = !vowelPresent;
              currVowelShort = cluster.hasShortVowel;
              isClosed = false;
            }
          }
        } else {
          const materRegx = /[הוי]/;
          if (materRegx.test(cluster.text)) {
            isClosed = false;
            syl.push(cluster);
          } else {
            syl.push(cluster);
            isClosed = true;
          }
        }
      }); // forEach
      if (syl.length) {
        isAccented = syl.filter((cluster) => cluster.hasTaamei).length ? true : false;
        syllables.push(new Syllable(syl, { isClosed, isAccented, isFinal: true }));
      }
    }

    pushSyls();

    return syllables;
  }
}
