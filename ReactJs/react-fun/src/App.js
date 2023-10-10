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
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://api.github.com/users/Rudresh-sisode')
    .then((response)=> response.json())
    .then(setData)
    .then(() => setLoading(false))
    .catch(setError)
  },[]);

  if(loading){
    return <h1>Loading...</h1>
  }
  if(error){
    return <pre>{JSON.stringify(error,null,2)}</pre>
  }
  if(!data){
    return null;
  }
    return <GithubUser name={data.name} />
  

}

export default App;
