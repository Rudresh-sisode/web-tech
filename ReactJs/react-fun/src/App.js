import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useReducer, useRef } from 'react';

// const query = `
// query {
//   allLifts {
//     name,
//     elevationGain,
//     status
//   }
// }
// `

// const opts = {
//   method:"POST",
//   headers:{ "Content-Type":"application/json"},
//   body:JSON.stringify({query})
// }

// function GithubUser({name,elevationGain, status}){
//   return (
//     <div>
//       <h2>
//         {name} is learning React
//       </h2>
//       <p>
//         {elevationGain} {status}
//       </p>
//       {/* <img src={} height={150} alt='avatar'/> */}
//     </div>
//   )
// }

const dataLs = [{
    name:"asl-tera", elevation:45839
  },
  {
    name:"mount-everest",elevation:494884
  },
  {
    name:"Juna-gad", elevation:4599
  },
  {
    name:"Neah-Ghat", elevation:9048
  }
  ]

function List({data,renderItem,renderEmpty}){
  return !data.length ? (
    renderEmpty
  ) : (
    <ul>
      {
        data.map((item)=>(
          <li key={item.name}>
            {renderItem(item)}
          </li>
        ))
      }
    </ul>
  )
}

function App({state}) {
 
return (
        <List 
        data = {dataLs} 
        renderItem={(item)=>(
            <>
            {item.name} - {item.elevation} ft.
            </>
          )
        }
        renderEmpty={<p>No content available as of now!</p>}
  />
  )
   



  

}

export default App;
