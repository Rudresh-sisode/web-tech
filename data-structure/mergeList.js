class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Helper function to create a linked list from an array
function createList(arr) {
  let dummy = new ListNode(-1);
  let current = dummy;
  for (let val of arr) {
    current.next = new ListNode(val);
    current = current.next;
  }
  return dummy.next;
}


function mergeTwoList(l1, l2) {
  let dummy = new ListNode(-1);
  let current = dummy;

  while (l1 && l2) {
    if (l1.val < l2.val) {
      current.next = l1;
      l1 = l1.next;
    }
    else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 ? l1 : l2;

  return dummy;
}

// Example usage: create two lists
let l1 = createList([1, 3, 5]);
let l2 = createList([2, 4, 6]);

console.log(l1); // Output: ListNode { val: 1, next: ListNode { ... } }
console.log(l2); // Output: ListNode { val: 2, next: ListNode { ... } }

console.log("merged list ",mergeTwoList(l1, l2));
