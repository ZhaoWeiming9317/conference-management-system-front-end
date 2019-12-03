import React from 'react'
import './welcome.sass'
import Login from './../login/login';
import Regist from './../regist/regist';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import {gotoRegist} from './../../actions/index'


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
    };
    componentDidMount() {
    };
    render() {    
        let { loginView } = this.props
        return (
            <div class="begin-container">
                <div class="begin-box">
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
      loginView: state.loginView
    };
};

export default connect(mapStateToProps, { gotoRegist })(Welcome);
  