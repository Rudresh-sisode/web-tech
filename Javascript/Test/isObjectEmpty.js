// 
let isEmpty = function(obj) {
  if(Array.isArray(obj))  {
    return obj.length === 0;
  }
  else if(typeof obj === 'object'){
    return Object.keys(obj).length === 0;
  }
  return false
};