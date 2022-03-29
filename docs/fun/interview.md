# Interview and fun problems to solve

## Binary tree traversal

* [Python example](https://github.com/jbcodeforce/python-code/blob/master/algorithms/traversal.py)
* [binary tree traversal in python](https://github.com/jbcodeforce/python-code/blob/master/algorithms/traversalbinarytree.py)

## Snapshot array

Implement an optimized approach to take a snapshot of the array of int and returns the snap_id.
**Contract:**

```java
SnapshotArray snapshotArr = new SnapshotArray(3); // set the length to be 3
snapshotArr.set(0,5);  // Set array[0] = 5
snapshotArr.snap();  // Take a snapshot, return snap_id = 0
snapshotArr.set(0,6);
snapshotArr.get(0,0);  // Get the value of array[0] with snap_id = 0, return 5
```

???- "Solution"
    Code is in [Java Study fun-interview - snapshot-array](https://github.com/jbcodeforce/java-studies/tree/master/fun-interviews/snapshot-array). 
    Use a list of list of value, idx (a node). The first list is for snapshot, the second is a list of nodes with value not equals to zero. When the snap shot is not done yet, use the source value. Else get
    the list for a given snapshot and search for the given idx, return the matching value or zero.

## Maxium path sum of a binary tree.

Given a binary tree, find the maximum path sum. The path may start and end at any node in the tree.
Examples: 

```
Input: Root of below tree


       1
      / \
     2   3
Output: 6
```

Or

```
Input:
     10
    /  \
   2   -25
  / \  /  \
 20 1  3  4
Output: 32
```

Time Complexity: O(n) where n is number of nodes in Binary Tree.

???- "Solution"
    Use binary tree of node with value, left, right sub nodes. Build a recursive approach to traverse the tree deep first.  At each node
    compute the  max between the two children with current value and the current value, this is the value at that node for parent.
    As part of the recursion as we want to keep the max path sum, we need to keep this value outside of the tree traversal. 
    
    ```java
       public int maxPathSum(Node currentRootNode, Result result) {
 
        if (currentRootNode == null) return 0;
        
        int leftResult = maxPathSum(currentRootNode.left,result);
        int rightResult = maxPathSum(currentRootNode.right,result);
        // max path sum of this node for a parent of this node
        int max_single = Math.max(Math.max(leftResult, rightResult) + currentRootNode.value, currentRootNode.value);
   
        int max_top = Math.max(max_single, leftResult + rightResult + currentRootNode.value);
        // Store the Maximum Result.
        result.value = Math.max(result.value, max_top);

        return max_single;
    }
    ```
    See code in [Java Study fun-interview - maxPathSum](https://github.com/jbcodeforce/java-studies/tree/master/fun-interviews/maxPathSum). 