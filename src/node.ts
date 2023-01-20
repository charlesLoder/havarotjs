export class Node {
  next: Node | null;
  prev: Node | null;
  protected child!: Node;

  constructor() {
    this.next = null;
    this.prev = null;
  }

  protected set children(arr: Node[]) {
    const head = arr[0];
    const remainder = arr.slice(1);
    this.child = head;
    head.siblings = remainder;
  }

  set siblings(arr: Node[]) {
    const len = arr.length;
    for (let index = 0; index < len; index++) {
      const curr = arr[index];
      const nxt = arr[index + 1] || null;
      const prv = arr[index - 1] || this;
      curr.prev = prv;
      prv.next = curr;
      curr.next = nxt;
    }
  }

  get siblings(): Node[] {
    let curr = this.next;
    const res = [];
    while (curr) {
      res.push(curr);
      curr = curr.next;
    }
    return res;
  }
}
