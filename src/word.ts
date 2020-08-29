import { Syllable } from "./syllable";
import { Cluster } from "./cluster";

export class Word {
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

  /**
   * @returns a one dimensional array of Syllables
   */
  get syllables() {
    return syllabify(this.original);
  }

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
