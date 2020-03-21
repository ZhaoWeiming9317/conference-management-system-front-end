import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route, Redirect,withRouter } from "react-router-dom";
import './App.sass'
import loadable from './util/loadable'
const Home = loadable(()=>import('./components/Home/Home'))
const Welcome = loadable(()=>import('./components/Welcome/Welcome'))
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import { navList } from './constants/navListConstants' 
import { userLoginVerification } from './api/apiUser'
import { logout, login } from './actions/index'

function Change(props) {
    let isLogin = props.isLogin;
    if (isLogin) {
        return (
            <Redirect to={{ pathname: '/home'}}/>
        )
    }
    return (
        <Redirect to={{ pathname: '/welcome'}}/>
    );
}
  
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: zhCN,
        }
        this.pathname = ( window.location.pathname == '/' 
        || window.location.pathname == '/login' 
        || window.location.pathname == '/selfinfo' 
        || window.location.pathname == '/conference') ? '/conferencelist' : window.location.pathname

        navList.map((nav)=>{
            if ( nav.linkTo == this.pathname ) {
                this.nav = nav.key
                this.title = nav.label
            }
        })
    }  
    componentDidMount() {
        userLoginVerification().then((res) => {
            if (res.message == '验证失败') {
                this.props.logout()
            } else {
                this.props.login()
            }
        })
    }
    render () {
        const { isLogin } = this.props
        return (
            <ConfigProvider locale={this.state.locale}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/home" component={() => <Home pathname={this.pathname} mynav={this.nav} title={this.title}></Home>}></Route>
                        <Route path="/welcome" component={Welcome}></Route>
                    </Switch>
                    { isLogin ? <Redirect to={{ pathname: '/home'}}/> : <Redirect to={{ pathname: '/welcome'}}/>}
                </BrowserRouter>
            </ConfigProvider>
        )  
    }
}


const mapStateToProps = (state) => {
    return {
        isLogin: state.userState.isLogin
    };
};
  
  
export default connect(mapStateToProps, {logout, login})(App);

