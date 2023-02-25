export class Node<T> {
  next: Node<T> | null;
  prev: Node<T> | null;
  value: T | null;
  protected child!: Node<T>;

  constructor() {
    this.value = null;
    this.next = null;
    this.prev = null;
  }

  protected set children(arr: Node<T>[]) {
    const head = arr[0];
    const remainder = arr.slice(1);
    this.child = head;
    head.siblings = remainder;
  }

  set siblings(arr: Node<T>[]) {
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

  get siblings(): Node<T>[] {
    let curr = this.next;
    const res = [];
    while (curr) {
      res.push(curr);
      curr = curr.next;
    }
    return res;
  }
}
