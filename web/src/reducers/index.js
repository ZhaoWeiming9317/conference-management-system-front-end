import { combineReducers } from 'redux'
import login_and_regist from './login_and_regist'

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
    login_and_regist
})

export default rootReducer
