import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useReducer, useRef } from 'react';


function GithubUser({name}){
  return (
    <div>
      <h2>
        {name} is learning React
      </h2>
    </div>
  )
}

function App({state}) {
 
  const [data,setData] = useState(null);

  useEffect(() => {
    fetch('https://api.github.com/users/Rudresh-sisode')
    .then((response)=> response.json())
    .then(setData)
  },[]);

  if(data){
    // return <pre> {JSON.stringify(data,null,2)}</pre>
    return <GithubUser name={data.name} />
  }
  else{
    return (
      <h2>Hello, all</h2>
    );
  }

}

export default App;
