import React from 'react'
import './Welcome.sass'
import Login from './../Login/Login';
import Regist from './../Regist/Regist';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { gotoRegist, gotoLogin } from '../../actions/index'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import { CSSTransition } from 'react-transition-group'
import anime from 'animejs'
import { ReactSVG } from 'react-svg'
import Vivus from 'vivus'
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
        anime({
            targets: '.welcome__begin--container',
            duration: 650,
            translateX: -150,
            easing: 'easeInCubic'
        });
    };
    gotoRegist = event => {
        this.props.gotoRegist()
    }
    render() {    
        let { loginView ,gotoLogin,gotoRegist} = this.props
        return (
            <div className="welcome__background">
                <div className="welcome_title">
                    {/* <ReactSVG src="title_animated.svg"/> */}
                    <object type="image/svg+xml" data="title_animated.svg"></object>
                </div>
                <div className="welcome__begin--container">
                    <div className="welcome__begin--box">
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
  