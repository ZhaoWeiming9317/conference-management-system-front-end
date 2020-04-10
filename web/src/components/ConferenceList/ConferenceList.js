import React from 'react'
import { meeting7Search,meetingSignIn, meetingAccept, meetingReject, meetingSearchCertain, meetingDelete} from '../../api/apiMeeting'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import {  Row, Col, Typography, message, Button, Divider, Popconfirm, Modal, Descriptions  } from 'antd';
import moment from 'moment'
const { Title } = Typography;
import { Link } from "react-router-dom";
import MeetingAdd from '../../components/MeetingAdd/MeetingAdd'

class ConferenceList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            day :  {start_time: '', end_time: ''} ,
            sortByDayConferenceList: [],
            myConferenceList: [] ,
            minNextConference: {},
            hasConference: true,
            user_id: '',
            modalModifyVisible: false,
            modalDetailVisible: false, 
            nowRowData: {}   
        }
    }  
    componentDidMount() {
        this.findList()  
    }
    signIn(meetingId) {
        let data = { 
            user_id: parseInt(this.props.user_id),
            meeting_id: meetingId
        }
        meetingSignIn(JSON.stringify(data)).then((res)=>{
            if (res.state == 0) {
                message.error(res.message)
            } else {
                message.success(res.message)
            }
            this.findList()
        })
    }
    accept(meetingId) {
        let data = { 
            user_id: parseInt(this.props.user_id),
            meeting_id: meetingId
        }
        meetingAccept(JSON.stringify(data)).then((res)=>{
            if (res.state == 0) {
                message.error(res.message)
            } else {
                message.success(res.message)
            }
            this.findList()
        })
    }
    reject(meetingId) {
        let data = { 
            user_id: parseInt(this.props.user_id),
            meeting_id: meetingId
        }
        meetingReject(JSON.stringify(data)).then((res)=>{
            if (res.state == 0) {
                message.error(res.message)
            } else {
                message.success(res.message)
            }
            this.findList()
        })
    }
    findList(){
        let data = { 
            user_id: parseInt(this.props.user_id || localStorage.getItem('user_id') || sessionStorage.getItem('user_id')),
        }  
        meeting7Search(JSON.stringify(data)).then((res)=>{
            this.setState({ myConferenceList : res.list, user_id: parseInt(this.props.user_id) },()=>{
                this.dayListFormat()
                this.findClosedMeeting()
            })
        })
    }
    findClosedMeeting() {
        let { myConferenceList } = this.state
        let nowDate = new Date()
        let now = nowDate.getTime()
        let minNextConference={},minNext = 0
        myConferenceList.map((conference,index)=>{
            let endDate = new Date(conference.endTime)
            let end = endDate.getTime()
            if ( (end - now < minNext || JSON.stringify(minNextConference) == '{}') && conference.userState !== 3) {
                if (end - now >= 0) {
                    minNext = end - now
                    minNextConference = conference    
                }
            }
        })
        if (JSON.stringify(minNextConference) == '{}') {
            this.setState({ minNextConference, hasConference: false })
        } else {
            this.setState({ minNextConference })
        }
    }
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
        if (x.end_hour < y.end_hour) {
            return -1
        } else if (x.end_hour > y.end_hour) {
            return 1
        } else {
            if (x.end_minute < y.end_minute) {
                return -1
            } else if (x.end_minute > y.end_minute) {
                return 1
            } else {
                return 0
            }
        }
    }
    sortList() {
        let { myConferenceList , sortByDayConferenceList } = this.state
        let tempSortList = sortByDayConferenceList
        let date = new Date()
        let now = date.getTime()
        
        myConferenceList.map((conference)=>{
            let month_day = moment(conference.startTime,"YYYY-MM-DD HH:mm:ss").format("MM-DD")
            let begin_time = moment(conference.startTime,"YYYY-MM-DD HH:mm:ss").format("HH:mm")
            let end_time = moment(conference.endTime,"YYYY-MM-DD HH:mm:ss").format("HH:mm")
            let show_time = `${begin_time}-${end_time}`
            let end_hour = moment(conference.endTime,"YYYY-MM-DD HH:mm:ss").format("HH")
            let end_minute = moment(conference.endTime,"YYYY-MM-DD HH:mm:ss").format("mm")
            let endDate = new Date(conference.endTime) 
            let end = endDate.getTime()
            if ( end - now > 0) {
                tempSortList.map((day)=>{
                    if ( day.month_day == month_day) {
                        begin_time = conference
                        day.meeting_list.push({...conference,show_time:show_time,end_hour:end_hour,end_minute:end_minute})
                        day.meeting_list.sort(this.compare)
                    }
                })    
            }
        })
        this.setState({sortByDayConferenceList: tempSortList},()=>{
        })
    }
    onPanelChange(value, mode) {
        console.log(value, mode);
    }     
    handleModify = meetingId => {
        meetingSearchCertain ({meeting_id : meetingId}).then((res)=>{ 
          this.setState({
            nowRowData:res
          },()=>{
            this.setState({
              modalModifyVisible: true,
            })
          })
        })  
    }
    handleDelete = meetingId => {
        meetingDelete({ meeting_id : meetingId}).then((res)=>{
            if (res.state == 1) {
                message.success(res.message)
            } else {
                message.error(res.message)
            }
            this.findList()
        })
    }
    handleDetail = meetingId => {
        meetingSearchCertain ({meeting_id : meetingId}).then((res)=>{ 
          this.setState({
            nowRowData:res
          },()=>{
            this.setState({
                modalDetailVisible: true,
            })
          })
        })  
    }
    handleCancelModify = () => {
        this.setState({  modalModifyVisible: false, modalDetailVisible: false })
        this.dayListFormat()
        this.findClosedMeeting()
    }
    handleCancelDetail = () => {
        this.setState({  modalModifyVisible: false, modalDetailVisible: false })
    }
  
    render() {    
        let { sortByDayConferenceList, minNextConference, hasConference, modalModifyVisible, modalDetailVisible, nowRowData } = this.state
        console.log(sortByDayConferenceList)
        return (
            <div>
                <Row style={{ padding: 20, paddingBottom: 0}}>
                    <Col span={5}>
                        <Title level={3} style={{padding: 10,paddingLeft: 0}}>会议列表</Title>
                    </Col>
                    <Col span={5} style={{height: 50, lineHeight: '50px'}}>
                        <Link to={{pathname:`/conference`,state: { conference: minNextConference, hasConference: hasConference}}}> 
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
                        { sortByDayConferenceList.map((day)=>{
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
                                                    <Col span={3} style={{height: 20, lineHeight: '20px'}}>
                                                    会议室名称
                                                    </Col>
                                                    <Col span={3} style={{height: 20, lineHeight: '20px'}}>
                                                    会议名称
                                                    </Col>
                                                    <Col span={3} style={{height: 20, lineHeight: '20px'}}>
                                                    主持人
                                                    </Col>
                                                    <Col span={3} style={{height: 20, lineHeight: '20px'}}>
                                                    会议主题
                                                    </Col>
                                                    <Col span={11} style={{height: 20, lineHeight: '20px'}}>
                                                    </Col>
                                                </Row>}
                                                <Row style={{position:'relative', border: '1px solid #d9d9d9', paddingTop: 10 ,paddingBottom: 10, paddingLeft: 10, marginTop: index !== 0 ? 20 : 0 , marginBottom: 20}}>   
                                                        <Col span={2} style={{height: 50, lineHeight: '50px',whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                        {meeting.show_time}&nbsp;
                                                        </Col>
                                                        <Col span={3} style={{height: 50, lineHeight: '50px',whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                         {meeting.roomName}&nbsp;
                                                        </Col>
                                                        <Col span={3} style={{height: 50, lineHeight: '50px',whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                         {meeting.meetingName}
                                                        </Col>
                                                        <Col span={3} style={{height: 50, lineHeight: '50px',whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                         {meeting.hostName}
                                                        </Col>
                                                        <Col span={3} style={{height: 50, lineHeight: '50px',whiteSpace: 'nowrap',overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                         {meeting.topic}
                                                        </Col>
                                                        <Col span={1} style={{height: 50, lineHeight: '50px'}}>
                                                        </Col>
                                                        <Col span={3} style={{height: 50, lineHeight: '50px'}}>
                                                        <span>
                                                            {meeting.hostId == this.props.user_id &&
                                                            <span>
                                                                <a onClick={() => this.handleModify(meeting.meetingId)}>修改</a>
                                                                    <Divider type="vertical" />
                                                                    <Popconfirm title="确定删除吗?" 
                                                                        okText="确定" 
                                                                        cancelText="取消"
                                                                        onConfirm={() => this.handleDelete(meeting.meetingId)}>
                                                                        <a>删除</a>
                                                                    </Popconfirm>              
                                                                    <Divider type="vertical" />
                                                            </span>}
                                                            <a onClick={() => this.handleDetail(meeting.meetingId)}>详细</a>
                                                            </span>
                                                        </Col>
                                                        <Col span={6} style={{height: 50, lineHeight: '50px'}}>
                                                            {meeting.userState < 2 && <Button style={{ marginLeft: 30 }} type="primary" ghost disabled>
                                                                已接受
                                                            </Button>}
                                                            {meeting.userState == 3 && <Button style={{ marginLeft: 30 }} type="primary" ghost disabled>
                                                                已拒绝
                                                            </Button>}
                                                            {meeting.userState == 2 && <Button style={{ marginLeft: 30 }} onClick={(e)=>this.accept(meeting.meetingId, e)} type="primary" ghost>
                                                                接&nbsp;受
                                                            </Button>}
                                                            {meeting.userState == 2 && <Button style={{ marginLeft: 30 }} onClick={(e)=>this.reject(meeting.meetingId, e)} type="primary" ghost>
                                                                拒&nbsp;绝
                                                            </Button>}
                                                            {meeting.userState == 0 && <Button style={{ marginLeft: 30 }} onClick={(e)=>this.signIn(meeting.meetingId, e)} type="primary" ghost>
                                                                签&nbsp;到
                                                            </Button>}
                                                            {meeting.userState == 1 && <Button style={{ marginLeft: 30 }} type="primary" ghost disabled>
                                                                已签到
                                                            </Button>}
                                                        </Col>
                                                </Row>
                                                {/* {meeting.room && <Row style={{ padding: 20, color: '#bfbfbf'}}>
                                                    {`${meeting.room.country} ${meeting.room.province} ${meeting.room.city} ${meeting.room.building} ${meeting.room.floor}楼`}
                                                </Row>} */}
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </Col>
                </Row>
                <Modal
                visible={modalModifyVisible}
                title="修改会议室"
                onCancel={this.handleCancelModify}
                footer={null}
                destroyOnClose
                >
                <MeetingAdd type="modify" userMeetingData={nowRowData} closeModal={this.handleCancelModify}></MeetingAdd>
                </Modal>
                <Modal
                    visible={modalDetailVisible}
                    title="详细信息"
                    onCancel={this.handleCancelDetail}
                    footer={null}
                    width={850}
                    destroyOnClose
                >
                <Descriptions title="会议信息" bordered >
                    <Descriptions.Item label="会议名称">{nowRowData.meetingName}</Descriptions.Item>
                    <Descriptions.Item label="会议ID">{nowRowData.meetingId}</Descriptions.Item>
                    <Descriptions.Item label="会议室名称">{nowRowData.room && nowRowData.room.roomName}</Descriptions.Item>
                    <Descriptions.Item label="会议室ID" >{nowRowData.room &&  nowRowData.room.roomId}</Descriptions.Item>
                    <Descriptions.Item label="开始时间"> {nowRowData.startTime}</Descriptions.Item>
                    <Descriptions.Item label="结束时间"> {nowRowData.endTime}</Descriptions.Item>
                    <Descriptions.Item label="发起人名称">{nowRowData.host && nowRowData.host.name}</Descriptions.Item>
                    <Descriptions.Item label="发起人用户名">{nowRowData.host && nowRowData.host.username}</Descriptions.Item>
                    <Descriptions.Item label="发起人ID">{nowRowData.host && nowRowData.host.userId}</Descriptions.Item>
                    <Descriptions.Item label="记录人名称">{nowRowData.recorder && nowRowData.recorder.name}</Descriptions.Item>
                    <Descriptions.Item label="记录人用户名">{nowRowData.recorder && nowRowData.recorder.username}</Descriptions.Item>
                    <Descriptions.Item label="记录人ID">{nowRowData.recorder && nowRowData.recorder.userId}</Descriptions.Item>
                    <Descriptions.Item span={3} label="参会人员">{(()=>{ 
                        let nowMembers = ``
                        nowRowData.members && nowRowData.members.map((item)=>{
                            nowMembers = `${nowMembers} ${item.name}`
                        })
                        return nowMembers || '暂无'
                    })()}</Descriptions.Item>
                    <Descriptions.Item span={3} label="拒绝人员">{(()=>{ 
                        let nowMembers = ``
                        nowRowData.reject && nowRowData.reject.map((item)=>{
                            nowMembers = `${nowMembers} ${item.name}`
                        })
                        return nowMembers || '暂无'
                    })()}</Descriptions.Item>
                    <Descriptions.Item span={3} label="签到人员">{(()=>{ 
                        let nowMembers = ``
                        nowRowData.attendance && nowRowData.attendance.map((item)=>{
                            nowMembers = `${nowMembers} ${item.name}`
                        })
                        return nowMembers || '暂无'
                    })()}
                    </Descriptions.Item>
                    <Descriptions.Item span={3} label="未签到人员">{(()=>{ 
                        let nowMembers = ``
                        nowRowData.unSign && nowRowData.unSign.map((item)=>{
                            nowMembers = `${nowMembers} ${item.name}`
                        })
                        return nowMembers || '暂无'
                    })()}</Descriptions.Item>
                    <Descriptions.Item label="会议类型" span={3}> {nowRowData.topic}</Descriptions.Item>
                    <Descriptions.Item label="会议摘要" span={3}>{nowRowData.meetingAbstract}</Descriptions.Item>
                    <Descriptions.Item label="备注" span={3}>{nowRowData.remark}</Descriptions.Item>
                </Descriptions>
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin,
      user_id: state.userState.user_id
    };
};

export default connect(mapStateToProps, {logout})(ConferenceList);
  