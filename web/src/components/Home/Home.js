import React from 'react'
import './Home.css'
import { userLoginVerification ,userLoginExit} from '../../api/apiUser'
import { informAll , watch, publish} from '../../api/apiMessage'
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import { connect } from 'react-redux';
import Order from '../Order/Order'
import Conference from '../Conference/Conference'
import User from '../User/User'
import Message from '../Message/Message'
import Meeting from '../Meeting/Meeting'
import Room from '../Room/Room'
import Device from '../Device/Device'
import Main from '../Main/Main'
import Form from '../Form/Form'
import SelfInfo from '../SelfInfo/SelfInfo'
import FormControl from '../FormControl/FormControl'
import { logout } from '../../actions/index'
import { Avatar, Badge, Layout, Menu, Icon, Typography, Row, Col, Popover, message, List} from 'antd'
import { navList } from '../../constants/navListConstants' 
const { Header, Sider, Content, } = Layout;
const { Title } = Typography;

import '../../constants/websocket'
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.quit = this.quit.bind(this)
        this.state = {
            collapsed :false,
            nav: props.nav,
            title: props.title,
            id: '',
            name: '',
            selfInfo: []
        }
    }  
    componentDidMount() {
        let { pathname } = this.props
        let getLoginVerification = new Promise((resolve, reject) => { 
            userLoginVerification().then((res) => {
                this.openWebSocket()
            }).catch((error)=>{
                this.props.logout()
            })
        })
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function() {
            if ('WebSocket' in window) {
                this.closeWebSocket();
            }
        }
    }
    openWebSocket = () => {
        let url = "ws://39.99.172.71:8080/" + localStorage.getItem('user_id') +  "/" + localStorage.getItem('token') +  "/" + localStorage.getItem('username');
        console.log(url);
        //判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
            global.socket.websocket = new WebSocket(url);
        } else {
            let data = { id: this.state.id, name: this.state.name}
            watch(data)
            message.error('当前浏览器 Not support websocket')
        }
        //连接发生错误的回调方法
        global.socket.websocket.onerror = function() {
            message.error("WebSocket连接发生错误");
        }
        //连接成功建立的回调方法
        global.socket.websocket.onopen = function() {
            message.success("WebSocket连接成功");
        }
        //接收到消息的回调方法
        global.socket.websocket.onmessage = function(event) {
            let res = JSON.parse(event.data)
            message.success(event.data);
        }
        //连接关闭的回调方法
        global.socket.websocket.onclose = function() {
            message.success("WebSocket连接关闭");
        }
    }
    //关闭WebSocket连接
    closeWebSocket() {
        global.socket.websocket.close();
    }
    //发送消息
    send() {
        global.socket.websocket.send(message);
    }
    quit() {
        userLoginExit().then((res) => {
            if (res.state == 1) {
                this.props.logout()
                this.closeWebSocket() 
                message.success('退出成功')
            } else {
                message.error('退出失败')
                this.closeWebSocket() 
            }
        }).catch((err)=>{
            this.props.logout()
        })
    }
    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed
        });
      };    
    handleNav = (e) => {
        this.setState({
            nav : e.key,
            title: navList[e.key].label
        })
    }
    sendMessage = () =>{
        informAll()
    }
    sendMessage2 = () =>{
        let data = {namespace : `${this.state.id}${this.state.name}`} 
        publish(data)
    }
    render() {    
        let { selfInfo} = this.state
        let { pathname , mynav , title} = this.props
        const text = <span>消息</span>;
        const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
            <div><a onClick={this.sendMessage}>发送消息</a><a onClick={this.sendMessage2}>发送消息2</a></div>
        </div>
        );
        return (
            <BrowserRouter>
                <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo" />
                    <Menu onClick={this.handleNav} theme="dark" mode="inline" style={{ lineHeight: '40px' }} defaultSelectedKeys={[mynav+'']}>
                        {navList.map((res) => 
                            {
                            let role = localStorage.getItem('role') || 2
                            if (res.role >= role) {
                                return(
                                    <Menu.Item key={res.key}>
                                        <Icon type={res.type} />
                                        <span>{res.label}</span>
                                        <Link to={res.linkTo}></Link>
                                    </Menu.Item>
                                )}
                            }
                        )}
                    </Menu>
                </Sider>
                <Layout style={{ minHeight: '100vh', minWidth: 1109}}>
                    <Header style={{ background: '#fff', padding: 5}}>            
                    <Row>
                        <Col span={2}>
                            <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                            style={{width: 30, fontSize: 22}}
                            />
                        </Col>
                        <Col span={6}>
                            <div style={{
                                display: 'inline-block',
                                paddingLeft: 10
                            }}>
                                <Title level={3}>{this.state.title}</Title>
                            </div>
                        </Col> 
                        <Col span={10}>
                        </Col>
                        <Col span={1}>
                            <Popover placement="bottom" title={<span>消息</span>} content={content} >
                                <Badge count={1}>
                                    <Icon style={{width: 50, fontSize: 22, cursor: 'pointer'}} type="mail" />
                                </Badge>
                            </Popover>
                        </Col>
                        <Col span={1}>
                        </Col>
                        <Col span={1}>
                            <div >
                                <Link to={'/selfinfo'}><Icon onClick={()=>{this.setState({title: '个人资料'})}} type="smile" style={{width: 50, fontSize: 22, cursor: 'pointer'}} /></Link>
                            </div>
                        </Col>
                        <Col span={1}>
                        </Col>
                        <Col span={1}>
                            <Icon type="close" style={{width: 50, fontSize: 22, cursor: 'pointer'}} onClick={this.quit} />
                        </Col>
                    </Row>
                    </Header>
                    <Content
                        style={{
                        margin: '24px auto',
                        padding: 24,
                        background: '#fff',
                        width: 1109
                        }}
                    >
                        <Switch>
                            <Route path="/main" component={Main}></Route>
                            <Route path="/conference" component={Conference}></Route>
                            <Route path="/order" component={Order}></Route>
                            <Route path="/message" component={Message}></Route>
                            <Route path="/user" component={User}></Route>
                            <Route path="/meeting" component={Meeting}></Route>
                            <Route path="/room" component={Room}></Route>
                            <Route path="/device" component={Device}></Route>
                            <Route path="/form" component={Form}></Route>
                            <Route path="/selfinfo" component={() => <SelfInfo info={selfInfo}></SelfInfo>}></Route>
                            <Route path="/formcontrol" component={FormControl}></Route>
                            <Redirect from={"*"} to={pathname} />
                        </Switch>
                    </Content>
                </Layout>
                </Layout>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin,
      nav: state.nav.nav
    };
};

export default connect(mapStateToProps , { logout })(Home);
  