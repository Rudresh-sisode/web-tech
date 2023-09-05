function maxArea(height){
  
    let maxArea = 0;
    for(let left = 0; left < height.length; left++){
      for(let right = left+1; right < height.length; right++){
        let width = right - left;
        maxArea = Math.max(maxArea,Math.min(height[left],height[right]) * width);
      }
    }
    console.log('max area ',maxArea);
  }
  
  maxArea([1,8,6,2,5,4,8,3,7])