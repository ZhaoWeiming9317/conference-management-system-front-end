import React from 'react'
import './welcome.sass'
import Login from './../login/login';
import Regist from './../regist/regist';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";


function Change(props) {
    const isLogin = props.isLogin;
    if (isLogin) {
      return (
          <Redirect to={{ pathname: '/login'}}/>
      );
    }
    return (
        <Redirect to={{ pathname: '/regist'}}/>
    );
}
  
class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: true
        };
        this.gotoRegist = this.gotoRegist.bind(this);
    };
    componentDidMount() {
    };
    gotoRegist = event => {
        console.log('suc')
        this.setState({
            isLogin: false,
        });
    }; 
    gotoLogin = event => {
        console.log('suc')
        this.setState({
            isLogin: true,
        });
    };           
    render() {    
    return (
        <div class="begin-container">
            <div class="begin-box">
            <div class="swiper-cover">
            </div>
            <div class="swiper-left">
            </div>
            <div class="swiper-right">
            </div>
            <div class="mention left-mention">
                <div class="mention-title">
                </div>
            </div>
            <div class="mention right-mention">
                <div class="mention-title">
                欢迎回来
                </div>
                <div class="mention-subtitle">
                会议室管理系统，如需注册请点击下方按钮
                </div>
                <div class="button button-hollow" onClick={this.gotoRegist}>
                注册
                </div>
            </div>
            <div id="change">
                <BrowserRouter>
                    <Switch>
                        <Route path="/login" component={Login} gotoRegist={this.gotoRegist}></Route>
                        <Route path="/regist" component={Regist} gotoLogin={this.gotoLogin}></Route>
                    </Switch>
                    <Change isLogin={this.state.isLogin}></Change>
                </BrowserRouter>
            </div> 
            </div>
        </div>
    );
    }
}
export default Welcome
