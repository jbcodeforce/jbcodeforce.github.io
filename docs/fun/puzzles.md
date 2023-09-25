# Coding interview and fun problems to solve

Source of common software engineering problems to study and play with:

* [geeks for geeks](https://www.geeksforgeeks.org)
* [leet code](https://leetcode.com/)

## Big O notation

* inserting element in an unordered array is constant time. It is not link to the number of element in the array. Time is = K a basic constant linked to compilor, microprocessor speed...
* linear search is proportional to N. The search time T = K * N/2 on average
* binary search is log(N): T = log base 2(N) but as any log  is related to any other by a constant (3.322 to go from base 2 to base 10), we can say T = log(N). doubling the N will add only one step of processing. Time follows a log.
* The quasilinear time of O(n.log n) is worse than O(n) but better than O(N^2)
O(N) is the same as T = K .N   O for "Order of"

[Big O - good article from HappyCoder](https://www.happycoders.eu/algorithms/big-o-notation-time-complexity/).

## Review Sorting

Java Arrays class offers different sort methods.

To sort any custom object, we need to implement the interface java.lang.Comparable. Or gives a comparator to the sort method.

```java
public static final Comparator<Customer> NAME_COMPARATOR = Comparator
    .comparing(Customer::getLastName)
    .thenComparing(Customer::getFirstName);
```

[Sorting algorithm review](https://www.happycoders.eu/algorithms/sorting-algorithms/)
[Sorting in Java from Happy coder.](https://www.happycoders.eu/algorithms/sorting-in-java/)

* For many sorting algorithms, the additional memory requirement is independent of the number of elements to be sorted.
* In stable sorting methods, the relative sequence of elements that have the same sort key is maintained.
* A recursive sorting algorithm requires additional memory on the stack
* **Quicksort, merge sort, heap sort** are in O(n log n) where the **insertion sort, selection sort and bubble sort** are in O(n^2) on average.
* Counting sort is a particular sorting algorithm in O(n + k): k = number of possible values. 

* [Quicksort](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/otherpuzzles/src/main/java/jbcodeforce/fun/sorting/QuickSort.java) works according to the "divide and conquer" principle. The data set is divided into small and large elements: small elements move to the left, large elements to the right. Each of the created partitions is then recursively partitioned again until a partition contains only one element and is therefore considered sorted.
* **Heap sort**: utilizes the heap data structure to perform comparison-based sorting. Heap sort is an in-place algorithm. Heap can be represented by an array and then if the parent node is at index i, then the left child node is at 2i+1 and the right child is at 2i+2. Using a maxheap. We will swap the first element, i.e., the largest element with the last element of the heap, and then reduce the size of the heap by 1. Once we have successfully done that, we will call the heapify method for the root of the tree. We will then repeat this step until the size of the heap is greater than 1. 
The time complexity of heap sort is O(nlog(n)). See code [HeapSort class](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/tree-play/src/main/java/jbcodeforce/fun/tree/HeapSort.java)

* Merge two sorted lists, [see example using iteration or recursion](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/otherpuzzles/src/main/java/jbcodeforce/fun/sorting/MergeTwoSortedList.java).


## Basic problems from leetcode

### roman to integer

* Transform a string representing a [roman number to its integer value](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/otherpuzzles/src/main/java/jbcodeforce/fun/basic/RomanToInteger.java)

### Palindrome

* Verify a string with digits in it,  [to be a palindrome?](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/otherpuzzles/src/main/java/jbcodeforce/fun/basic/Palindrome.java) Given the head of a singly linked list, return true if it is a palindrome.

### String with only char

* Search if a string includes only alphabet using lambda function.

???- "Solution"
    ```java
    public static boolean isStringOnlyAlphabet(String str)
        {
            return (
                (str != null) && (!str.equals(""))
                && (str.chars().allMatch(Character::isLetter)));
        }
    ```

* Generic function to remove element in a list that matches a predicate. 

???- "Solution"
    ```java
        public static <T> List<T>
        removeUsingIterator(List<T> l, Predicate<T> p) {
            Iterator<T> itr = l.iterator();
            while (itr.hasNext()) {
                T t = itr.next();
                if (!p.test(t)) {
                    itr.remove();
                }
            }
            return l;
        } 

    // Creating a Predicate condition checking for null
    Predicate<String> isNull = item -> Objects.nonNull(item);
    ```

### Fibonacci sequence 

f(n) = f(n-2) + f(n-1)

Can be used in different problem, like finding the combinaison of steps to climb a staircase of N steps.

```python
def staircase(n):
    if n <= 1:
        return 1
    return staircase(n - 1) + staircase(n - 2)
```

## Array play

Sources of information:

* [IQ opengenus - array problems](https://iq.opengenus.org/list-of-array-problems/)
* Dynamic array means we double the size of the array when the size and the number of elements in the arrays are equals. So resize needs to create a temp array and then copy existing content to the temp array (with double size) and then return the temp array.


To represent a dynamic array that can extend at less memory footprint, is to use the Hash Arrays Tree, which is a 2 dimension arrays with 2^x elements in each dimensions.

### Binary search

Take middle index, go left if node.value < a[idx] or right otherwise. Use recursion and test lowerIdx > highIdx as exit with not found. Return the idx of the element in the array.

```java
        int[] a = {1,2,3,4,5,6,7,8,9};
        BinarySearch search = new BinarySearch();
        Assertions.assertEquals(0,search.find(a,1));
        Assertions.assertEquals(4,search.find(a,5));
```

See code [BinarySearch.java](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/tree-play/src/main/java/jbcodeforce/fun/search/BinarySearch.java)

### Find the least frequent element presents in an array

Use HashMap to keep the count, and go over the element one at a time. Ex in python:

```python
def findLeastFreqElementOptimized(c):
    d = {}
    for i in range(len(c)):
        if (c[i] in d.keys()):
            d[c[i]] += 1
        else:
            d[c[i]] = 1
    leastElementCount = min(d.values())
    for i in d:
        if d[i] == leastElementCount:
            leastElement = i
            break
    return leastElement,leastElementCount
```

### Snapshot array

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

### Reverse a linkedList

Need to keep previous, current, and currentNext pointers.

[InverseLinkedList](https://github.com/jbcodeforce/java-studies/tree/master/data-structure-play/tree-play/src/main/java/jbcodeforce/fun/tree/InverseLinkedList.java)

???- "Solution"
    ```java
    while (current != null) {
                Node nextOfCurrent = current.next;
                current.next = previous;
                previous = current;
                current = nextOfCurrent;
            }
            Node reversedList = previous;
    ```
### Find the tuple from two arrays that the sum of their number are closed to a target number

A = [-1, 3, 8,  2, 9,  5]
B = [ 4, 1, 2, 10, 5, 20]
Target 24 . response -> (5,20) or (3,20)
A and B have same size. Not ordered.

* Brute force solution: compute each pair based on element of (A,B)- Which is a O(N^2), sort them by their sum and find where the target is in the sorted collection, take the exact sum or the left and right elements as the closest to the target.
* Think to a simpler problem by searching what is the expected number to get the target by searching in A for each value of (target - b). The following solution is in O(N)

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

Final solution is to sort the two arrays and then walk the matrix from the one of the highest number. The sort could is in O(n.log(n)) and then go over the matrix will be O(n) 

    ```java
    sort(A), sort(B)

    for (i = A.size() - 1; i > 0; i--) {
        if ((A[i] + B[i]) < target) return;
    }
    ```

## Binary tree

A tree with node having value, left and right branches. It can keep order at insertion time.

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
* See a very complete example of [BinaryTree class in java + test cases](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/tree-play/src/test/java/jbcodeforce/fun/tree/TestBinaryTree.java).


Special binary tree is the [heap](https://en.wikipedia.org/wiki/Heap_(data_structure)) which includes as root the highest priority node.  In a max heap, for any given node C, if P is a parent node of C, then the key (the value) of P is greater than or equal to the key of C. In a min heap, the key of P is less than or equal to the key of C.


### Traversing Graph or tree

There are three different orders for traversing a tree using DFS:

* In **preorder traversal**, we traverse the root first, then the left and right subtrees. It uses recursion. If we use iteration we need to use a stack and use the following algorithm
        
    * Push root in our stack
    * While stack is not empty

        * Pop current node
        * Visit current node
        * Push right child, then left child to stack
    
* For **Inorder Traversal** we traverse the left subtree first, then the root, then finally the right subtree. This keeps the order of the elements in the tree.
* In **postorder traversal**, we traverse the left and right subtree before we traverse the root.

See Java code [Node.java](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/tree-play/src/main/java/jbcodeforce/fun/graph/Node.java)

The main difference between graphs and trees is that graphs may contain cycles.

See Java code [Graph.java](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/tree-play/src/main/java/jbcodeforce/fun/graph/Graph.java)

* Breadth first search: [In python Graph.py](https://github.com/jbcodeforce/python-code/blob/a518d030f28b5ae51833f04f01df5ba87ee0bcc9/algorithms/Graph.py#L81) explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.
* Depth first search [In Python](https://github.com/jbcodeforce/python-code/blob/a518d030f28b5ae51833f04f01df5ba87ee0bcc9/algorithms/Graph.py#L62): go over the branches of the graph from a root and visit all vertex by going farther from the root
as possible. The return parameter is a list of vertex visited, in their order of visit
    
    * rule 1: add non visited neighbors in a LIFO stack.
    * rule 2: when on a vertex with no more neighbor visited then pop one vertex from the stack
    * rule 3: when there is no more vertex to traverse, the stack is empty

### Example of problems involving traversing a tree

* Sum of all the numbers that are formed from root to leaf paths: Path: 6->3->2 : 632  then Path 6 -> 3 ->5 ->2: 6352 + 632 total is 6984.
The idea is to do a preorder traversal of the tree. In the preorder traversal, keep track of the value calculated till the current node, let this value be val. For every node, we update the val as val*10 plus node’s data

* Calculate depth of a full Binary tree from Preorder: The tree is represented by a string like "nlnnlll" for node n and leaf l. 
* Get size with recursion: at each node the size of the node is the current level + the left and right size.

???- "Solution"
    ```java
    public int getSize() {
        return getSizeRecursive(root);
    }

    private int getSizeRecursive(IntNode current) {
        return current == null ? 0 : getSizeRecursive(current.left) + 1 + getSizeRecursive(current.right);
    }
    ```
### Binary search tree

The BST has an important property: every node’s value is strictly greater than the value of its left child and strictly lower than the value of its right child. It does not allow duplicate values.
Binary Search Tree can be either balanced and unbalanced.

Suppose n to be the number of nodes in a BST. The worst case of the insert and remove operations is O(n). But, in a balanced Binary Search Tree, for instance, in AVL or Red-Black Tree, the time complexity of such operations is O(log(n)).

The other major fact is that building BST of n nodes takes O(n * log(n)) time. We have to insert a node n times, and each insertion costs O(log(n)). The big advantage of a Binary Search Tree is that we can get traverse the tree and get all our values in sorted order in O(n) time


### Minimum spanning tree

* Minimum spanning tree: [In Python](https://github.com/jbcodeforce/python-code/blob/a518d030f28b5ae51833f04f01df5ba87ee0bcc9/algorithms/Graph.py#L31) A path in the graph going to all nodes by using the less costly edges. The return structure is a list of vertex in the order of navigation from the root.

    * find neighbour of current vertex connected by the lowest edge weight still in the queue

A graph is a set of vertex and edge with a weight.


### Maxium path sum of a binary tree.

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

### Find the maximum sum from leaf to root path in a Binary Tree

Use traversal of the tree left and right at each node. At each node select the max sum to reach 
this node from its leaves so far. it is the max between right or left branches.
Here is the recurring implementation. (See [TestLeafToRootMaxSum class](https://github.com/jbcodeforce/java-studies/tree/master/fun-interviews/maxPathSum/src/test/java/jbcodeforce/fun/maxpathsum/TestLeafToRootMaxSum.java).

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

### Find your appartment location in a street 

Looks at each block and try to minimize the distance between your needed requirements in term of school, gym, store. The distance is zero if your block has the needed requirement, or the minimum distance to the closed one from your block.

The cost is to find the mininum of the maximum distance between a block and the needed requirement.

See implementation in [SearchBestBlock](https://github.com/jbcodeforce/java-studies/tree/master/fun-interviews/maxPathSum/src/main/java/jbcodeforce/fun/block/SearchBestBlock.java)

### Inverting a binary tree

Given a binary tree move left and right branches at every node level. It is simple with recursion:

* Call invert for left-subtree.
* Call invert for right-subtree.
* Swap left and right subtrees.

```java
    Node invert(Node node) 
	{ 
		if (node == null) 
			return node; 

		/* recursive calls */
		Node left = invert(node.left); 
		Node right = invert(node.right); 

		/* swap the left and right pointers */
		node.left = right; 
		node.right = left; 

		return node; 
	}   
```
## Heap

[Heap](https://en.wikipedia.org/wiki/Heap_(data_structure)) is a Complete Binary Tree. A node is at level k of the tree if the distance between this node and the root node is k. 
The level of the root is 0. The maximum possible number of nodes at level k is 2^{k}. At each level of a Complete Binary Tree, it contains the maximum number of nodes. But, except possibly the last layer, which also must be filled from left to right.

Heap is not an ordered data structure, as it is balanced. Heap allows duplicates.

It is a tree that satisfies the heap property: 

* **max heap** for any given node C, if P is a parent node of C, then the key (the value) of P is greater than or equal to the key of C 
* **min heap** P key is lower than the key of C

In an array, where the heap nodes are stored, the children of a node at index i are nodes at indices 2 * i + 1 and 2 * i + 2.

we can build a Heap in O(n * log(n)) time. But, there exists an algorithm, which allows building a Heap in O(n) time. The insert and remove operations cost  O(log(n)).

However, the Heap is an unordered data structure. The only possible way to get all its elements in sorted order is to remove the root of the tree n times. This algorithm is Heap Sort and takes O(n * log(n)) time.

Java implements these structures with the PriorityQueue and the TreeMap. 

[MaxHeap code](https://github.com/jbcodeforce/java-studies/blob/master/data-structure-play/tree-play/src/main/java/jbcodeforce/fun/tree/MaxHeap.java)

[Good article](https://www.baeldung.com/cs/heap-vs-binary-search-tree)