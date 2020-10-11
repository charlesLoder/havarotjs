import { Cluster } from "./cluster";
import { Char } from "./char";
import { Node } from "./node";

export class Syllable extends Node {
  private _clusters: Cluster[];
  isClosed: boolean;
  isAccented: boolean;
  isFinal: boolean;

  constructor(clusters: Cluster[], { isClosed = false, isAccented = false, isFinal = false } = {}) {
    super();
    this._clusters = clusters;
    this.isClosed = isClosed;
    this.isAccented = isAccented;
    this.isFinal = isFinal;
  }

  get text(): string {
    return this._clusters.reduce((init, cluster) => init + cluster.text, "");
  }

  get clusters(): Cluster[] {
    this.children = this._clusters;
    const first = this.child;
    const remainder = first?.siblings;
    return [first, ...remainder];
  }

  get chars(): Char[] {
    return this.clusters.map((cluster) => cluster.chars).reduce((a, c) => a.concat(c), []);
  }
}
