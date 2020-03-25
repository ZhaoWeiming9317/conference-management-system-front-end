import React from 'react'
import './Message.sass'
import { userLoginVerification } from '../../api/apiUser'
import { messageSearch, messageHaveRead, messageAllHaveRead, messageDetail } from '../../api/apiMessage'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import { Row, Col, List, Typography, Button, Radio, Spin, Modal, Popconfirm, message} from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
const { Title, Paragraph, Text } = Typography;

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listData : [ ],
            total: 0,
            loading: false,
            hasMore: true,  
            have_read: 2,
            page: 1 ,
            modalVisible: false,
            nowRowData: []
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
    init(have_read = 2, page = 1) {
        let { listData } = this.state;
        this.setState({have_read , page})
        let data = {
            user_id: this.props.user_id,
            have_read: have_read,
            page: page,
            volume: 10,
            message_topic: ''
        }
        messageSearch(JSON.stringify(data)).then((res)=>{
            if ( page != 1) {
                let newListData = listData.concat(res.list);
                this.setState({
                    listData: newListData,
                    total: res.total,
                    loading: false,
                })
            } else {
                this.setState({
                    listData: res.list,
                    total: res.total,
                    loading: false,
                })
            }
        })
    }

    read(e,messageId, have_read) {
        messageDetail(JSON.stringify({message_id: messageId})).then((res)=>{
            this.setState({nowRowData: res},()=>{this.setState({modalVisible: true})})
            if ( have_read == 0) {
                let data = {message_id: [messageId]}
                messageHaveRead(JSON.stringify(data)).then((res)=>{
                    this.init()
                })    
            } 
        })
    }
    signForReadAll(e,user_id) {
        let data = {user_id: user_id}
        messageAllHaveRead(JSON.stringify(data)).then((res)=>{
            this.init()
        })
    }
    handleInfiniteOnLoad = () => {
        let { listData, total, have_read, page } = this.state;
        this.setState({
            loading: true,
        })
        if (listData.length > total) {
          message.warning('到底了');
          this.setState({
            hasMore: false,
            loading: false,
          })
          return
        }
        this.init(have_read, page + 1)
    }  
    handleCancel = () => {
        this.setState({ modalVisible: false })
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
                    <Col span={15}>
                        <Radio.Group defaultValue="2" name="radiogroup" onChange={(e)=>{this.init(e.target.value)}}>
                            <Radio value="2">全部</Radio>
                            <Radio value="1">已读</Radio>
                            <Radio value="0">未读</Radio>
                        </Radio.Group>
                    </Col>
                    <Col span={5}>
                        <Button style={{ marginLeft: 30 }} onClick={(e)=>this.signForReadAll(e,this.props.user_id)} type="primary" ghost>
                            全部标记已读
                        </Button>
                    </Col>
                </Row>
                <div className="demo-infinite-container">
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={0}
                        loadMore={this.handleInfiniteOnLoad}
                        hasMore={!this.state.loading && this.state.hasMore}
                        useWindow={false}
                    >
                        <List
                            dataSource={listData}
                            renderItem={item => (
                                <List.Item className="message_list"> 
                                    <Row onClick={(e)=>{this.read(e,item.messageId, item.haveRead)}} style={{ fontWeight: item.haveRead == 0 ? 600: 300, padding: 10 , width: 1000, height: 55, cursor: item.haveRead == 0 ? 'pointer':'default'}}>
                                        <Col span={2}>
                                            <div style={{ marginLeft: 8, height: 35,lineHeight: '35px',verticalAlign: 'middle'}}>{`${item.senderName}`}</div>
                                        </Col>
                                        <Col span={14}>
                                            <div style={{ marginLeft: 16,  width: 520,height: 35,lineHeight: '35px',verticalAlign: 'middle', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{`${item.messageBody}`}</div>
                                        </Col>
                                        <Col span={5}>
                                            <div style={{ marginLeft: 16, height: 35,lineHeight: '35px',verticalAlign: 'middle'}}>{`${item.sendTime}`}</div>
                                        </Col>
                                        <Col span={3}>
                                            {item.haveRead == 0 &&<Button style={{ marginLeft: 30, width: 88 }} onClick={(e)=>this.signForRead(e,item.messageId)} type="primary" ghost>
                                                标记已读
                                            </Button>}
                                            {item.haveRead == 1 &&<Button style={{ marginLeft: 30, width: 88 }} onClick={(e)=>this.signForRead(e,item.messageId)} type="primary" ghost disabled>
                                                已&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;读
                                            </Button>}
                                        </Col>
                                    </Row>
                                </List.Item>
                            )}
                        >
                            {this.state.loading && this.state.hasMore && (
                                <div className="demo-loading-container">
                                    <Spin />
                                </div>
                            )}
                        </List>
                    </InfiniteScroll>
                </div>
                <Modal
                visible={this.state.modalVisible}
                title="详细信息"
                onCancel={this.handleCancel}
                footer={null}
                destroyOnClose
                width={850}
                >
                    {(()=>{
                        let res = this.state.nowRowData
                        if (res) {
                            return (
                                <Typography>
                                    <Paragraph>{res.messageTopic}</Paragraph>
                                    <Paragraph>
                                        <Text strong>{res.messageHeader}</Text>
                                        {res.messageBody}
                                    </Paragraph>
                                    <Paragraph>
                                        <Text>{`来自 ${res.senderName}`}</Text>
                                        <Text disabled>{` ${res.senderUserName}`}</Text>
                                    </Paragraph>
                                    <Paragraph>
                                        <Text>{`发送时间 ${res.sendTime}`}</Text>
                                    </Paragraph>
                                </Typography>)        
                        }
                    })()}
                </Modal>
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
