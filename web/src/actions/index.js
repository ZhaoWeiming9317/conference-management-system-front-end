import { createAction } from 'redux-actions';
export const gotoLogin = createAction('goto/login')
export const gotoRegist = createAction('goto/regist')
export const login = createAction('status/login')
export const logout = createAction('status/logout')
export const admin = createAction('role/admin')
export const normalUser = createAction('role/normalUser')
export const handle = createAction('role/handle')
export const gotoMain = createAction('goto/main')
export const gotoDevice = createAction('goto/device')
export const gotoMeeting = createAction('goto/meeting')
export const gotoRoom = createAction('goto/room')
export const gotoUser = createAction('goto/user')
export const gotoForm = createAction('goto/form')
export const deviceControl = createAction('control/deviceControl')