import { combineReducers } from 'redux'
import nav from './nav'
import userState from './userState'
import deviceControl from './deviceControl'

export default combineReducers({
    nav,
    userState,
    deviceControl
})



    