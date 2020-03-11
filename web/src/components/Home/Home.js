import React from 'react'
import './Home.css'
import { userLoginVerification ,userLoginExit, userShowInfo} from '../../api/apiUser'
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import { connect } from 'react-redux';
import Order from '../Order/Order'
import User from '../User/User'
import Meeting from '../Meeting/Meeting'
import Room from '../Room/Room'
import Device from '../Device/Device'
import Main from '../Main/Main'
import Form from '../Form/Form'
import { logout } from '../../actions/index'
import { Avatar, Badge, Layout, Menu, Icon, Typography, Row, Col, Popover, message} from 'antd'
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
            nav: 0,
            title: '首页',
            id: '',
            name: ''
        }
    }  
    componentDidMount() {
        let cookie = localStorage.getItem('cookie') || 0
        console.log(cookie)
        const data = {cookie : cookie}    
        let getLoginVerification = new Promise((resolve, reject) => { 
            userLoginVerification(JSON.stringify(data)).then((res) => {
                if (res.state == 0) {
                    this.props.logout()
                    console.log(this.props.isLogin)
                } else {
                    this.setState({
                        id: res.user_id
                    })
                    resolve(res)
                }
            }).catch((error)=>{
                message.error("系统错误")
            })
        })
        let getUserName = getLoginVerification.then((res)=>{
            const data = { user_id: res.user_id}
            return new Promise((resolve, reject)=>{
                userShowInfo(JSON.stringify(data)).then((res)=>{
                    console.log(res)
                    this.setState({
                        name: res.username
                    })    
                    resolve(res)
                })
            })
        })

        getUserName.then((res)=>{
            console.log('带带嗲嗲哒哒哒哒哒哒',res)
            this.openWebSocket()
        })
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function() {
            this.closeWebSocket();
        }

    }
    openWebSocket = () => {
        var url = "ws://39.99.172.71:8080/" + this.state.id +  "/" + this.state.name;
        console.log(url);
        //判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
            global.socket.websocket = new WebSocket(url);
        } else {
            message.error('当前浏览器 Not support websocket')
        }
        //连接发生错误的回调方法
        global.socket.websocket.onerror = function() {
            message.error("WebSocket连接发生错误");
        };
        //连接成功建立的回调方法
        global.socket.websocket.onopen = function() {
            message.success("WebSocket连接成功");
        }
        //接收到消息的回调方法
        global.socket.websocket.onmessage = function(event) {
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
        console.log(localStorage.getItem('cookie'))
        userLoginExit({token : localStorage.getItem('cookie')}).then((res) => {
            if (res.state == 1) {
                localStorage.removeItem('cookie')
                localStorage.removeItem('role')
                this.props.logout()
                this.closeWebSocket() 
                message.success('退出成功')
            } else {
                message.error('退出失败')
                this.closeWebSocket() 
            }
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
    render() {    
        let { nav } = this.state
        const text = <span>消息</span>;
        const content = (
        <div>
            <p>Content</p>
            <p>Content</p>
        </div>
        );

        return (
            <BrowserRouter>
                <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo" />
                    <Menu onClick={this.handleNav} theme="dark" mode="inline" style={{ lineHeight: '40px' }} defaultSelectedKeys={['0']}>
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
                <Layout style={{ minHeight: '100vh' }}>
                    <Header style={{ background: '#fff', padding: 5 }}>            
                    <Row type="flex">
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
                        <Col span={14}>
                        </Col>
                        <Col span={1}>
                            <Popover placement="bottom" title={text} content={content} >
                                <Badge count={1}>
                                    <Avatar style={{cursor: 'pointer'}} shape="square" icon="user" />
                                </Badge>
                            </Popover>
                        </Col>
                        <Col span={1}>
                            <Icon type="close" style={{width: 50, fontSize: 22}} onClick={this.quit}/>
                        </Col>
                    </Row>
                    </Header>
                    <Content
                        style={{
                        margin: '24px 16px',
                        padding: 24,
                        background: '#fff'
                        }}
                    >
                        <Switch>
                            <Route path="/main" component={Main}></Route>
                            <Route path="/order" component={Order}></Route>
                            <Route path="/user" component={User}></Route>
                            <Route path="/meeting" component={Meeting}></Route>
                            <Route path="/room" component={Room}></Route>
                            <Route path="/device" component={Device}></Route>
                            <Route path="/form" component={Form}></Route>
                        </Switch>
                        <Redirect to={{ pathname: '/main'}}/>
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
  