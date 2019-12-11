import React from 'react'
import './Welcome.sass'
import Login from './../Login/Login';
import Regist from './../Regist/Regist';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { gotoRegist, gotoLogin } from '../../actions/index'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import { CSSTransition } from 'react-transition-group'

function Change(props) {
    let loginView = props.loginView;
    if (loginView) {
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
    }  
    componentDidMount() {
    };
    render() {    
        let { loginView ,gotoLogin,gotoRegist} = this.props
        return (
            <div className="welcome__begin--container">
                <div className="welcome__begin--box">
                    <div className="welcome__swiper--cover">
                    </div>
                    <div className="welcome__swiper welcome__swiper--left">
                    </div>
                    <div className="welcome__swiper welcome__swiper--right">
                    </div>
                    <CSSTransition in={!loginView} timeout={1000} classNames="welcome__mention--login" unmountOnExit>
                        <div className="welcome__mention">
                            <div className="welcome__mention--title">
                            你好朋友
                            </div>
                            <div className="welcome__mention--subtitle">
                            会议室管理系统，如需登录请点击下方按钮
                            </div>
                            <ButtonUI label="登录" buttonStyle="hollow" onClick={gotoLogin}></ButtonUI>
                        </div>
                    </CSSTransition>
                    <CSSTransition in={loginView} timeout={1000} classNames="welcome__mention--regist" unmountOnExit>
                        <div className="welcome__mention">
                            <div className="welcome__mention--title">
                                欢迎回来
                            </div>
                            <div className="welcome__mention--subtitle">
                            会议室管理系统，如需注册请点击下方按钮
                            </div>
                            <ButtonUI label="注册" buttonStyle="hollow" onClick={gotoRegist}></ButtonUI>
                        </div>
                    </CSSTransition>
                    <div id="change">
                        <BrowserRouter>
                            <Switch>
                                <Route path="/login" component={Login}></Route>
                                <Route path="/regist" component={Regist}></Route>
                            </Switch>
                            <Change loginView={loginView}></Change>
                        </BrowserRouter>
                    </div> 
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      loginView: state.nav.loginView
    };
};

export default connect(mapStateToProps, { gotoRegist,gotoLogin})(Welcome);
  