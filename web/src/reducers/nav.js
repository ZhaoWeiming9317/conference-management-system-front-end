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
        };
    }, 
    [`${actions.gotoRegist}`](state, action){
        return {
            ...state,
            loginView : false,
        }
    },
    [`${actions.gotoMain}`](state, action){
        return {
            ...state,
            nav : 0
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
    },
    [`${actions.gotoForm}`](state, action){
        return {
            ...state,
            nav : 5
        }
    },

},
initialState);

export default navReducer;
