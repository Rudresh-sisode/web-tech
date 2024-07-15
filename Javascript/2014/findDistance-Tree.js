/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} p
 * @param {number} q
 * @return {number}
 */
/**
 * tree
 *       3
       /   \
      5     1
     / \   / \
    6   2 0   8
       / \
      7   4
 */

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = this.right = null;
  }
}

var findDistance = function (root, p, q) { // tree, 5, 0
  // Helper function to find LCA
  function findLCA(node, p, q) {
    if (!node || node.val === p || node.val === q) return node;
    let left = findLCA(node.left, p, q);
    let right = findLCA(node.right, p, q);
    if (left && right) return node;
    return left ? left : right;
  }

  // Helper function to find distance from LCA to a given node
  function findLevel(node, val, level) {
    if (!node) return -1;
    if (node.val === val) return level;
    let left = findLevel(node.left, val, level + 1);
    if (left !== -1) return left;
    return findLevel(node.right, val, level + 1);
  }

  let lca = findLCA(root, p, q);
  return findLevel(lca, p, 0) + findLevel(lca, q, 0);
};

let root = new TreeNode(3);
root.left = new TreeNode(5);
root.right = new TreeNode(1);
root.left.left = new TreeNode(6);
root.left.right = new TreeNode(2);
root.right.left = new TreeNode(0);
root.right.right = new TreeNode(8);
root.left.right.left = new TreeNode(7);
root.left.right.right = new TreeNode(4);

// Step 3: Call the findDistance function
var distance = findDistance(root, 5, 0);
console.log(distance); // Output the distance

// Input: root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 0
// Output: 3
// Explanation: There are 3 edges between 5 and 0: 5 - 3 - 1 - 0.