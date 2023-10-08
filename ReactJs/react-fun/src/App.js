import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useReducer, useRef } from 'react';


const [firstCity, secondCity ] = ["Jamner","Jemuner","Jalgaon"];



function App({state}) {
  // const [check, setChecked] = useState(false);
  // const [check, setChecked] = useReducer((checked)=> !checked, false)

  const txtTitle = useRef();
  const hexColor = useRef();

  const submit = (e) =>{
    e.preventDefault();
    const title = txtTitle.current.value;
    const color = txtTitle.current.value;

    alert(`${title},${color}`);
  };

  return (
    <div className="App">
      <form onSubmit={submit}>
        <input
        ref={txtTitle}
        type='text'
        placeholder='color title...'
        />
        <input
        ref={hexColor }
        type='color'
        />

        <button>ADD</button>
        
      </form>
    </div>
  );
}

export default App;
