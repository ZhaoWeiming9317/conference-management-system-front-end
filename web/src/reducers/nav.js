import { handleActions } from 'redux-actions';
import * as actions from '../actions/index';

const initialState = {
    loginView: true,
    nav: 0
};
  
const navReducer = handleActions({
    [`${actions.gotoLogin}`](state, action){
        return {
            ...state,
            loginView : true,
        }
    },
    [`${actions.gotoRegist}`](state, action){
        return {
            ...state,
            loginView : false,
        }
    }
},
initialState);

export default navReducer;
