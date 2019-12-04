import { handleActions } from 'redux-actions';
import * as actions from '../actions/index';

const initialState = {
    username: '',
    password: '',
    role: ''
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
    }
},
initialState);

export default loginRegistReducer;
    