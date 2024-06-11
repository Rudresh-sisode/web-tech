const maxTotalReward = (totalRewards)=>{

  //sort the totalRewards array in ascending order
  totalRewards.sort((a, b) => a - b);

  //initialize the maxTotalReward to 0
  let maxTotalReward = 0;

  //loop through the totalRewards array
  for(let i = 0; i < totalRewards.length; i++){

    //if the current totalReward is greater than or equal to the maxTotalReward
    if(totalRewards[i] >= maxTotalReward){

      //increment the maxTotalReward by 1
      maxTotalReward += totalRewards[i];
    }
  }

  //return the maxTotalReward
  return maxTotalReward;
}