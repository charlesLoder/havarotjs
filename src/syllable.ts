import { Cluster } from "./cluster";
import { Char } from "./char";
import { Node } from "./node";

export class Syllable extends Node {
  clusters: Cluster[];
  isClosed: boolean;
  isAccented: boolean;
  isFinal: boolean;

  constructor(clusters: Cluster[], { isClosed = false, isAccented = false, isFinal = false } = {}) {
    super();
    this.clusters = clusters;
    this.children = this.clusters;
    this.isClosed = isClosed;
    this.isAccented = isAccented;
    this.isFinal = isFinal;
  }

  get text(): string {
    return this.clusters.reduce((init, cluster) => init + cluster.text, "");
  }

  get chars(): Char[] {
    return this.clusters.map((cluster) => cluster.chars).reduce((a, c) => a.concat(c), []);
  }
}
