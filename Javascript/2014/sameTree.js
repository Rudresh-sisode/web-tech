function TreeNode(val,left,right){
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null :left)
    this.right = (right === undefined ? null : right)
}


let isSameTree = function(p,q){
    if(p === null && q === null)
    return true;

    if(p  === null || q === null){
        return false;
    }

    if(p.val !== q.val){
        return false;
    }

    return isSameTree(p.left,q.left) && isSameTree(p.right,q.right);
}


let p = new TreeNode(  1);
p.left = new TreeNode( 3);
p.right = new TreeNode( 5);

let q = new TreeNode(1);
q.left = new TreeNode( 3);
q.right = new TreeNode( 5);

let result = isSameTree(p,q);
console.log(result);

isSameTree()
