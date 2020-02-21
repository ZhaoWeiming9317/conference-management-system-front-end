import React from 'react'
import './Home.css'
import { userLoginVerification ,userLoginExit} from '../../api/apiUser'
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
import { Avatar, Badge, Layout, Menu, Icon, Typography, Row, Col} from 'antd'
import { navList } from '../../constants/navListConstants' 
const { Header, Sider, Content, } = Layout;
const { Title } = Typography;

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.quit = this.quit.bind(this)
        this.state = {
            collapsed :false,
            nav: 0,
            title: '首页'
        }
    }  
    componentDidMount() {
        let cookie = localStorage.getItem('cookie') || 0
        console.log(cookie)
        const data = {cookie : cookie}    
        userLoginVerification(JSON.stringify(data)).then((res) => {
            if (res.state == 0) {
                this.props.logout()
                console.log(this.props.isLogin)
            } else {
            }
        })    
    }
    quit() {
        console.log(localStorage.getItem('cookie'))
        userLoginExit({token : localStorage.getItem('cookie')}).then((res) => {
            if (res.state == 1) {
                localStorage.removeItem('cookie')
                this.props.logout()
            } else {
                this.props.logout()
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
        return (
            <BrowserRouter>
                <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo" />
                    <Menu onClick={this.handleNav} theme="dark" mode="inline" style={{ lineHeight: '40px' }} defaultSelectedKeys={['0']}>
                        {navList.map((res) => (
                            <Menu.Item key={res.key}>
                                <Icon type={res.type} />
                                <span>{res.label}</span>
                                <Link to={res.linkTo}></Link>
                            </Menu.Item>
                        ))}
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
                            <Badge count={1}>
                                <Avatar shape="square" icon="user" />
                            </Badge>
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
  