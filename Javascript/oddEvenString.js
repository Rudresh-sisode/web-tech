function sortMyString(S) {
    let str1 = "";
    let str2 = "";
    str1+=S[0]
    for(let i = 1; i < S.length; i++){
      i % 2 == 0 ? str1+=S[i] : str2+=S[i]
    }
      return str1+" "+str2;
  }
  
  let abc = sortMyString("YCOLUE'VREER");
  console.log("your abc ",abc)