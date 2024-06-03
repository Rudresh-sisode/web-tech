import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import './index.css'
import HomePg from './pages/HomePg.tsx'
import { BrowserRouter as Router, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {
      /* <App /> */
      <HomePg/>
    }
  </React.StrictMode>,
)
