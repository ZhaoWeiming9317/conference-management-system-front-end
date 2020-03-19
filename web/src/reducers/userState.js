import { handleActions } from 'redux-actions';
import * as actions from '../actions/index';

const initialState = {
    isLogin: true,
};
  
const userStateReducer = handleActions({
    [`${actions.login}`](state, action){
        return {
            ...state,
            isLogin : true
        }
    },
    [`${actions.logout}`](state, action){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('user_id')
        localStorage.removeItem('username')
        return {
            ...state,
            isLogin : false
        }
    },
},
initialState);

export default userStateReducer;
    