import React from 'react'
import './Order.sass'
import { userLoginVerification } from '../../api/apiUser'
import { meetingSearch3, meetingSearchCertain, meetingSearchAll } from '../../api/apiMeeting'
import { roomBuildingSearch, roomFloorSearch } from '../../api/apiRoom'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import { Row, Col, Typography, Cascader, Button, message } from 'antd';
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
            baseArr: [
                {   room: '会议室302',
                    location: '南方科技大学 图书馆 302',
                    list:[{time: '9', people: '赵韦铭', chosen: true},
                    {time: '10', people: '', chosen: false},
                    {time: '11', people: '', chosen: false},
                    {time: '12', people: '', chosen: false},
                    {time: '13', people: '', chosen: false},
                    {time: '14', people: '', chosen: false},
                    {time: '15', people: '', chosen: false},
                    {time: '16', people: '唐德轩', chosen: true},
                    {time: '17', people: '唐德轩', chosen: true},
                    {time: '18', people: '', chosen: false}]
                },
                {   room: '会议室303',
                    location: '南方科技大学 图书馆 303',
                    list:[{time: '9', people: '杨宇杰', chosen: true},
                    {time: '10', people: '杨宇杰', chosen: true},
                    {time: '11', people: '', chosen: false},
                    {time: '12', people: '', chosen: false},
                    {time: '13', people: '', chosen: false},
                    {time: '14', people: '', chosen: false},
                    {time: '15', people: '唐德轩', chosen: true},
                    {time: '16', people: '唐德轩', chosen: true},
                    {time: '17', people: '', chosen: false},
                    {time: '18', people: '', chosen: false}]
                },
            ],
            execArr: [],
            myName: '随便',
            cascaderChosen: [],
            dayList: [],
            building: '',
            floor: '',
            day: {start_time: '', end_time: ''}
        }
        this.cascaderLoadData = this.cascaderLoadData.bind(this)
        this.cascaderOnChange = this.cascaderOnChange.bind(this)
    }  
    componentDidMount() {
        let cookie = localStorage.getItem('cookie') || 0
        console.log(cookie)
        const data = {cookie : cookie}    
        userLoginVerification(JSON.stringify(data)).then((res) => {
            if (res.state == 0) {
                this.props.logout()
            }
        })
        this.initExec()
        this.setState({execArr : this.getAllResult(this.state.baseArr)})
    };
    initExec() {
        meetingSearchAll().then((res)=>{
            console.log(res)
            this.init = res
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
        console.log(data)
        if (data['building'] == '' || data['floor'] == '') {
            message.error('大楼或楼层没有选择哦')
        } else if (data['start_time'] == '' || data['end_time'] == '') {
            message.error('没有选择时间哦')
        } else {
            meetingSearch3(JSON.stringify(data)).then((res)=>{
                console.log(res)
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
                if (item.people === temp[temp.length - 1].people && item.people !== '') {
                    temp[temp.length - 1].col++
                    temp[temp.length - 1].afterTime = parseInt(item.time) + 1
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
                    first: true,
                    myChosen: false
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
                list:this.execArrWithColSpan(item.list)})
        })
        return result
    }   
    addConference (value, e) {
    }
    chooseBlock (list, room,e) {
        let { baseArr, execArr } = this.state
        let time = list.time
        for (let i = 0; i < baseArr.length ; i++){
            if (baseArr[i]['room'] === room) {
                let baseList = baseArr[i]['list']
                for (let j = 0; j < baseList.length; j++) {
                    if (baseList[j]['time'] == time) {
                        if (baseList[j]['people'] == this.state.myName) {
                            baseList[j]['people'] = ''
                            baseList[j]['chosen'] = 'false'    
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
        console.log(execArr)
        this.setState({baseArr : baseArr}, ()=>{
            this.setState({execArr : this.getAllResult(baseArr)})
        })
    }
    render() {    
        let { isLogin } = this.props
        let { execArr, cascaderChosen, dayList } = this.state
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
                                <Title level={4} style={{padding: 10,paddingLeft: 0}}>{item.room}</Title>
                                <div style={{color: '#d9d9d9', padding: 10,paddingLeft: 0}}>类型: {item.topic}</div>
                                <table style={{ width: '100%',tableLayout:'fixed'}}>
                                    <tbody >
                                        <tr style={{height:100}}>
                                            {item.list.map((listItem)=>{
                                                return(
                                                    <td onClick={(e)=>this.chooseBlock(listItem,item.room,e)} className={`item__chosen--${listItem.chosen} item__aftersame--${listItem.afterSame}`} style={{verticalAlign: 'top', cursor: 'pointer'}}>
                                                        {listItem.first === true &&  
                                                        <div>
                                                            <div style={{color: 'white',fontSize: 14}}>{`${listItem.beforeTime}:00 - ${listItem.afterTime}:00`}</div> 
                                                            <div style={{color: 'white'}}>{listItem.people}</div>
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
                                <Button style={{ marginTop: 20}} onClick={(e)=>this.addConference(item,e)}>添加会议</Button>
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
  