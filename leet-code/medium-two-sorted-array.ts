function findMedianSortedArrays(nums1: number[], nums2: number[]) {
  
    const array = nums1.concat(nums2).sort((a,b) => a -b)
     const len = array.length;
    if (len % 2 === 0) {
        // Even length: average of two middle numbers
    
        return (array[len / 2 - 1] + array[len / 2]) / 2;
    } else {
        // Odd length: middle number
        return array[Math.floor(len / 2)];
    }


};
/**
 * , nums2 = 
 */

console.log(findMedianSortedArrays([2,2,4,4],[2,2,2,4,4]));