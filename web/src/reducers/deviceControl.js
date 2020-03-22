import { handleActions } from 'redux-actions';
import * as actions from '../actions/index';

const initialState = {
    deviceId : -1,
    deviceState: 1
};
  
const deviceControlReducer = handleActions({
    [`${actions.deviceControl}`](state, action){
        let { deviceId, deviceState,} = action.payload
        return {
            ...state,
            deviceId,
            deviceState,
        }
    },
},
initialState);

export default deviceControlReducer;