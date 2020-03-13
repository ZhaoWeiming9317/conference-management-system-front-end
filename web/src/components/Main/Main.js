import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux';
import UserTable from '../UserTable/UserTable'
import { logout } from '../../actions/index'
import {  Card, Calendar, Row, Col, Typography, } from 'antd';
import moment from 'moment'
const { Title, Paragraph, Text, Button } = Typography;

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            day :  {start_time: '', end_time: ''} ,
            sortByDayConferenceList: [],
            myConferenceList: [
                {
                    meeting_id: 1,
                    meeting_name: '会议',
                    room_name: '会议室01',
                    start_time: '2020/03/15 11:00:00',
                    end_time: '2020/03/15 13:00:00',
                    host: '赵韦铭',
                    topic: '不知道',
                    meeting_state: 0
                },
                {
                    meeting_id: 2,
                    meeting_name: '会议哇哈哈哈',
                    room_name: '会议室02',
                    start_time: '2020/03/17 11:00:00',
                    end_time: '2020/03/17 13:00:00',
                    host: '赵韦铭',
                    topic: '不知道',
                    meeting_state: 0
                },
                {
                    meeting_id: 3,
                    meeting_name: '会议',
                    room_name: '会议室01',
                    start_time: '2020/03/18 11:00:00',
                    end_time: '2020/03/18 13:00:00',
                    host: '赵韦铭',
                    topic: '不知道',
                    meeting_state: 0
                },
                {
                    meeting_id: 4,
                    meeting_name: '会议',
                    room_name: '会议室01',
                    start_time: '2020/03/18 09:00:00',
                    end_time: '2020/03/18 10:00:00',
                    host: '唐德轩',
                    topic: '不知道',
                    meeting_state: 0
                },
            ],
        }
    }  
    componentDidMount() {
        let cookie = localStorage.getItem('cookie') || 0
        console.log(cookie)
        const data = {cookie : cookie}    
        userLoginVerification(JSON.stringify(data)).then((res) => {
            if (res.state == 0) {
                this.props.logout()
            } else {
                this.dayListFormat()
            }
        })
    };
    dayListFormat() {
        let { day } = this.state
        let sortByDayConferenceList = []
        for (let i = 0; i <= 6; i++){
            sortByDayConferenceList.push(
               {
                week_name: moment().add(i, 'day').format('dddd'),
                month_day: moment().add(i, 'day').format("MM-DD"),
                meeting_list:[] 
                }
            )
        }
        sortByDayConferenceList[0]['chosen'] = true
        this.setState({sortByDayConferenceList: sortByDayConferenceList},()=>{
            this.sortList()
        })
    }
    compare = function (x, y) {//比较函数
        if (x.tag < y.tag) {
            return -1;
        } else if (x.tag > y.tag) {
            return 1;
        } else {
            return 0;
        }
    }
    sortList() {
        let { myConferenceList , sortByDayConferenceList } = this.state
        let tempSortList = sortByDayConferenceList
        myConferenceList.map((conference)=>{
            let month_day = moment(conference.start_time,"YYYY/MM/DD HH:mm:ss").format("MM-DD")
            let begin_time = moment(conference.start_time,"YYYY/MM/DD HH:mm:ss").format("HH:mm")
            let end_time = moment(conference.end_time,"YYYY/MM/DD HH:mm:ss").format("HH:mm")
            let show_time = `${begin_time}-${end_time}`
            let tag = moment(conference.end_time,"YYYY/MM/DD HH:mm:ss").format("HH")
            tempSortList.map((day)=>{
                if ( day.month_day == month_day) {
                    begin_time = conference
                    day.meeting_list.push({...conference,show_time:show_time,tag:tag})
                    day.meeting_list.sort(this.compare)
                }
            })
        })
        this.setState({sortByDayConferenceList: tempSortList},()=>{
        })
    }
    onPanelChange(value, mode) {
        console.log(value, mode);
    }      
    render() {    
        let { isLogin } = this.props
        let { sortByDayConferenceList } = this.state
        return (
            <div>
                <Row style={{ padding: 20, paddingBottom: 10}}>
                    <Title level={3} style={{padding: 10,paddingLeft: 0}}>未来七天内的会议</Title>
                </Row>
                <Row style={{ padding: 20}}>
                    <Col span={24}>
                        {sortByDayConferenceList.map((day)=>{
                            return (
                                <div style={{border: '1px solid #d9d9d9', padding: 20,marginBottom: 30}}>
                                    <Row>
                                        <Col span={1} style={{ fontWeight: 600}}>
                                            {day.month_day}
                                        </Col>
                                        <Col span={2} style={{ fontWeight: 600, color: '#d9d9d9'}}>
                                            {day.week_name}
                                        </Col>
                                        <Col span={21}>

                                        </Col>
                                    </Row>
                                    {day.meeting_list.map((meeting)=>{
                                        return(
                                            <Row style={{ paddingTop: 20}}>
                                                    {meeting.show_time}
                                                    &nbsp;
                                                    {meeting.meeting_name}
                                            </Row>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </Col>
                </Row>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps, {logout})(Main);
  