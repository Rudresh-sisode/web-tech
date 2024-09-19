//  Definition for a binary tree node.
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}

/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  if (!root) {
    return 0;
  }
  return foundLength(root, 0);
};

let count = 0;
function foundLength(root, length) {
  if (root === null || root === undefined) {
    return length;
  }
  let left = 0, right = 0;
  if (root.left !== null) {
    left = foundLength(root.left,length+1)
  }
  if (root.right !== null) {
    right = foundLength(root.right,length+1);
  }
  return left > right ? left : right;
}

let root = new TreeNode(3);
root.left = new TreeNode(5);
root.right = new TreeNode(1);
root.left.left = new TreeNode(6);
root.left.right = new TreeNode(2);
root.right.left = new TreeNode(0);
root.right.right = new TreeNode(8);
root.left.right.left = new TreeNode(7);
root.left.right.right = new TreeNode(9);

let result = maxDepth(root);
console.log(result);