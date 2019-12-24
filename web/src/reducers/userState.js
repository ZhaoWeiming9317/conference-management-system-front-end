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
        return {
            ...state,
            isLogin : false
        }
    },
},
initialState);

export default userStateReducer;
    