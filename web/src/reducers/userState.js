import { handleActions } from 'redux-actions';
import * as actions from '../actions/index';

const initialState = {
    isLogin: true
};
  
const userStateReducer = handleActions({
    [`${actions.login}`](state, action){
        let { user_id, username, token, role} = action.payload
        return {
            ...state,
            isLogin : true,
            user_id,
            username,
            token,
            role
        }
    },
    [`${actions.logout}`](state, action){
        if (localStorage.getItem('user_id')){
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            localStorage.removeItem('user_id')
            localStorage.removeItem('username')    
        } 
        if (sessionStorage.getItem('user_id')) {
            sessionStorage.removeItem('user_id')
            sessionStorage.removeItem('token')
        }
        return {
            ...state,
            isLogin : false
        }
    },
},
initialState);

export default userStateReducer;
    