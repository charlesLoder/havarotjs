import { Cluster } from "./cluster";

interface SyllableInterface {
  text: string;
  isClosed: boolean;
  isAccented: boolean;
  isFinal: boolean;
}

export class Syllable implements SyllableInterface {
  text: string;
  isClosed: boolean;
  isAccented: boolean;
  isFinal: boolean;

  constructor(text: Cluster[], { isClosed = false, isAccented = false, isFinal = false } = {}) {
    this.text = text.reduce((init, cluster) => init + cluster.text, "");
    this.isClosed = isClosed;
    this.isAccented = isAccented;
    this.isFinal = isFinal;
  }
}
