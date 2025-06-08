// Node class for Binary Tree
class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Binary Tree class with CRUD operations
class BinaryTree {
    constructor() {
        this.root = null;
    }

    // Insert value (level order)
    insert(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return this;
        }
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            if (!node.left) {
                node.left = newNode;
                return this;
            } else {
                queue.push(node.left);
            }
            if (!node.right) {
                node.right = newNode;
                return this;
            } else {
                queue.push(node.right);
            }
        }
    }

    // Search for a value (returns node or null)
    search(value) {
        if (!this.root) return null;
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            if (node.value === value) return node;
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        return null;
    }

    // Update a node's value (find oldValue, replace with newValue)
    update(oldValue, newValue) {
        const node = this.search(oldValue);
        if (node) {
            node.value = newValue;
            return true;
        }
        return false;
    }

    // Delete a node by value (replace with deepest node)
    delete(value) {
        if (!this.root) return false;
        if (this.root.value === value && !this.root.left && !this.root.right) {
            this.root = null;
            return true;
        }
        let nodeToDelete = null, parentOfDeepest = null, deepest = null;
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            if (node.value === value) nodeToDelete = node;
            if (node.left) {
                parentOfDeepest = node;
                queue.push(node.left);
            }
            if (node.right) {
                parentOfDeepest = node;
                queue.push(node.right);
            }
            deepest = node;
        }
        if (nodeToDelete && deepest) {
            nodeToDelete.value = deepest.value;
            // Remove deepest node
            if (parentOfDeepest.left === deepest) parentOfDeepest.left = null;
            else if (parentOfDeepest.right === deepest) parentOfDeepest.right = null;
            return true;
        }
        return false;
    }

    // Optional: Level order traversal (for testing)
    levelOrderTraversal() {
        const result = [];
        if (!this.root) return result;
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            result.push(node.value);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        return result;
    }
}

// Example usage:
if (require.main === module) {
  const tree = new BinaryTree();
  console.log(tree.root)

    // Create (Insert)
  tree.insert(10);
  tree.insert(20);
  tree.insert(30);
  tree.insert(40);
  tree.insert(50);
  tree.insert(100)
  console.log([tree.root])


    // console.log('Level order after inserts:', tree.levelOrderTraversal());

    // // Read (Search)
    // const found = tree.search(20);
    // console.log('Search 20:', found ? found.value : 'Not found');

    // // Update
    // const updated = tree.update(30, 35);
    // console.log('Update 30 to 35:', updated);
    // console.log('Level order after update:', tree.levelOrderTraversal());

    // Delete
    const deleted = tree.delete(10);
    console.log('Delete 20:', deleted);
  console.log('Level order after delete:', tree.levelOrderTraversal());
  console.log([tree.root])
}

// Export classes if needed
module.exports = { Node, BinaryTree };
