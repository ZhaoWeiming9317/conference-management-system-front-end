import React from 'react'
import './Nav.sass'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group'
import NavUI from '../../UI/NavUI/NavUI'
import User from '../User/User'
import Meeting from '../Meeting/Meeting'
import Room from '../Room/Room'
import Device from '../Device/Device'

function Change(props) {
    let isLogin = props.isLogin;
    if (isLogin) {
      return (
          <Redirect to={{ pathname: '/home'}}/>
      );
    }
    return (
        <Redirect to={{ pathname: '/welcome'}}/>
    );
}

class Nav extends React.Component {
    constructor(props) {
        super(props);
    }  
    componentDidMount() {
    };
    render() {    
        let { isLogin } = this.props
        return (
            <div className="Nav__Container">
                <NavUI></NavUI>
                <BrowserRouter>
                <Switch>
                    <Route path="/user" component={User}></Route>
                    <Route path="/meeting" component={Meeting}></Route>
                    <Route path="/Room" component={Room}></Route>
                    <Route path="/Device" component={Device}></Route>
                </Switch>
                <Change isLogin={isLogin}></Change>
                </BrowserRouter>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.isLogin
    };
};

export default connect(mapStateToProps)(Nav);
  