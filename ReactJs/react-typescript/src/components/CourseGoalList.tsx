import CourseGoal from "./CourseGoal"
import { type CourseGoal as CourseGoalDefination } from "../App"
type CourseGoalListDefination = {
  goals: CourseGoalDefination[]
}

export default function CourseGoalList({goals}:CourseGoalListDefination) {
  return (
    <ul>
      {
        goals.map((goal) => (
          <li key={goal.id}>
            <CourseGoal title={goal.title}>
              <p>
                {goal.description}
              </p>
            </CourseGoal>
          </li>
        ))
      }
    </ul>
  )
}