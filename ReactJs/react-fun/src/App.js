import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useReducer, useRef } from 'react';


const [firstCity, secondCity ] = ["Jamner","Jemuner","Jalgaon"];

function useInput(initialValue){
  const  [value, setValue] = useState(initialValue);
  return [
    {
      value,
      onChange:(e) => setValue(e.target.value)
    },
    () => setValue(initialValue)
  ];

}

function App({state}) {
  // const [check, setChecked] = useState(false);
  // const [check, setChecked] = useReducer((checked)=> !checked, false)

  // const txtTitle = useRef();
  // const hexColor = useRef();

  const [titleProps,resetTitle] = useInput("")
  const [color,setColor] = useState("#000000");



  const submit = (e) =>{
    e.preventDefault();
    // const title = txtTitle.current.value;
    // const color = txtTitle.current.value;

    alert(`${titleProps.value},${color}`);
    // setTitle("");
    setColor("#000000")
  };

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input
        // ref={txtTitle}
        value={titleProps.value}
       
        type='text'
        placeholder='color title...'
        />
        <input
        {...titleProps}
        // ref={hexColor }
        value={color}
        // onChange={(event)=>setColor(event.target.value)}
        type='color'
        />

        <button>ADD</button>
        
      </form>
    </div>
  );
}

export default App;
