import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import CourseGoalList from './components/CourseGoalList'
// import CourseGoal from './components/CourseGoal'
import Header from './components/Header'


export type CourseGoal = {
  title: string;
  description: string;
  id: number
}

function App() {

  const [goals, setGoals] = useState<Array<CourseGoal>>([]); 

  function handleAddGoal() {
    setGoals((prev) => {
      const newGoals: CourseGoal = {
        id: Math.random(),
        title: 'React with TS',
        description:'Learn it from depths'
      }
      return [...prev, newGoals]; 
    })
  }

  function handleDeleteGoal(id : number) {
    setGoals(prevGoal => prevGoal.filter((goal) => goal.id !== id));
  }

  return (
    <main>
      <Header image={{ src: viteLogo, alt: "react svg logo" }}>
        <h2>
          Your Course Goals
        </h2>
      </Header>

      <button onClick={handleAddGoal}>
        Add Goal
      </button>

      <CourseGoalList goals={goals } onDeleteGoal={handleDeleteGoal}/>


    </main>
  )
}

export default App
