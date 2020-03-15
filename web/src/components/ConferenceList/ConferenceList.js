import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { meeting7Search } from '../../api/apiMeeting'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import {  Row, Col, Typography, Divider, Button} from 'antd';
import moment from 'moment'
const { Title } = Typography;
import { Link } from "react-router-dom";

class ConferenceList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            day :  {start_time: '', end_time: ''} ,
            sortByDayConferenceList: [],
            myConferenceList: [] 
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
                let data = { user_id: res.user_id}
                meeting7Search(JSON.stringify(data)).then((res)=>{
                    this.setState({ myConferenceList : res.list },()=>{
                        this.dayListFormat()
                    })
                })
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
            let month_day = moment(conference.startTime,"YYYY-MM-DD HH:mm:ss").format("MM-DD")
            let begin_time = moment(conference.startTime,"YYYY-MM-DD HH:mm:ss").format("HH:mm")
            let end_time = moment(conference.endTime,"YYYY-MM-DD HH:mm:ss").format("HH:mm")
            let show_time = `${begin_time}-${end_time}`
            let tag = moment(conference.end_time,"YYYY-MM-DD HH:mm:ss").format("HH")
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
                <Row style={{ padding: 20, paddingBottom: 0}}>
                    <Col span={5}>
                        <Title level={3} style={{padding: 10,paddingLeft: 0}}>会议列表</Title>
                    </Col>
                    <Col span={5} style={{height: 50, lineHeight: '50px'}}>
                        <Link to={`/main/conference`}> 
                            <Button type="primary" ghost>
                                会议面板
                            </Button>
                        </Link>
                    </Col>
                    <Col span={11}>
                    </Col>
                </Row>
                <Row style={{ padding: 20}}>
                    <Col span={24}>
                        {sortByDayConferenceList.map((day)=>{
                            return (
                                <div style={{padding: 20, paddingLeft: 0}}>
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
                                    {day.meeting_list.map((meeting, index)=>{
                                        return(
                                            <div>
                                                {   index === 0 && <Row style={{position:'relative', paddingTop: 10, paddingLeft: 10, marginTop: 20}}>
                                                    <Col span={2} style={{height: 20, lineHeight: '20px'}}>
                                                    
                                                    </Col>
                                                    <Col span={4} style={{height: 20, lineHeight: '20px'}}>
                                                    会议室名称
                                                    </Col>
                                                    <Col span={4} style={{height: 20, lineHeight: '20px'}}>
                                                    会议名称
                                                    </Col>
                                                    <Col span={4} style={{height: 20, lineHeight: '20px'}}>
                                                    主持人
                                                    </Col>
                                                    <Col span={10} style={{height: 20, lineHeight: '20px'}}>
                                                    </Col>
                                                </Row>}
                                                <Row style={{position:'relative', border: '1px solid #d9d9d9', paddingTop: 10,paddingBottom: 10, paddingLeft: 10, marginTop: 20, marginBottom: 20}}>
                                                        
                                                        <Col span={2} style={{height: 50, lineHeight: '50px'}}>
                                                        {meeting.show_time}&nbsp;
                                                        </Col>
                                                        <Col span={4} style={{height: 50, lineHeight: '50px'}}>
                                                         {meeting.roomName}&nbsp;
                                                        </Col>
                                                        <Col span={4} style={{height: 50, lineHeight: '50px'}}>
                                                         {meeting.meetingName}
                                                        </Col>
                                                        <Col span={4} style={{height: 50, lineHeight: '50px'}}>
                                                         {meeting.hostName}
                                                        </Col>
                                                        <Col span={7} style={{height: 50, lineHeight: '50px'}}>
                                                        </Col>
                                                        <Col span={3} style={{height: 50, lineHeight: '50px'}}>
                                                            <Button style={{ marginLeft: 30 }} type="primary" ghost>
                                                                签到
                                                            </Button>
                                                        </Col>
                                                </Row>
                                            </div>
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

export default connect(mapStateToProps, {logout})(ConferenceList);
  