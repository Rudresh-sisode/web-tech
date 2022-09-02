exports.sortResourceData =(data)=>{
    
    if(data.length == 0){
      return []
    }
    let storedArray = []
    let abc = true;
    
    for(let i = 0; i<data.length; i++){
      for(let j = i+1; j < data.length; j++){
     
        let obj = {};
        
        if(data[i]["resource_value"] == data[j]["resource_value"]){
          obj["resource"] = data[j]["resource_value"];
          obj["action"] = [data[i]["action_value"],data[j]["action_value"]];
          storedArray.push(obj)
          data[j]['check'] = false;
          abc = false;
          
          break;
        }
        abc = true;
  
      }
      let obj = {}
      if(abc == true && !data[i].hasOwnProperty('check')){
        obj['resource'] = data[i]['resource_value'];
        obj['action'] = [data[i]['action_value']];
        storedArray.push(obj)
      }
    }
    // console.log("your array ",storedArray);
    return storedArray;
  }