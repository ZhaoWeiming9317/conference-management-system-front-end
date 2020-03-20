import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { meetingSearchCertain } from '../../api/apiMeeting'
import { connect } from 'react-redux'
import { logout } from '../../actions/index'
import {  Row, Col, Typography, Divider, Button} from 'antd';
const { Title } = Typography;
import { Link } from "react-router-dom";

class Conference extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            d: 0,
            h: 0,
            m: 0,
            s: 0,
            conference: props.location.state.conference,
            certainConference : {},
            memo: ''
        }
    }  
    componentDidMount() {
        this.getCertainConference()
        this.countTime()
    }
    getCertainConference = () => {
        let conference = this.props.location.state.conference
        let data = { meeting_id:conference.meetingId}
        if (this.props.location.state.hasConference== true ) {
            meetingSearchCertain(JSON.stringify(data)).then((res)=>{
                this.setState( { certainConference : res } )
            })    
        }
    }
    countTime = () => {
        let conference = this.props.location.state.conference 
        //获取当前时间  
        let date = new Date()
        let now = date.getTime()
        //设置开始时间  
        let startStr = conference.startTime
        let endStr = conference.endTime
        let startDate = new Date(startStr)
        let endDate = new Date(endStr) 
        let start = startDate.getTime() 
        let end = endDate.getTime()
        let leftTime = 0
        //时间差,且已经开始会议
        if ( now - start > 0) {
            leftTime = end - now
            this.setState({memo: '距离本次会议结束'})
        } else {
            leftTime = start - now
            this.setState({memo: '距离下次会议开始'})
        }
        //定义变量 d,h,m,s保存倒计时的时间  
        let d,h,m,s
        if (leftTime >= 0) {  
            d = this.PrefixInteger(Math.floor(leftTime/1000/60/60/24),2)  
            h = this.PrefixInteger(Math.floor(leftTime/1000/60/60%24),2)
            m = this.PrefixInteger(Math.floor(leftTime/1000/60%60),2)
            s = this.PrefixInteger(Math.floor(leftTime/1000%60),2)            
        }  
        this.setState(
            {d,h,m,s}
        )        
        //递归每秒调用countTime方法，显示动态时间效果  
        setTimeout(this.countTime,1000);  
    }  
    //num传入的数字，n需要的字符长度
    //js 数字前面自动补零
    PrefixInteger = (num, n) => {
        return (Array(n).join(0) + num).slice(-n);
    }   
       
    render() {    
        let { isLogin } = this.props
        let hasConference = this.props.location.state.hasConference
        let { d, h, m, s, certainConference, memo } = this.state
        return (
            <div>
                { hasConference == false && <div>
                    <Row style={{ padding: 20, paddingBottom: 0}}>
                        <Col span={6}>
                            <Title level={3} style={{padding: 10,paddingLeft: 0}}>会议面板</Title>
                        </Col>
                        <Col span={6} style={{height: 50, lineHeight: '50px'}}>
                            <Link to={`/main/conferencelist`}> 
                                <Button type="primary" ghost>
                                    会议列表
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <Row style={{ padding: 20, paddingBottom: 0}}>
                        <Col span={6}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}>暂时没有会议</div>
                        </Col>
                    </Row>
                </div>}
                { hasConference == true && <div>
                    <Row style={{ padding: 20, paddingBottom: 0}}>
                        <Col span={6}>
                            <Title level={3} style={{padding: 10,paddingLeft: 0}}>会议面板</Title>
                        </Col>
                        <Col span={6} style={{height: 50, lineHeight: '50px'}}>
                            <Link to={`/main/conferencelist`}> 
                                <Button type="primary" ghost>
                                    会议列表
                                </Button>
                            </Link>
                        </Col>
                        <Col span={10} style={{height: 50, lineHeight: '50px'}}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 22}}>{ `${memo}${d}天${h}时${m}分${s}秒`}</div>
                        </Col>                    
                    </Row>
                    <Row style={{ padding: 20, paddingBottom: 0}}>
                        <Col span={6}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}>会议名称:&nbsp; {certainConference.meetingName}</div>
                        </Col>
                        <Col span={6}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}>房间名称:&nbsp; {certainConference.room && certainConference.room.roomName}</div>
                        </Col>
                        <Col span={10}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}> {`${certainConference.startTime || ''} - ${certainConference.endTime || ''}`}</div>
                        </Col>
                    </Row>
                    <Row style={{ padding: 20, paddingBottom: 0}}>
                        <Col span={6}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}>
                                <span>发起人:&nbsp;{certainConference.host && certainConference.host.name}</span>
                                <span style={{ color: '#d9d9d9' }}>&nbsp;{certainConference.host && certainConference.host.username}</span>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}>
                                <span>记录人:&nbsp; {certainConference.recorder && certainConference.recorder.name}</span>
                                <span style={{ color: '#d9d9d9' }}>&nbsp;{certainConference.recorder && certainConference.recorder.username}</span>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}>
                                <span>会议主题:&nbsp; {`${certainConference.topic}`}</span>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}>
                                <span>会议摘要:&nbsp; {`${certainConference.meetingAbstract}`}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ padding: 20, paddingBottom: 0}}>
                        <Col span={24}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}>
                                <span style={{display: 'inline-block'}}>参会者:&nbsp;</span>
                                {certainConference.members && certainConference.members.map((members)=>{
                                    return(
                                        <div style={{ display: 'inline-block' }}>
                                            <span>{members && members.name}</span>
                                            <span style={{ color: '#d9d9d9' }}>&nbsp;{members && members.username}&nbsp;&nbsp;</span>   
                                            &nbsp;    
                                        </div>
                                    )
                                })}
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ padding: 20, paddingBottom: 0}}>
                        <Col span={24}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}>
                                <span style={{display: 'inline-block'}}>签到人员:&nbsp;</span>
                                {certainConference.members && certainConference.attendance.map((attendance)=>{
                                    return(
                                        <div style={{ display: 'inline-block' }}>
                                            <span>{attendance && attendance.name}</span>
                                            <span style={{ color: '#d9d9d9' }}>&nbsp;{attendance && attendance.username}&nbsp;&nbsp;</span>   
                                            &nbsp;    
                                        </div>
                                    )
                                })}
                            </div>
                        </Col>
                    </Row>

                    <Row style={{ padding: 20, paddingBottom: 0}}>
                        <Col span={24}>
                            <div style={{height: 50, lineHeight: '50px',fontSize: 16}}>
                                <span style={{display: 'inline-block'}}>缺席人员:&nbsp;</span>
                                {certainConference.members && certainConference.absent.map((absent)=>{
                                    return(
                                        <div style={{ display: 'inline-block' }}>
                                            <span>{absent && absent.name}</span>
                                            <span style={{ color: '#d9d9d9' }}>&nbsp;{absent && absent.username}&nbsp;&nbsp;</span>   
                                            &nbsp;    
                                        </div>
                                    )
                                })}
                            </div>
                        </Col>
                    </Row>
                </div>}
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps, {logout})(Conference)