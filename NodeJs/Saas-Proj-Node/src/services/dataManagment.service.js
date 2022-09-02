const generateName = (depValue) =>{
    if(depValue.length === 0){
        return "";
    }

    depValue.trim().split(" ").join("_")
}