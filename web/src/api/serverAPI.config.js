/***
 * 
 *统一定义接口，有利于维护 
 * 
 **/
 
const HISTORY= 'http://39.99.172.71:8080';
const URL ={
    userLogin: HISTORY + '/user/login',
    userRegist: HISTORY + '/user/regist',
    userAdminSearch: HISTORY + '/user/admin_search',
    userAdminSearchPage: HISTORY + '/user/admin_search_page',
    userAdminDelete: HISTORY + '/user/admin_delete',
    userModifyInfo: HISTORY + '/user/modify_info',
    userShowInfo: HISTORY + '/user/show_info',
    userLoginVerification: HISTORY + '/user/login_verification',
    userLoginExit: HISTORY + '/user/login_exit',
    userAdminSearchCertain:HISTORY + '/user/admin_search_certain',
    userNameSearch: HISTORY + '/user/user_name_search',

    roomAdd: HISTORY + '/room/room_add',
    roomDelete: HISTORY + '/room/room_delete',
    roomModify: HISTORY + '/room/room_modify',
    roomDetail: HISTORY + '/room/room_detail',
    roomSearch: HISTORY + '/room/room_search',
    roomSearchPage: HISTORY + '/room/room_search_page',
    roomBuildingSearch: HISTORY + '/room/building_search',
    roomFloorSearch: HISTORY + '/room/floor_search',

    deviceAdd: HISTORY + '/device/device_add',
    deviceDelete: HISTORY + '/device/device_delete',
    deviceModify: HISTORY + '/device/device_modify',
    deviceSearch: HISTORY + '/device/device_search',
    deviceSearchPage: HISTORY + '/device/device_search_page',
    deviceDetail: HISTORY + '/device/device_detail',
    deviceFloorSearch: HISTORY + '/device/device_floor_search',
    deviceStateChange: HISTORY + '/device/device_state_change',

    formAdd: HISTORY + '/form/form_add',
    formDelete: HISTORY + '/form/form_delete',
    formModify: HISTORY + '/form/form_modify',
    formSearch: HISTORY + '/form/form_search',
    formSearchPage: HISTORY + '/form/form_search_page',
    formDetail: HISTORY + '/form/form_detail',

    meetingSearch: HISTORY + '/meeting/meeting_search ',
    meetingSearchCertain: HISTORY + '/meeting/meeting_search_certain ',
    meetingSearchAll: HISTORY + '/meeting/meeting_search_all ',
    meetingSearch2: HISTORY + '/meeting/meeting_search2 ',
    meetingSearch3: HISTORY + '/meeting/meeting_search3 ',
    meetingAdd: HISTORY + '/meeting/meeting_add ',
    meetingModify: HISTORY + '/meeting/meeting_modify ',
    meetingMembersAdd: HISTORY + '/meeting/meeting_members_add ',
    meetingMembersDelete: HISTORY + '/meeting/meeting_members_delete ',
    meetingDelete: HISTORY + '/meeting/meeting_delete ',
    meeting7Search: HISTORY + '/meeting/user_meeting7_search',
    meetingSignIn: HISTORY + '/meeting/sign_in',
    meetingAccept: HISTORY + '/meeting/accept',
    meetingReject: HISTORY + '/meeting/reject ',


    watch: HISTORY + '/watch',
    publish: HISTORY + '/publish',
    informAll: HISTORY + '/inform/inform_all',
    informFirst: HISTORY + '/inform/inform_first',
    messageSearch: HISTORY + '/message/message_search',
    messageHaveRead : HISTORY + '/message/message_have_read',
    messageAllHaveRead: HISTORY + '/message/message_all_have_read',
}
export default URL
