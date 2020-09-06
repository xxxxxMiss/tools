/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrderBottom = function(root) {
  let level = 0
  const dfs = (root, ans) => {
    if (!root) {
      return
    }
    level++
    dfs(root.left, ans)
    dfs(root.right, ans)
    ;(ans[level] || (ans[level] = [])).push(root.val)
    level--
  }
  const ans = [] 
  dfs(root, ans, 0)
  //return ans
};

/*
 *levelOrderBottom()
*/
