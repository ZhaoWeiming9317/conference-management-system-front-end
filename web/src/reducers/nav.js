import { handleActions } from 'redux-actions';
import * as actions from '../actions/index';

const initialState = {
    loginView: true,
    nav: 2
};
  
const navReducer = handleActions({
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
    [`${actions.gotoMeeting}`](state, action){
        return {
            ...state,
            nav : 1
        }
    },
    [`${actions.gotoUser}`](state, action){
        return {
            ...state,
            nav : 2
        }
    },
    [`${actions.gotoRoom}`](state, action){
        return {
            ...state,
            nav : 3
        }
    },
    [`${actions.gotoDevice}`](state, action){
        return {
            ...state,
            nav : 4
        }
    }

},
initialState);

export default navReducer;