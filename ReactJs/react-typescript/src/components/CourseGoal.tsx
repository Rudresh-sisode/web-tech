import { type FC, type PropsWithChildren ,type ReactNode } from "react";
// interface CourseGoalDefination{
//   title: string;
//   children:ReactNode
// }

type CourseGoalDefination = PropsWithChildren<{ title: string }>;


/**
 * 
 *
 * FC type
 * const CourseGoal:  = ({title,children})=>{
 * 
 * }
 */

// const CourseGoal:FC<CourseGoalDefination> = ({title,children})=>{
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

// export default CourseGoal ; // giving freedom to this component