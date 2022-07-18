

let a = "lsedkfjaslfa;lsdkfjl";

let arr='aeiou'.split("");
let k=0;
for(let i=0; i<a.length; i++)
{
        if(a.charAt(i)==arr[k])
        {
            k++
        }
}
console.log(k++);