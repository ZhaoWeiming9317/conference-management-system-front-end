import { createAction } from 'redux-actions';
export const gotoLogin = createAction('goto/login')
export const gotoRegist = createAction('goto/regist')
export const userName = createAction('user/userName')
export const password = createAction('user/password')
export const role = createAction('user/role')