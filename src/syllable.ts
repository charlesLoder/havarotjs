import { Cluster } from "./cluster";
import { Char } from "./char";

export class Syllable {
  #clusters: Cluster[];
  #isClosed: boolean;
  #isAccented: boolean;
  #isFinal: boolean;

  constructor(clusters: Cluster[], { isClosed = false, isAccented = false, isFinal = false } = {}) {
    this.#clusters = clusters;
    this.#isClosed = isClosed;
    this.#isAccented = isAccented;
    this.#isFinal = isFinal;
  }

  /**
   * @returns a string that has been built up from the .text of its consituent Clusters
   */
  get text(): string {
    return this.clusters.reduce((init, cluster) => init + cluster.text, "");
  }

  /**
   * @returns a one dimensional array of Clusters
   */
  get clusters(): Cluster[] {
    return this.#clusters;
  }

  /**
   * @returns a one dimensional array of Chars
   */
  get chars(): Char[] {
    return this.clusters.map((cluster) => cluster.chars).reduce((a, c) => a.concat(c), []);
  }

  /**
   * @returns true if Syllable is closed
   * @description a closed in Hebrew is a CVC or CVCC type, a mater letter does not close a syllable
   */
  get isClosed(): boolean {
    return this.#isClosed;
  }

  /**
   * @param closed a boolean for whether the Syllable is closed
   * @description a closed in Hebrew is a CVC or CVCC type, a mater letter does not close a syllable
   */
  set isClosed(closed: boolean) {
    this.#isClosed = closed;
  }

  /**
   * @returns true if Syllable is accented
   * @description an accented syllable receives stress
   */
  get isAccented(): boolean {
    return this.#isAccented;
  }

  /**
   * @param accented a boolean for whether the Syllable is accented
   * @description an accented syllable receives stress
   */
  set isAccented(accented: boolean) {
    this.#isAccented = accented;
  }

  /**
   * @returns true if Syllable is final
   */
  get isFinal(): boolean {
    return this.#isFinal;
  }

  /**
   * @param final a boolean for whether the Syllable is the final Syallble
   */
  set isFinal(final: boolean) {
    this.#isFinal = final;
  }
}
