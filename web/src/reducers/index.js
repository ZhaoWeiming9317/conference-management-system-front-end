import { handleActions } from 'redux-actions';
import * as actions from '../actions/index';

const initialState = {
    loginView: true,
    isLogin: false
};
  
const loginRegistReducer = handleActions({
    [`${actions.gotoLogin}`](state, action){
        return {
            ...state,
            loginView : true,
        };
    }, 
    [`${actions.gotoRegist}`](state, action){
        return {
            ...state,
            loginView : false,
        }
    },
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
    }
},
initialState);

export default loginRegistReducer;
    