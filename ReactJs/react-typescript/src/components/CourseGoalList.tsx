import CourseGoal from "./CourseGoal"
import { type CourseGoal as CourseGoalDefination } from "../App"
type CourseGoalListDefination = {
  goals: CourseGoalDefination[];
  onDeleteGoal: (id: number) => void;
}

export default function CourseGoalList({goals,onDeleteGoal}:CourseGoalListDefination) {
  return (
    <ul>
      {
        goals.map((goal) => (
          <li key={goal.id}>
            <CourseGoal title={goal.title} id={goal.id} onDelete={onDeleteGoal}>
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