// import ArrayFunctionChoosen from "./array-methods";
let arrayMethod = ['from', 'fromAsync', 'isArray', 'Array.of','iterator','push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
//set the array method to select element
let select = document.getElementById('array-select');

arrayMethod.forEach((method) => {
  let option = document.createElement('option');
  option.value = method;
  option.innerHTML = method;
  select.add(option);
});

function clickEventAction() {
  //get the values from the input bos
  let input = document.getElementById('array-input');
  let inputValue = input.value;

  //get the value from the select element
  let select = document.getElementById('array-select');
  let userSelectedMethod = select.value;

  if(inputValue.length === 0){
    alert('Please enter the value in the input box');
    return;
  }

  //check if the inputValue is comma separated numbers or not
  let regex = /^(\d+,)*\d+$/;
  if (!regex.test(inputValue) && userSelectedMethod !== 'Array.of') {
    alert('Please enter the comma separated numbers');
    return;
  }

  let inputArray = [];
  if (userSelectedMethod !== 'Array.of') {
    inputArray = Array.from(inputValue.split(','), x => +x);
    console.log('user input', inputArray);
  }
  else {
    inputArray = inputValue.split(',');
    // console.log('user input ', inputArray);
  }
  //get the value from the string and convert it to array of number
  
  ArrayFunctionChoosen(userSelectedMethod, inputArray);
}

function ArrayFunctionChoosen(f_name, inputArray) {
  switch (f_name) {
    case 'from':
      let arrayResult = Array.from(inputArray, x => x ** 2);
      let info = `apply from method to the array and return the squre of each element
      <br>
      Example:
      <br>
       let arrayResult = Array.from(inputArray, x => x ** 2);
      `;
      setTheContentOverDom(arrayResult, info);
      break;
    // case 'push':
    case 'fromAsync':
      const asynIter = (
        async function* () {
          for (let i = 0; i < 5; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            yield i;
          }
        }
      )();
      Array.fromAsync(asynIter).then((array) => console.log(array));
      setTheContentOverDom(`{
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      }`, `
        <pre><code>
        const asyncIterable = (async function* () {
          for (let i = 1; i <= 5; i++) {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
            const data = await response.json();
              yield data;
          }
        }) ();

        Array.fromAsync(asyncIterable).then((array) => console.log(array));
        </code></pre>
      `)
      break;
    case 'isArray':
      let isArrayResult = Array.isArray(inputArray);
      let isArrayInfo = `apply isArray method to the array and return the result
      <br>
      Example:
      <br>
       let isArrayResult = Array.isArray(inputArray);
      `;
      setTheContentOverDom(isArrayResult, isArrayInfo);
      break;
    case 'Array.of':
      let arrayOfResult = Array.of(inputArray);
      let arrayOfInfo = `apply Array.of method to the array and return the result
      <br>
      Example:
      <br>
       let arrayOfResult = Array.of(inputArray);
      `;
      setTheContentOverDom(arrayOfResult, arrayOfInfo);
      break;
    case 'iterator':
      const array1 = inputArray;
      const iterator1 = array1[Symbol.iterator]();
      console.clear();
      console.log("Iterable log");

      for(const value of iterator1){
        console.log(value);
      }

      setTheContentOverDom(`see the console`, `
        <pre><code>
        const array1 = inputArray;
      const iterator1 = array1[Symbol.iterator]();
      console.clear();
      console.log("Iterable log");

      for(const value of iterator1){
        console.log(value);
      }
        </code></pre>
      `)

  }
}

function setTheContentOverDom(result, info) {
  let resultDiv = document.getElementById('result-output');
  let infoDiv = document.getElementById('result-info');
  resultDiv.innerHTML = result;
  infoDiv.innerHTML = info;
}




