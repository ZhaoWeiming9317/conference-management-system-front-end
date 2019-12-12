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

    roomAdd: HISTORY + '/room/room_add',
    roomDelete: HISTORY + '/room/room_delete',
    roomModify: HISTORY + '/room/room_modify',
    roomDetail: HISTORY + '/room/room_detail',
    roomSearch: HISTORY + '/room/room_search',
    roomSearchPage: HISTORY + '/room/room_search_page',
}
export default URL