import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useReducer } from 'react';


const [firstCity, secondCity ] = ["Jamner","Jemuner","Jalgaon"];



function App({state}) {
  // const [check, setChecked] = useState(false);
  const [check, setChecked] = useReducer((checked)=> !checked, false)

  return (
    <div className="App">
      <input type='checkbox' value={check}
      onChange={setChecked}/>
      <label>
        {check ? 'checked' : 'not checked'}
      </label>
    </div>
  );
}

export default App;
