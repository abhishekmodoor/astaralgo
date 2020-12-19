/**
 * This class defines a min binary heap with push and pop. The constructor takes in a "getPriority" function that ranks each element T
 */
export default class BinaryHeap<T> {
    private heap: (T|undefined)[];
    private getPriority: (x: T|undefined) => number;

    constructor(getPriority: (x: T|undefined) => number) {
        this.heap = []
        this.getPriority = getPriority
    }

    // This method pushes something onto the heap 
    heapPush(val: T) {
        // add val to the bottom of the array
        this.heap.push(val);
        // bubble up the value 
        let currentIndex = this.heap.length-1
        let currentValue = this.heap[currentIndex]
        let currentValuePriority = this.getPriority(currentValue)
        while (currentIndex > 0) {
            // grab parent information
            let parentIndex = Math.floor((currentIndex + 1) / 2) - 1
            let parentValue = this.heap[parentIndex]
            // break if current priority is lower than parent 
            if (currentValuePriority >= this.getPriority(parentValue))
                break;

            this.heap[parentIndex] = currentValue;
            this.heap[currentIndex] = parentValue;
            currentIndex = parentIndex;
        }
    }

    // This method pops the top value of the heap and heapifies 
    heapPop(): T|undefined {
        let result = this.heap[0];
        let end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            // sink down the rest of the values 
            let currentIndex = 0;
            let currentValue = this.heap[currentIndex];
            let currentValuePriority = this.getPriority(currentValue);
            while(true) {
                // find children
                let child1Index = (currentIndex + 1) * 2;
                let child2Index = child1Index - 1;
                let swap = null;
                // check child 1
                if (child1Index < this.heap.length) {
                    let child1Value = this.heap[child1Index]
                    let child1Priority = this.getPriority(child1Value);
                    if (child1Priority < currentValuePriority)
                        swap = child1Index;
                }
                // check child 2
                if (child2Index < this.heap.length) {
                    let child2Value = this.heap[child2Index]
                    let child2Score = this.getPriority(child2Value);
                    if (child2Score < (swap === null ? currentValuePriority : 
                        this.getPriority(this.heap[swap ? swap : 1])))
                        swap = child2Index;
                }

                // break if done
                if (swap == null) break;

                // continue 
                this.heap[currentIndex] = this.heap[swap];
                this.heap[swap] = currentValue;
                currentIndex = swap;
            }
        }
        return result;
    }

    // This method peeks on the value at the top of the heap
    peek() {
        return this.heap[0]
    }
}