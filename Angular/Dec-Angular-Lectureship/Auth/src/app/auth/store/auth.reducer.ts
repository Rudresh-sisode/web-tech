import { User } from "../user.model";
import * as AuthAcions from './auth.actions';

export interface State{
    user:User;
}

const initialState : State = {
    user: null,
};

export function authReducer(state = initialState, action:AuthAcions.AuthActions){
    switch(action.type){
        case AuthAcions.LOGIN:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            );
            return {
                ...state,
                user:user
            };
        case AuthAcions.LOGOUT:
            return {
                ...state,
                user:null
            };
            default:
                return state;

    }
}