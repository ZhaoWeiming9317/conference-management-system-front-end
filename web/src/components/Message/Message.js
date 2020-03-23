import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { messageSearch } from '../../api/apiMessage'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import { Row, Col, List, Typography, Button, Badge} from 'antd';

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
    init() {
        let data = {
            user_id: this.props.user_id,
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
    }
    render() {    
        let { isLogin } = this.props
        let { listData } = this.state
        return (
            <div>    
                <h3 style={{ marginBottom: 16 }}>你的信息</h3>
                <List
                    bordered
                    dataSource={listData}
                    renderItem={item => (
                        <List.Item>
                            <Row style={{ padding: 10 , width: 1000, height: 55}}>
                                <Col span={3}>
                                    <div style={{ marginLeft: 16, height: 35,lineHeight: '35px',verticalAlign: 'middle'}}>{item.senderName}</div>
                                </Col>
                                <Col span={13}>
                                    <div style={{ marginLeft: 16, height: 35,lineHeight: '35px',verticalAlign: 'middle'}}>{`${item.messageBody}`}</div>
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
