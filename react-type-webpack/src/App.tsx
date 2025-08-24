import "./styles.css";
import IMAGE from "./rc-leave.jpg"; 
import She from "./she-profile.svg";


export const App = ()=>{
  return <>
    <h1>React Typescript Webpack Starter { process.env.name}</h1>
    <img src={IMAGE} alt="Nature" width="300" height="200" />
    <img src={She} alt="Nature" width="300" />

  </>
}