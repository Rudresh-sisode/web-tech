import { type FC, type PropsWithChildren ,type ReactNode } from "react";
// interface CourseGoalDefination{
//   title: string;
//   children:ReactNode
// }

type CourseGoalDefination = PropsWithChildren<{ id: number; title: string; onDelete: (id: number) => void; }>;


/**
 * 
 *
 * FC type
 * const CourseGoal:  = ({title,children})=>{
 * 
 * }
 */

// const CourseGoal:FC<CourseGoalDefination> = ({title,children})=>{
export default function CourseGoal({ title,id, children , onDelete}: CourseGoalDefination) {
  return <article>
    <div>
      <h2>{title}</h2>
      {children}
      {/* <p>{description}</p> */}
    </div>
    <button onClick={()=> onDelete(id)}>DELETE</button>
  </article>
}

// export default CourseGoal ; // giving freedom to this component