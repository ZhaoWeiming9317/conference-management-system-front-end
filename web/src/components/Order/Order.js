import React from 'react'
import './Order.sass'
import { userLoginVerification, userShowInfo } from '../../api/apiUser'
import { meetingSearch3, meetingSearchCertain, meetingSearchAll, meetingDelete, } from '../../api/apiMeeting'
import { roomBuildingSearch, roomFloorSearch } from '../../api/apiRoom'
import { connect } from 'react-redux'
import { logout } from '../../actions/index'
import { Row, Col, Typography, Cascader, Button, message, Modal, Dropdown, Menu, Popconfirm,} from 'antd'
import MeetingAdd from '../../components/MeetingAdd/MeetingAdd'

const { Title } = Typography
import moment from 'moment'

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.init = []
        this.state = {
            baseArr: [],
            execArr: [],
            hostName: '',
            user_id: 1,
            myOrder: {room: '', time: []},
            cascaderChosen: [],
            dayList: [],
            building: '',
            floor: '',
            members: [],
            day: {start_time: '', end_time: ''} ,
            modalAddVisible: false,
            modalModifyVisible: false,
            modalDeleteVisible: false,
            userMeetingData: [],
            nowContextMenuMeetingId: 1, // 会议右键的id
            canChooseContextMenu: false,
            modalLoading: false
        }
        this.cascaderLoadData = this.cascaderLoadData.bind(this)
        this.cascaderOnChange = this.cascaderOnChange.bind(this)
    }  
    componentDidMount() {
        userLoginVerification().then((res) => {
            if (res.state == 0) {
                this.props.logout()
            } else {
                this.setState({
                    user_id: res.user_id,
                },()=>{
                    userShowInfo(JSON.stringify({username:res.username})).then((res)=>{
                        console.log(res)
                        this.setState({
                            hostName: res.name
                        },()=>{
                            this.initExec()
                        })    
                    })
                })
            }
        })
    };
    initExec() {
        let cascaderChosen = []
        roomBuildingSearch().then((res)=>{
            res.map((item)=>{
                cascaderChosen.push(
                    {
                        value: item,
                        label: item,
                        isLeaf: false
                    }
                )
            })
            this.setState({
                cascaderChosen : cascaderChosen,
                building : cascaderChosen[0].value
            },()=>{
                let { cascaderChosen } = this.state
                const data = {building : cascaderChosen[0].value}
                roomFloorSearch(JSON.stringify(data)).then((res)=>{
                    cascaderChosen[0].children = []
                    res.map((item)=>{
                        cascaderChosen[0].children.push(
                            {
                                value: item,
                                label: `${item}楼`
                            }
                        )    
                    })
                    this.setState({
                        cascaderChosen : this.state.cascaderChosen,
                        floor : cascaderChosen[0].children[0].value
                    },()=>{
                        this.dayListFormat()
                    })
                })        
            })
        })
    }
    execInitArr (initArr) {
        let baseArr = []
        initArr.map((roomItem)=>{
            let roomMeetingList = roomItem['meeting_list']
            let tempList = []
            for (let i = 9;i <= 18 + 0.5; i = i + 0.5) {
                tempList.push({
                    time: i,
                    hostName: '',
                    chosen: false,
                    meetingName: '',
                    meetingId: '',
                    meetingState: ''
                })
            }
            roomMeetingList.map((meetingItem)=>{
                let start_time = meetingItem['startTime']
                let end_time = meetingItem['endTime']
                let beginTime = 
                moment(start_time,"YYYY/MM/DD HH:mm:ss").format("mm") == '00' ? 
                parseInt(moment(start_time,"YYYY/MM/DD HH:mm:ss").format("HH")) :
                parseInt(moment(start_time,"YYYY/MM/DD HH:mm:ss").format("HH")) + 0.5
                let afterTime = 
                moment(end_time,"YYYY/MM/DD HH:mm:ss").format("mm") == '00' ? 
                parseInt(moment(end_time,"YYYY/MM/DD HH:mm:ss").format("HH")) : 
                parseInt(moment(end_time,"YYYY/MM/DD HH:mm:ss").format("HH")) + 0.5

                if (beginTime >= 9 && afterTime <= 19) {
                    for (let i = beginTime; i < afterTime; i = i + 0.5) {
                        tempList[(i - 9)*2]['time'] = i
                        tempList[(i - 9)*2]['hostName'] = meetingItem['hostName']
                        tempList[(i - 9)*2]['meetingId'] = meetingItem['meetingId']
                        tempList[(i - 9)*2]['meetingState'] = meetingItem['meetingState']
                        tempList[(i - 9)*2]['meetingName'] = meetingItem['meetingName']
                        if (tempList[(i - 9)*2]['hostName'] == this.state.hostName) {
                            tempList[(i - 9)*2]['chosen'] = 'myself'
                        } else {
                            tempList[(i - 9)*2]['chosen'] = 'true'
                        }
                    }
                }
            })
            baseArr.push({
                room_id: roomItem['room_id'],
                room_name: roomItem['room_name'],
                meetingList: tempList
            })
        })
        this.setState({
            baseArr: baseArr,
            execArr: this.getAllResult(baseArr)
        })
    }
    dayListFormat() {
        let { day } = this.state
        let dayList = []
        for (let i = 0; i <= 6; i++){
            dayList.push(
               {start_time: moment().add(i, 'days').format("YYYY-MM-DD 00:00:00"),
                end_time: moment().add(i, 'day').format("YYYY-MM-DD 23:59:59"),
                week_name: moment().add(i, 'day').format('dddd'),
                display: moment().add(i, 'days').format("MM-DD"),
                chosen: false}
            )
        }
        dayList[0]['chosen'] = true
        day['start_time'] = dayList[0]['start_time']
        day['end_time'] = dayList[0]['end_time']    
        this.setState({dayList: dayList},()=>{
            this.buildFloorDaySubmit()
        })
    }
    onPanelChange(value, mode) {
    }
    cascaderOnChange(value) {
        let { day } = this.state
        if (value.length == 2) {
            this.setState({
                building: value[0],
                floor: value[1]
            },()=>{
                if (day['start_time'] != '') {
                    this.buildFloorDaySubmit()    
                } 
            })
        }
    }
    chooseDay(dayDetail,e) {
        let { dayList } = this.state
        let day = {}
        for (let i in dayList){
            if(dayList[i] === dayDetail){
                if (dayList[i]['chosen'] == false) {
                    dayList[i]['chosen'] = true
                    day['start_time'] = dayList[i]['start_time']
                    day['end_time'] = dayList[i]['end_time']    
                } else {
                    dayList[i]['chosen'] = false
                    day['start_time'] = ''
                    day['end_time'] = ''
                }
            } else if (dayList[i] !== dayDetail) {
                if (dayList[i]['chosen'] == true) {
                    dayList[i]['chosen'] = false
                }
            }
        }
        this.setState({
            day: day,
            dayList: dayList
        },()=>{
            this.buildFloorDaySubmit()
        })
    }
    buildFloorDaySubmit() {
        let {building, floor, day} = this.state
        let data = {
            building: building,
            floor: floor,
            start_time: day['start_time'],
            end_time: day['end_time']
        }
        if (data['building'] == '' || data['floor'] == '') {
            message.error('大楼或楼层没有选择哦')
        } else if (data['start_time'] == '' || data['end_time'] == '') {
            message.error('没有选择时间哦')
        } else {
            meetingSearch3(JSON.stringify(data)).then((res)=>{
                this.init = res
                this.execInitArr(res) 
            })
        }
    }
    cascaderLoadData(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        // load options lazily
        const data = {building : targetOption.value}
        roomFloorSearch(JSON.stringify(data)).then((res)=>{
            targetOption.loading = false
            targetOption.children = []
            res.map((item)=>{
                targetOption.children.push(
                    {
                        value: item,
                        label: `${item}楼`
                    }
                )    
            })
            this.setState({
                cascaderChosen : this.state.cascaderChosen
            })
        })
    }
    //合并单元格并且显示
    execArrWithColSpan(arr) {
        let beforeTime = arr[0].time
        let temp = []
        arr.forEach((item,index,array)=>{
            if (index === 0) {
                temp.push({
                    ...item,
                    beforeTime: beforeTime,
                    afterTime: parseFloat(item.time) + 0.5,
                    col: 1
                })
            } else if (index > 0) {
                // 如果名字相同，先判断是否是同一个meetingId
                if (item.hostName === temp[temp.length - 1].hostName && item.hostName !== '') {
                    if (item.meetingId == temp[temp.length - 1].meetingId) {
                        temp[temp.length - 1].col++
                        temp[temp.length - 1].afterTime = parseFloat(item.time) + 0.5    
                    }else{
                        temp.push({
                            ...item,
                            beforeTime: parseFloat(item.time),
                            afterTime: parseFloat(item.time) + 0.5,
                            col: 1
                        })    
                    }
                } else {
                    temp.push({
                        ...item,
                        beforeTime: parseFloat(item.time),
                        afterTime: parseFloat(item.time) + 0.5,
                        col: 1
                    })
                }
            }
        })
        let result = []
        temp.forEach((item,index,array)=>{
            let count = item.col
            if (count === 1) {
                result.push({
                    ...item,
                    afterSame: false,
                    first: true
                    }
                )
            } else {
                for( let i = 1; i <= item.col; i++){
                    if (i === 1){
                        result.push({
                            ...item,
                            afterSame: true,
                            first: true
                        })
                    } else if ( i === item.col){
                        result.push({
                            ...item,
                            afterSame: false,
                            first: false,
                            time: parseFloat(result[result.length - 1].time) + 0.5
                        })
                    } else {
                        result.push({
                            ...item,
                            afterSame: true,
                            first: false,
                            time: parseFloat(result[result.length - 1].time) + 0.5
                        })
                    }
                }
            }
        })
        return result
    }
    getAllResult (arr) {
        let result = []
        arr.map((item)=>{
            result.push({
                ...item,
                meetingList:this.execArrWithColSpan(item.meetingList)})
        })
        return result
    }   
    compare = function (x, y) {//比较函数
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    }
    chooseBlock (list, room_name,e) {
        let { baseArr } = this.state
        let time = parseFloat(list.time)
        for (let i = 0; i < baseArr.length ; i++){
            if (baseArr[i]['room_name'] === room_name) {
                let baseList = baseArr[i]['meetingList']
                let nowChooseList = []
                let flag = 'add'
                for (let j = 0; j < baseList.length; j++) {
                    if (baseList[j]['time'] == time) {
                        if (baseList[j]['chosen'] == 'myselfTemp') {
                            flag = "delete"
                            nowChooseList.push(baseList[j]['time'])
                        }
                    } else if (baseList[j]['chosen'] == 'myselfTemp') {
                        nowChooseList.push(baseList[j]['time'])
                    }
                }
                if ((nowChooseList.length >= 4 && flag == 'add')) {
                    message.error('不能预定超过两个小时')
                    break
                } else {
                    if (flag == 'add') {
                        nowChooseList.push(time)
                        nowChooseList.sort(this.compare)
                        let canbreak = false
                        for (let m = 0; m < nowChooseList.length - 1; m++) {
                            if (nowChooseList[m] + 0.5 != nowChooseList[m + 1]) {
                                message.error('会议时间应该连续')
                                canbreak = true
                            }
                        }
                        if (canbreak == true) {
                            break
                        }
                    } else {
                        let canbreak = false
                        nowChooseList.sort(this.compare)
                        if (nowChooseList[0] != time && nowChooseList[nowChooseList.length - 1] != time) {
                            message.error('会议时间应该保持连续')
                            canbreak = true
                        }
                        if (canbreak == true) {
                            break
                        }
                    }
                }
                for (let j = 0; j < baseList.length; j++) {
                    if (baseList[j]['time'] == time) {
                        if (baseList[j]['hostName'] == this.state.hostName && baseList[j]['chosen'] != 'myself' && baseList[j]['chosen'] != 'true') {
                            // 选过后取消

                            baseList[j]['hostName'] = ''
                            baseList[j]['chosen'] = 'false'    
                            baseList[j]['meetingId'] = ''
                        } else if (baseList[j]['chosen'] == 'myself' || baseList[j]['chosen'] == 'true'){
                            message.error('选过了哦,更多操作点击右键')
                        } else {
                            // 首次选择
                            baseList[j]['hostName'] = this.state.hostName
                            baseList[j]['chosen'] = 'myselfTemp'    
                        }
                    }
                }
            }
        }
        this.setState({baseArr : baseArr}, ()=>{
            this.setState({execArr : this.getAllResult(baseArr)},()=>{
            })
        })
    }

    //num传入的数字，n需要的字符长度
    //js 数字前面自动补零
    PrefixInteger = (num, n) => {
        return (Array(n).join(0) + num).slice(-n);
    }
    addConference  (room_id,e) {
        let { execArr, day } = this.state
        let start_time = ''
        let end_time = ''
        let nowDay = moment(day['start_time'],"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
        let canAdd = false
        for (let i = 0; i < execArr.length ; i++){
            if (execArr[i]['room_id'] === room_id) {
                let execMeetingList = execArr[i]['meetingList']
                for (let j = 0; j < execMeetingList.length ; j++) {
                    if(execMeetingList[j]['chosen'] == 'myselfTemp' && !execMeetingList[j]['afterSame']) {
                        start_time = 
                        this.isInteger(execMeetingList[j]['beforeTime']) ? `${nowDay} ${this.PrefixInteger(execMeetingList[j]['beforeTime'],2)}:00:00`
                                                            :  `${nowDay} ${this.PrefixInteger(Math.floor(execMeetingList[j]['beforeTime']),2)}:30:00`
                        end_time = 
                        this.isInteger(execMeetingList[j]['afterTime']) ? `${nowDay} ${this.PrefixInteger(execMeetingList[j]['afterTime'],2)}:00:00` 
                                                            :  `${nowDay} ${this.PrefixInteger(Math.floor(execMeetingList[j]['afterTime']),2)}:30:00`
                        canAdd = true
                    }
                }
                if (canAdd) {
                    this.setState({
                            userMeetingData: { 
                            room:{
                                roomId: room_id,
                                roomName: ''
                              },
                            start_time:start_time,
                            end_time:end_time,
                            host: { user_id:this.state.user_id, name : this.state.hostName },
                            members:[{userId: '',name: ''}]
                        },
                    },()=>{
                        console.log(this.state.userMeetingData)
                        this.setState({
                            modalAddVisible: true
                        })     
                    })
                } else {
                    message.error('请先选择时间')
                }
        
            }
        }
    }
    deleteConference() {
        let { nowContextMenuMeetingId } = this.state
        this.setState({ modalLoading : true})
        setTimeout(()=> {
        meetingDelete(JSON.stringify({meeting_id: nowContextMenuMeetingId})).then((res)=>{
            this.setState({ modalLoading : false})
            if (res.state == 1) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        }).catch((error)=>{
            message.error('系统错误')
        })}, 0)
    }
    onClickMenu = ({ key }) => {
        let { nowContextMenuMeetingId } = this.state
        setTimeout(()=> {
            console.log(key)
            if ( key == "delete" ) {
                this.setState(
                    { modalDeleteVisible : true }
                )
            } else if ( key == "modify" ) {
                meetingSearchCertain(JSON.stringify({meeting_id: nowContextMenuMeetingId})).then((res)=>{
                    let userMeetingData = { res }
                    this.setState(
                        { userMeetingData : userMeetingData.res },
                        ()=>{
                            this.setState(
                                { modalModifyVisible : true }
                            )
                        }
                    )
                })
            } 
        },0)
    }
    isInteger = (obj) => {
        return obj%1 === 0
    }
       
    //右键获得
    getInfoMation = (list, e) => {
        this.setState({nowContextMenuMeetingId: list.meetingId})
    }
    handleCancel = () => {
        this.setState({ modalAddVisible: false,modalModifyVisible: false,modalDeleteVisible:false});
        this.buildFloorDaySubmit()
    }
    render() {    
        let { isLogin } = this.props
        let { day, building, floor } = this.state
        let { execArr, cascaderChosen, dayList, modalAddVisible, modalModifyVisible, modalDeleteVisible,userMeetingData } = this.state
        let menu =(
            <Menu onClick={(e)=>this.onClickMenu(e)} style={{width: 88}}>
                <Menu.Item key="modify">修改</Menu.Item>
                <Menu.Item key="delete">
                  删除
                </Menu.Item>
            </Menu>
          )    
        return (
            <div>
                <Row style={{ padding: 20}}>
                    <Col span={5}>
                        <Cascader 
                        options={cascaderChosen} 
                        onChange={this.cascaderOnChange} 
                        loadData={this.cascaderLoadData}
                        value={[this.state.building, this.state.floor]}
                        changeOnSelect
                        placeholder="选择大楼/楼层" />,
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={15}>
                        {dayList.map((item)=>{
                            return (
                            <div onClick={(e)=>this.chooseDay(item,e)} className={`daylist--${item.chosen}`} style={{display: "inline-block",marginTop: 0, marginLeft: 20,marginRight: 20 ,cursor:"pointer",verticalAlign: 'top'}}> 
                                <div>{item.display}</div>
                                <div>{item.week_name}</div>
                            </div>)
                        })}
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={2}>
                        {/* <Button onClick={(e)=>this.buildFloorDaySubmit(e)}>确定</Button>, */}
                    </Col>
                </Row>
                {execArr.map((item)=>{
                    return(
                    <Row style={{ padding: 20}}>
                        <Col span={24}>
                            <div style={{border: '1px solid #d9d9d9', padding: 20}}>
                                <Title level={4} style={{padding: 10,paddingLeft: 0}}>{item.room_name}</Title>
                                <div style={{color: '#bfbfbf', padding: 10,paddingLeft: 0}}>{ `${moment(day['start_time'],"YYYY/MM/DD HH:mm:ss").format("MM-DD")}  ${building}  ${floor}楼`}</div>
                                <table style={{ width: '100%',tableLayout:'fixed'}}>
                                    <tbody >
                                        <tr style={{height:20}}>
                                            {item.meetingList.map((listItem)=>{
                                                return(
                                                    listItem.first == true &&
                                                    <td style={{color: "#bfbfbf"}} colspan={listItem.col}>
                                                        {listItem.meetingName}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                        <tr style={{height:100}}>
                                            {item.meetingList.map((listItem)=>{
                                                return(
                                                    <Dropdown overlay={ menu } trigger={['contextMenu']} disabled={ listItem.chosen != 'myself' && true }>
                                                        <td onContextMenu={(e)=>this.getInfoMation(listItem,item.room_name,e)} 
                                                        onClick={(e)=>this.chooseBlock(listItem,item.room_name,e)} 
                                                        className={`item__chosen--${listItem.chosen} item__aftersame--${listItem.afterSame}`} 
                                                        style={{verticalAlign: 'top', cursor: 'pointer'}}>
                                                            {listItem.first === true &&  
                                                            <div>
                                                                <div style={{color: 'white',fontSize: 14}}>
                                                                    {this.isInteger(listItem.beforeTime) ? `${listItem.beforeTime}:00` : `${Math.floor(listItem.beforeTime)}:30`}
                                                                    {` - `}
                                                                    {this.isInteger(listItem.afterTime) ? `${listItem.afterTime}:00` : `${Math.floor(listItem.afterTime)}:30`}
                                                                </div> 
                                                                <div style={{color: 'white'}}>{`${listItem.hostName}`}</div>
                                                            </div>
                                                            } 
                                                        </td>
                                                    </Dropdown>
                                                )
                                            })}
                                        </tr>
                                        <tr style={{height:20}}>
                                            {item.meetingList.map((item)=>{
                                                return(
                                                    <td>
                                                    <div style={{color: "#bfbfbf"}}>{this.isInteger(item.time) ? `${item.time}:00` : `${Math.floor(item.time)}:30`}</div>  
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    </tbody>
                                </table>
                                <Button name={item.room_name} style={{ marginTop: 20}} onClick={(e)=>this.addConference(item.room_id,e)}>添加会议</Button>
                            </div>
                        </Col>
                    </Row>)
                    })
                }
                <Modal
                    visible={modalAddVisible}
                    title="添加会议"
                    onCancel={this.handleCancel}
                    footer={null}
                    destroyOnClose
                >
                <MeetingAdd type="userAdd" userMeetingData={userMeetingData}></MeetingAdd>
                </Modal>
                <Modal
                    visible={modalModifyVisible}
                    title="修改会议"
                    onCancel={this.handleCancel}
                    footer={null}
                    destroyOnClose
                >
                <MeetingAdd type="userModify" userMeetingData={userMeetingData}></MeetingAdd>
                </Modal>
                <Modal
                    visible={modalDeleteVisible}
                    title="删除会议"
                    onCancel={this.handleCancel}
                    destroyOnClose
                    footer={[
                      <Button key="back" onClick={this.handleCancel}>
                        取消
                      </Button>,
                      <Button key="submit" type="primary" loading={this.state.modalLoading} onClick={(e)=>this.deleteConference(e)}>
                        确认
                      </Button>]
                    }
                >
                    <p>确认删除这个会议吗？</p>
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps, {logout})(Order);
  