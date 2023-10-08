import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';


const [firstCity, secondCity ] = ["Jamner","Jemuner","Jalgaon"];



function App({state}) {
  const [emotion,setEmotion] = useState("Helow ");

  const [secondary,setSecondary]  = useState("tired");
  useEffect(()=>{
    console.log('your emotions  ',emotion)
  },[emotion]);
  

  return (
    <div className="App">
      <h1>
        Welcome to the {state } reactjs {emotion}
      </h1>
      <button onClick={()=>{
        setEmotion("Sad");
      }}>
        Sad
      </button>
      <button onClick={()=>{
        setEmotion("Excited");
      }}>
        Excited
      </button>
      <h2>
        current secondary emotion is {secondary}
      </h2>
      <button onClick={()=>{
        setSecondary("Greatful");
      }}>
        Greatfull
      </button>
    </div>
  );
}

export default App;
