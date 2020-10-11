// export class Node<T> {
//   [x: string]: any;
//   next: Node<T> | null;
//   prev: Node<T> | null;
//   child!: Node<T>;

//   constructor() {
//     this.next = null;
//     this.prev = null;
//   }

//   set children(arr: Node<T>[]) {
//     const head = arr[0];
//     const remainder = arr.slice(1);
//     this.child = head;
//     head.siblings = remainder;
//   }

//   set siblings(arr: Node<T>[]) {
//     let len = arr.length;
//     for (let index = 0; index < len; index++) {
//       const curr = arr[index];
//       const nxt = arr[index + 1] || null;
//       const prv = arr[index - 1] || this;
//       curr.prev = prv;
//       prv.next = curr;
//       curr.next = nxt;
//     }
//   }

//   get siblings(): Node<T>[] {
//     let curr = this.next;
//     let res = [];
//     while (curr) {
//       res.push(curr);
//       curr = curr.next;
//     }
//     return res;
//   }
// }
export class Node {
  [x: string]: any;
  next: Node | null;
  prev: Node | null;
  child!: Node;

  constructor() {
    this.next = null;
    this.prev = null;
  }

  set children(arr: any[]) {
    const head = arr[0];
    const remainder = arr.slice(1);
    this.child = head;
    head.siblings = remainder;
  }

  set siblings(arr: any[]) {
    let len = arr.length;
    for (let index = 0; index < len; index++) {
      const curr = arr[index];
      const nxt = arr[index + 1] || null;
      const prv = arr[index - 1] || this;
      curr.prev = prv;
      prv.next = curr;
      curr.next = nxt;
    }
  }

  get siblings(): any[] {
    let curr = this.next;
    let res = [];
    while (curr) {
      res.push(curr);
      curr = curr.next;
    }
    return res;
  }
}
