function ListNode(val, next) {
	this.val = (val===undefined ? 0 : val)
	this.next = (next===undefined ? null : next)
}

var deleteDuplicatesUnsorted = function(head) {
	let counts = new Map(); // Step 1: Count occurrences
	let current = head;
	while (current != null) {
		counts.set(current.val, (counts.get(current.val) || 0) + 1);
		current = current.next;
	}

	let dummy = new ListNode(0); // Dummy node to handle edge case for head node
	dummy.next = head;
	let prev = dummy; // Previous node pointer
	current = head; // Reset current to head for second traversal

	// Step 2: Remove duplicates
	while (current != null) {
		if (counts.get(current.val) > 1) { // If current node is a duplicate
			prev.next = current.next; // Remove current node
		} else {
			prev = current; // Move prev pointer if not removing
		}
		current = current.next; // Move to next node
	}

	return dummy.next; // Return the modified list, excluding dummy
};