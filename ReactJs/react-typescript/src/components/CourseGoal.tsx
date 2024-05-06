import { type PropsWithChildren ,type ReactNode } from "react";
// interface CourseGoalDefination{
//   title: string;
//   children:ReactNode
// }

type CourseGoalDefination = PropsWithChildren<{ title: string }>;

export default function CourseGoal({ title, children }: CourseGoalDefination) {
  return <article>
    <div>
      <h2>{title}</h2>
      {children}
      {/* <p>{description}</p> */}
    </div>
    <button>DELETE</button>
  </article>
}