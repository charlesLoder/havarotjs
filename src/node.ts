/**
 * Represents a node in a bidirectional chain structure with optional child nodes.
 * This node can be used to create various linked data structures.
 *
 * @template T The type of value stored in the node.
 */
export class Node<T> {
  /** Reference to the next node in the sequence. */
  next: Node<T> | null;

  /** Reference to the previous node in the sequence. */
  prev: Node<T> | null;

  /** The value stored in this node. */
  value: T | null;

  /** Reference to the first child node. */
  protected child!: Node<T>;

  /**
   * Creates a new Node instance.
   * Initializes value, next, and prev properties to null.
   */
  constructor() {
    this.value = null;
    this.next = null;
    this.prev = null;
  }

  /**
   * Sets the children of this node.
   * The first element becomes the child, and the rest become siblings of the child.
   * @param arr - An array of Node<T> to set as children.
   */
  protected set children(arr: Node<T>[]) {
    const head = arr[0];
    const remainder = arr.slice(1);
    this.child = head;
    head.siblings = remainder;
  }

  /**
   * Sets the siblings of this node.
   * Establishes bidirectional links between adjacent nodes in the provided array.
   * @param arr - An array of Node<T> to set as siblings.
   */
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

  /**
   * Gets the siblings of this node.
   * @returns An array of Node<T> representing all subsequent nodes in the sequence.
   */
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
