import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';


const [firstCity, secondCity ] = ["Jamner","Jemuner","Jalgaon"];



function App({state}) {
  const [check, setChecked] = useState(false);

  return (
    <div className="App">
      <input type='checkbox' value={check}
      onChange={()=>{
        setChecked(()=> !check
        )
      }}/>
      <label>
        {check ? 'checked' : 'not checked'}
      </label>
    </div>
  );
}

export default App;
