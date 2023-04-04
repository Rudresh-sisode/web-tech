// import { createReducer, on } from '@ngrx/store';
// import { Ingredient } from 'src/app/shared/ingredient.model';
// // import * as IngredientActions from './ingredient.actions';
// import * as IngredientActions from "./shopping-list.actions";

// export interface State {
//   ingredients: Ingredient[];
//   editedIngredient: Ingredient | null;
//   editedIngredientIndex: number | null;
// }

// const initialState: State = {
//   ingredients: [
//     { name: 'Apples', amount: 5 },
//     { name: 'Tomatoes', amount: 10 },
//   ],
//   editedIngredient: null,
//   editedIngredientIndex: null,
// };

// export const ingredientReducer = createReducer(
//   initialState,
//   on(IngredientActions.addIngredient, (state, { ingredient }) => ({
//     ...state,
//     ingredients: [...state.ingredients, ingredient],
//   })),
//   on(IngredientActions.addIngredients, (state, { ingredients }) => ({
//     ...state,
//     ingredients: [...state.ingredients, ...ingredients],
//   })),
//   on(IngredientActions.updateIngredient, (state, { ingredient }) => {
//     const updatedIngredients = state.ingredients.map((item, index) =>
//       index === state.editedIngredientIndex ? ingredient : item
//     );
//     return {
//       ...state,
//       ingredients: updatedIngredients,
//       editedIngredient: null,
//       editedIngredientIndex: null,
//     };
//   }),
//   on(IngredientActions.deleteIngredient, (state, { ingredient }) => ({
//     ...state,
//     ingredients: state.ingredients.filter((item) => item !== ingredient),
//     editedIngredient: null,
//     editedIngredientIndex: null,
//   })),
//   on(IngredientActions.startEdit, (state, { index }) => ({
//     ...state,
//     editedIngredient: { ...state.ingredients[index] },
//     editedIngredientIndex: index,
//   })),
//   on(IngredientActions.stopEdit, (state) => ({
//     ...state,
//     editedIngredient: null,
//     editedIngredientIndex: null,
//   }))
// );

// /**below are the old code */
// // import { Ingredient } from "src/app/shared/ingredient.model";
// // import * as ShoppingListActions from "./shopping-list.actions";
// // import { createReducer, on } from "@ngrx/store";

// // const initialState = {
// //     ingredients:  [
// //         new Ingredient('Apples', 5),
// //         new Ingredient('Tomatoes', 10),
// //       ]
// // }

// // export const shoppingListReducer = createReducer(initialState,
// //     on(ShoppingListActions.addIngredient,(state)=> ));

// // // export const counterReducer = createReducer(
// // //     initialState,
// // //     on(increment, (state) => state + 1),
// // //     on(decrement, (state) => state - 1),
// // //     on(reset, (state) => 0)
// // //   );

// // const initialState = {
// //     ingredients:  [
// //         new Ingredient('Apples', 5),
// //         new Ingredient('Tomatoes', 10),
// //       ]
// // }
// // export function shoppingListReducer(state = initialState,action :ShoppingListActions.AddIngredient){
// //     switch (action.type) {
// //         case ShoppingListActions.ADD_INGREDIENT:
// //             return {...state, ingredients: [...state.ingredients,action.payload]};
// //             break;
    
// //         default:
// //             return state;
// //     }
// // }