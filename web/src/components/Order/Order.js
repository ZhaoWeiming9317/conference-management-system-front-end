import React from 'react'
import './Order.sass'
import { userLoginVerification } from '../../api/apiUser'
import { meetingSearch3, meetingSearchCertain, meetingSearchAll } from '../../api/apiMeeting'
import { roomBuildingSearch, roomFloorSearch } from '../../api/apiRoom'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import { Row, Col, Typography, Cascader, Button, message, Modal } from 'antd';
import MeetingAdd from '../../components/MeetingAdd/MeetingAdd'

const { Title } = Typography;
import moment from 'moment'

import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'


class Order extends React.Component {
    constructor(props) {
        super(props);
        this.init = []
        this.state = {
            baseArr: [],
            execArr: [],
            myName: '随便',
            myOrder: {room: '', time: []},
            cascaderChosen: [],
            dayList: [],
            building: '',
            floor: '',
            day: {start_time: '', end_time: ''} ,
            modalAddVisible: false,
            userAddMeetingData: []
        }
        this.cascaderLoadData = this.cascaderLoadData.bind(this)
        this.cascaderOnChange = this.cascaderOnChange.bind(this)
    }  
    componentDidMount() {
        let cookie = localStorage.getItem('cookie') || 0
        const data = {cookie : cookie}    
        userLoginVerification(JSON.stringify(data)).then((res) => {
            if (res.state == 0) {
                this.props.logout()
            }
        })
        this.initExec()
    };
    initExec() {
        meetingSearchAll().then((initArr)=>{
        })
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
                cascaderChosen : cascaderChosen
            })
        })
        this.dayListFormat()
    }
    execInitArr (initArr) {
        let baseArr = []
        initArr.map((roomItem)=>{
            let roomMeetingList = roomItem['meeting_list']
            let tempList = []
            for (let i = 9;i <= 18; i++) {
                tempList.push({
                    time: i,
                    people: '',
                    chosen: false,
                    meetingName: '',
                    meetingId: '',
                    meetingState: ''
                })
            }
            roomMeetingList.map((meetingItem)=>{
                let start_time = meetingItem['startTime']
                let end_time = meetingItem['endTime']
                let beginTime = parseInt(moment(start_time,"YYYY/MM/DD HH:mm:ss").format("HH"))
                let afterTime = parseInt(moment(end_time,"YYYY/MM/DD HH:mm:ss").format("HH"))
                if (beginTime >= 9 && afterTime <= 18) {
                    for (let i = beginTime; i <= afterTime; i++) {
                        tempList[i - 9]['time'] = i
                        tempList[i - 9]['people'] = meetingItem['hostName']
                        tempList[i - 9]['meetingId'] = meetingItem['meetingId']
                        tempList[i - 9]['meetingState'] = meetingItem['meetingState']
                        tempList[i - 9]['meetingName'] = meetingItem['meetingName']
                        tempList[i - 9]['chosen'] = true
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
        this.setState({dayList: dayList})
    }
    onPanelChange(value, mode) {
    }
    cascaderOnChange(value) {
        if (value.length == 2) {
            this.setState({
                building: value[0],
                floor: value[1]
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
                        label: item
                    }
                )    
            })
            this.setState({
                cascaderChosen : this.state.cascaderChosen
            })
        })
    }
    //合并单元格
    execArrWithColSpan(arr) {
        let beforeTime = arr[0].time
        let temp = []
        arr.forEach((item,index,array)=>{
            if (index === 0) {
                temp.push({
                    ...item,
                    beforeTime: beforeTime,
                    afterTime: parseInt(item.time) + 1,
                    col: 1
                })
            } else if (index > 0) {
                // 如果名字相同，先判断是否是同一个meetingId
                if (item.people === temp[temp.length - 1].people && item.people !== '') {
                    if (item.meetingId == temp[temp.length - 1].meetingId) {
                        temp[temp.length - 1].col++
                        temp[temp.length - 1].afterTime = parseInt(item.time) + 1    
                    }else{
                        temp.push({
                            ...item,
                            beforeTime: parseInt(item.time),
                            afterTime: parseInt(item.time) + 1,
                            col: 1
                        })    
                    }
                } else {
                    temp.push({
                        ...item,
                        beforeTime: parseInt(item.time),
                        afterTime: parseInt(item.time) + 1,
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
                            time: parseInt(result[result.length - 1].time) + 1
                        })
                    } else {
                        result.push({
                            ...item,
                            afterSame: true,
                            first: false,
                            time: parseInt(result[result.length - 1].time) + 1
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
    chooseBlock (list, room_name,e) {
        let { baseArr } = this.state
        console.log('list',list)
        console.log('room_name',room_name)
        let time = parseInt(list.time)
        for (let i = 0; i < baseArr.length ; i++){
            if (baseArr[i]['room_name'] === room_name) {
                let baseList = baseArr[i]['meetingList']
                let nowChooseList = []
                let flag = 'add'
                for (let j = 0; j < baseList.length; j++) {
                    if (baseList[j]['time'] == time) {
                        if (baseList[j]['chosen'] == 'myself') {
                            flag = "delete"
                        }
                    } else if (baseList[j]['chosen'] == 'myself') {
                        nowChooseList.push(baseList[j]['time'])
                    }
                }
                if ((nowChooseList.length >= 2 && flag == 'add')) {
                    message.error('不能预定超过两个小时')
                    break
                } else {
                    if (flag == 'add') {
                        nowChooseList.push(time)
                        nowChooseList.sort()
                        let canbreak = false
                        for (let m = 0; m < nowChooseList.length - 1; m++) {
                            if (nowChooseList[m] + 1 != nowChooseList[m + 1]) {
                                message.error('会议时间应该连续')
                                canbreak = true
                            }
                        }
                        if (canbreak == true) {
                            break
                        }
                    }
                }
                for (let j = 0; j < baseList.length; j++) {
                    if (baseList[j]['time'] == time) {
                        if (baseList[j]['people'] == this.state.myName) {
                            baseList[j]['people'] = ''
                            baseList[j]['chosen'] = 'false'    
                            baseList[j]['meetingId'] = ''
                        } else if (baseList[j]['people'] != ''){
                            message.error('选过了哦')
                        } else {
                            baseList[j]['people'] = this.state.myName
                            baseList[j]['chosen'] = 'myself'    
                        }
                    }
                }
            }
        }
        this.setState({baseArr : baseArr}, ()=>{
            this.setState({execArr : this.getAllResult(baseArr)},()=>{
                console.log(this.state.execArr)
            })
        })
    }
    addConference  (room_id,e) {
        let { execArr } = this.state
        let start_time = ''
        let end_time = ''
        let nowDay = moment(start_time,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
        let canAdd = false
        for (let i = 0; i < execArr.length ; i++){
            if (execArr[i]['room_id'] === room_id) {
                let execMeetingList = execArr[i]['meetingList']
                for (let j = 0; j < execMeetingList.length ; j++) {
                    console.log(execMeetingList[j]['chosen'])
                    console.log(execMeetingList[j]['afterSame'])
                    if(execMeetingList[j]['chosen'] == 'myself' && !execMeetingList[j]['afterSame']) {
                        start_time = `${nowDay} ${execMeetingList[j]['beforeTime']}:00:00`
                        end_time = `${nowDay} ${execMeetingList[j]['afterTime']}:00:00` 
                        canAdd = true
                    }
                }
            }
        }
        if (canAdd) {
            this.setState({
                modalAddVisible: true,
            });          
        } else {
            message.error('请先选择时间')
        }
    }
    handleCancelAdd = () => {
        this.setState({ modalAddVisible: false});
    }
    render() {    
        let { isLogin } = this.props
        let { execArr, cascaderChosen, dayList, modalAddVisible, userAddMeetingData } = this.state
        return (
            <div>
                <Row style={{ padding: 20}}>
                    <Col span={5}>
                        <Cascader 
                        options={cascaderChosen} 
                        onChange={this.cascaderOnChange} 
                        loadData={this.cascaderLoadData}
                        changeOnSelect
                        placeholder="选择大楼/楼层" />,
                    </Col>
                    <Col span={12}>
                        {dayList.map((item)=>{
                            return (
                            <div onClick={(e)=>this.chooseDay(item,e)} className={`daylist--${item.chosen}`} style={{display: "inline-block",marginTop: 0, marginLeft: 20,marginRight: 20 ,cursor:"pointer",verticalAlign: 'top'}}> 
                                <div>{item.display}</div>
                                <div>{item.week_name}</div>
                            </div>)
                        })}
                    </Col>
                    <Col span={2}>
                        <Button onClick={(e)=>this.buildFloorDaySubmit(e)}>确定</Button>,
                    </Col>
                </Row>
                {execArr.map((item)=>{
                    return(
                    <Row style={{ padding: 20}}>
                        <Col span={24}>
                            <div style={{border: '1px solid #d9d9d9', padding: 20}}>
                                <Title level={4} style={{padding: 10,paddingLeft: 0}}>{item.room_name}</Title>
                                <div style={{color: '#d9d9d9', padding: 10,paddingLeft: 0}}> {}</div>
                                <table style={{ width: '100%',tableLayout:'fixed'}}>
                                    <tbody >
                                        <tr style={{height:100}}>
                                            {item.meetingList.map((listItem)=>{
                                                return(
                                                    <td onClick={(e)=>this.chooseBlock(listItem,item.room_name,e)} className={`item__chosen--${listItem.chosen} item__aftersame--${listItem.afterSame}`} style={{verticalAlign: 'top', cursor: 'pointer'}}>
                                                        {listItem.first === true &&  
                                                        <div>
                                                            <div style={{color: 'white',fontSize: 14}}>{`${listItem.beforeTime}:00 - ${listItem.afterTime}:00`}</div> 
                                                            <div style={{color: 'white'}}>{`${listItem.meetingName}`}</div>
                                                            <div style={{color: 'white'}}>{`${listItem.people}`}</div>
                                                        </div>
                                                        } 
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                        {/* <tr style={{height:20}}>
                                            {item.map((item)=>{
                                                return(
                                                    <td>
                                                    <div style={{color: '#d9d9d9'}}>{`${item.time}:00`}</div>  
                                                    </td>
                                                )
                                            })}
                                        </tr> */}
                                    </tbody>
                                </table>
                                <Modal
                                    visible={modalAddVisible}
                                    title="添加会议"
                                    onCancel={this.handleCancelAdd}
                                    footer={null}
                                    destroyOnClose
                                >
                                <MeetingAdd type="userAdd" userAddMeeting={userAddMeetingData}></MeetingAdd>
                                </Modal>
                                <Button style={{ marginTop: 20}} onClick={(e)=>this.addConference(item.room_id,e)}>添加会议</Button>
                            </div>
                        </Col>
                    </Row>)
                    })
                }
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
  