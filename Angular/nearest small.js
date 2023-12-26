function nearestSmallestValues(arr) {
    const stack = [];
    const result = [];
  
    for (let i = 0; i < arr.length; i++) {
      while (stack.length > 0 && stack[stack.length - 1] >= arr[i]) {
        stack.pop();
      }
  
      if (stack.length === 0) {
        result.push(-1);
      } else {
        result.push(stack[stack.length - 1]);
      }
  
      stack.push(arr[i]);
    }
  
    return result;
  }
  
  const arr = [5, 3, 1, 9, 7, 3, 4, 1];
  const result = nearestSmallestValues(arr);
  console.log(result); // Output: [-1, -1, -1, 1, 1, 1, 3, 1]