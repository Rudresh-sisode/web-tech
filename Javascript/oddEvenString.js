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


  
   // #Approch 2
    const sortMyString = s => {
    let even = s.split('').filter((v, i) => i % 2 === 0).join('')
    let odd = s.split('').filter((v, i) => i % 2 !== 0).join('')
    return even + ' ' + odd
   } 
   

    /**
     * approched 3
     * 
     * 
     * function sortMyString(S) {
        let even = [], odd = [];
        S.split('').forEach((e, i) => { i % 2 === 0 ? even.push(e) : odd.push(e) })
        return `${even.join('')} ${odd.join('')}`;
      }
     */

      /**
       * approach 4
       * function sortMyString(S) {
        let evenS = S.split('').filter((x,i) => i % 2).join('')
        let oddS = S.split('').filter((x,i) => !(i % 2)).join('')
        return oddS + ' ' + evenS
      }
       */
  //answer is avaialable in javascript