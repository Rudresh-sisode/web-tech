function pyramid(n) {
    // your code here
    const Acontainer = [];
    for(let i = 0; i < n ; i++){
      const Aelement = new Array(1+i);
      for(let j = 0; j <= i; j++){
        Aelement[j] = 1;
      }
      Acontainer.push(Aelement)
    }
    return Acontainer;
  }

  //Approched 2

  function pyramid(n) {
    const res = [];
    for(let i = 0; i < n; i++){
      res.push([...Array(i+1)].fill(1))
    }
    return res;
  }


  const pyramid = n => Array(n).fill(1).map((x, i) => Array(i + 1).fill(1))