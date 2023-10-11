import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useReducer, useRef } from 'react';
import { Link,Outlet } from 'react-router-dom';

export function Home(){
  return (
    <div>
      <nav>
        <Link to="/About" > About </Link>
      </nav>
      <h2>My websites </h2>
    </div>
  )
}

export function History(){
  return (
    <div>
      <h4>
        Our history
      </h4>
    </div>
  )
}

export function About(){
  return (
    <div>
      <h2>About  </h2>
      <Outlet/>
    </div>
  )
}

export function Contact(){
  return (
    <div>
      <h2>Contact </h2>
    </div>
  )
}

export function App({state}) {
 
return <h1>App</h1>

}

export default App;
