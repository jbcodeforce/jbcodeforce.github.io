# Interview and fun problems to solve

## Big O notation

* inserting element in an unordered array is constant time. It is not link to the number of element in the array. Time is = K a basic constant linked to compilor, microprocessor speed...
* linear search is proportional to N. The search time T = K * N/2 on average
* binary search is log(N): T = log base 2(N) but as any log  is related to any other by a constant (3.322 to go from base 2 to base 10), we can say T = log(N)

O(N) is the same as T = K .N   O for "Order of"

## binary search

Take middle index, go left is value < a[idx] or right otherwise. Use recursivity and test with lowerIdx > highIdx as exit with not found. Return the idx of the element in the array.

[BinarySearch.java](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/tree-play/src/main/java/jbcodeforce/fun/search/BinarySearch.java)

## Binary tree

Binary tree helps to have efficient search in O(log(N)) as the binary search does, and have efficient insert and delete operations as a LinkedList does. Adding an element in a sorted array is costly as we have to move, on average, N/2 elements.

* [Tree traversal in Python](https://github.com/jbcodeforce/python-code/blob/master/algorithms/traversal.py) to visit each node of a binary tree exactly once. The approach is:

    * use a recursive method to go from the left branch of the node down to the leaf. then go up to the right branch. Keep the list of visited nodes as part of the recurring function.
    * or append to the list of visited nodes only at the leaf level.

    ```python
        def PostOrderTraversal(self, nodes):
            if (self.getLeft() is not None):
                self.getLeft().PostOrderTraversal(nodes)
            if (self.getRight() is not None):
                self.getRight().PostOrderTraversal(nodes)
            nodes.append(self.getValue())
            return nodes
    ```

* [Same approach, different implementation, of the binary tree traversal in python](https://github.com/jbcodeforce/python-code/blob/master/algorithms/traversalbinarytree.py)

### Travering Graph or tree

There are three different orders for traversing a tree using DFS:

    * In **preorder traversal**, we traverse the root first, then the left and right subtrees. It uses recursion. If we use iteration we need to use a stack and use 
        
        * Push root in our stack
        * While stack is not empty

            * Pop current node
            * Visit current node
            * Push right child, then left child to stack
    
    * For **Inorder Traversal** we traverse the left subtree first, then the root, then finally the right subtree.
    * in **postorder traversal**, we traverse the left and right subtree before we traverse the root.

See Java code [Node.java](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/tree-play/src/main/java/jbcodeforce/fun/graph/Node.java)

The main difference between graphs and trees is that graphs may contain cycles.

See Java code [Graph.java](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/tree-play/src/main/java/jbcodeforce/fun/graph/Graph.java)

* Breadth first search: [In python Graph.py](https://github.com/jbcodeforce/python-code/blob/a518d030f28b5ae51833f04f01df5ba87ee0bcc9/algorithms/Graph.py#L81) explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.
* Depth first search [In Python](https://github.com/jbcodeforce/python-code/blob/a518d030f28b5ae51833f04f01df5ba87ee0bcc9/algorithms/Graph.py#L62): go over the branches of the graph from a root and visit all vertex by going farther from the root
as possible. The return parameter is a list of vertex visited, in their order of visit
    
    * rule 1: add non visited neighbors in a LIFO stack.
    * rule 2: when on a vertex with no more neighbor visited then pop one vertex from the stack
    * rule 3: when there is no more vertex to traverse, the stack is empty

* See DFS in Java: 

* Minimum spanning tree: [In Python](https://github.com/jbcodeforce/python-code/blob/a518d030f28b5ae51833f04f01df5ba87ee0bcc9/algorithms/Graph.py#L31) A path in the graph going to all nodes by using the less costly edges. The return structure is a list of vertex in the order of navigation from the root.

    * find neighbour of current vertex connected by the lowest edge weight still in the queue

A graph is a set of vertex and edge with a weight.

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

## Find the maximum sum from leaf to root path in a Binary Tree

Use traversal of the tree left and right a each node. At each node select the max sum to reach 
this node from its leaves so far. it is the max between right or left branches.
Here is the recurring implementation. (See [class](https://github.com/jbcodeforce/java-studies/tree/master/fun-interviews/maxPathSum/src/test/java/jbcodeforce/fun/maxpathsum/TestLeafToRootMaxSum.java).

```java
public int maxSumLeafToRoot(Node currentNode, List<Node> path) {
        if (currentNode != null) {
            List<Node> leftPath = new ArrayList<Node>(); // use to accumulate the path
            int leftSum = maxSumLeafToRoot(currentNode.left, leftPath) + currentNode.value;
            List<Node> rightPath = new ArrayList<Node>();
            int rightSum = maxSumLeafToRoot(currentNode.right, rightPath) + currentNode.value;
            if (leftSum > rightSum) {
                path= leftPath;
                path.add(currentNode);
                return leftSum;
            } else {
                path = rightPath;
                path.add(currentNode);
                return rightSum;
            }
           
        }
        // leaf
        return 0;
    }
```

## Find your appartment location in a street 

Looks at each block and try to minimize the distance between your needed requirements in term of school, gym, store. The distance is zero if your block has the needed requirement, or the minimum distance to the closed one from your block.

The cost is to find the mininum of the maximum distance between a block and the needed requirement.

See implementation in [SearchBestBlock](https://github.com/jbcodeforce/java-studies/tree/master/fun-interviews/maxPathSum/src/main/java/jbcodeforce/fun/block/SearchBestBlock.java)

## Reverse a linkedList

[InverseLinkedList](https://github.com/jbcodeforce/java-studies/tree/master/data-structure-play/tree-play/src/main/java/jbcodeforce/fun/tree/InverseLinkedList.java)

## Find the tuple from two arrays that the sum of their number are closed to a target number

A = [-1,3, 8, 2, 9, 5 ]
B = [4,1 ,2, 10, 5, 20]
Target 24 . response -> (5,20) or (3,20)
A and B have same size.

* Bruce force solution: compute each pair based on element of (A,B)- Which is a O(N^2), sort them by their sum and find where the target is in the sorted collection, take the exact some or the left and right elements of the closest to the target.
* Think to a simpler problem by searching what is the expected number to get the target by searching in A for each value of target - b. The following solution is in O(N)

    ```java
    HashSet aSet = new HashSet(A);
    for (int b : B) {
        int n = target - b
        if (aSet.contains(n) {
            return (b,n)
        }
    }
    ```
    if we can not find then change the target by increase and then decreasing it and retry. In this case the algo is in O(x.n).

* Think of the problem with simpler samples. 
* Try to visualization in a matrix or a tree

Final solution will look like using sorting the two arrays and walk the matrix from the one of the highest number. The sort could in in O(n.log(n)) and then go over the matrix will be O(n) 

    ```
    sort(A), sort(B)

    for (i = A.size() - 1; i > 0;)
    ```

## Fibonacci sequence  is

f(n) = f(n-2) + f(n-1)

Example of finding the combinaison of steps to climb a staircase of N 

```python
def staircase(n):
    if n <= 1:
        return 1
    return staircase(n - 1) + staircase(n - 2)
```

## Inverting a binary tree

Given a binary tree move left and right branches at every node level.