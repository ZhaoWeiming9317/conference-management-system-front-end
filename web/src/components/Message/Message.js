import React from 'react'
import './Message.sass'
import { userLoginVerification } from '../../api/apiUser'
import { messageSearch, messageHaveRead, messageAllHaveRead  } from '../../api/apiMessage'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import { Row, Col, List, Typography, Button, Radio} from 'antd';

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listData : [ ],
            total: 0
        }
    }  
    componentDidMount() {
        userLoginVerification().then((res) => {
            if (res.state == 0) {
                this.props.logout()
            } else {
                this.init()
            }
        })
    }
    init(have_read = 2) {
        let data = {
            user_id: this.props.user_id,
            have_read: have_read,
            page: 1,
            volume: 10,
            message_topic: ''
        }
        messageSearch(JSON.stringify(data)).then((res)=>{
            this.setState({listData: res.list,
                            total: res.total})
        })
    }

    signForRead(e,messageId) {
        let data = {message_id: [messageId]}
        messageHaveRead(JSON.stringify(data)).then((res)=>{
            this.init()
        })
    }
    render() {    
        let { isLogin } = this.props
        let { listData } = this.state
        return (
            <div>    
                <Row>
                    <Col span={4}>
                        <div style={{ marginBottom: 16 }}>你的信息</div>
                    </Col>
                    <Col span={20}>
                        <Radio.Group defaultValue="2" name="radiogroup" onChange={(e)=>{this.init(e.target.value)}}>
                            <Radio value="2">全部</Radio>
                            <Radio value="1">已读</Radio>
                            <Radio value="0">未读</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
                <List
                    bordered
                    dataSource={listData}
                    renderItem={item => (
                        <List.Item className="message_list"> 
                            <Row onClick={(e)=>{this.signForRead(e,item.messageId)}} style={{ fontWeight: item.haveRead == 0 ? 600: 300, padding: 10 , width: 1000, height: 55, cursor: item.haveRead == 0 ? 'pointer':'default'}}>
                                <Col span={2}>
                                    <div style={{ marginLeft: 16, height: 35,lineHeight: '35px',verticalAlign: 'middle'}}><Typography.Text>{item.senderName}</Typography.Text></div>
                                </Col>
                                <Col span={14}>
                                    <div style={{ marginLeft: 16, height: 35,lineHeight: '35px',verticalAlign: 'middle'}}><Typography.Text>{`${item.messageBody}`}</Typography.Text></div>
                                </Col>
                                <Col span={6}>
                                    <div style={{ marginLeft: 16, height: 35,lineHeight: '35px',verticalAlign: 'middle'}}>{`${item.sendTime}`}</div>
                                </Col>
                                <Col span={2}>
                                    {item.haveRead == 0 &&<Button style={{ marginLeft: 30, width: 88 }} onClick={(e)=>this.signIn(e,item.messageId)} type="primary" ghost>
                                        标记已读
                                    </Button>}
                                    {item.haveRead == 1 &&<Button style={{ marginLeft: 30, width: 88 }} onClick={(e)=>this.signIn(e,item.messageId)} type="primary" ghost disabled>
                                        已&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;读
                                    </Button>}
                                </Col>
                            </Row>
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin,
      user_id: state.userState.user_id,
    };
};

export default connect(mapStateToProps, { logout })(Message);
