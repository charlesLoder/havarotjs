import { Cluster } from "./cluster";

export class Syllable {
  clusters: Cluster[];
  isClosed: boolean;
  isAccented: boolean;
  isFinal: boolean;

  constructor(clusters: Cluster[], { isClosed = false, isAccented = false, isFinal = false } = {}) {
    this.clusters = clusters;
    this.isClosed = isClosed;
    this.isAccented = isAccented;
    this.isFinal = isFinal;
  }

  get text() {
    return this.clusters.reduce((init, cluster) => init + cluster.text, "");
  }

  get chars() {
    return this.clusters.map((cluster) => cluster.chars).reduce((a, c) => a.concat(c), []);
  }
}
