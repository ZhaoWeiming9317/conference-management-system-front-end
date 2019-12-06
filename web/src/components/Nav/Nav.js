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
import { gotoDevice, gotoMeeting, gotoRoom, gotoUser } from '../../actions/index'

function Change(props) {
    let nav = props.nav;
    if (nav === 1) {
        return (
            <Redirect to={{ pathname: '/meeting'}}/>
        );
    }else if (nav === 2) {
        return (
            <Redirect to={{ pathname: '/user'}}/>
        );
    } else if (nav === 3) {
        return (
            <Redirect to={{ pathname: '/room'}}/>
        );
    } else if (nav === 4){
        return (
            <Redirect to={{ pathname: '/device'}}/>
        );
    }
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
            <div className="nav__Container">
                <NavUI></NavUI>
                <BrowserRouter>
                <Switch>
                    <Route path="/user" component={User}></Route>
                    <Route path="/meeting" component={Meeting}></Route>
                    <Route path="/room" component={Room}></Route>
                    <Route path="/device" component={Device}></Route>
                </Switch>
                <Change isLogin={isLogin}></Change>
                </BrowserRouter>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      nav: state.nav
    };
};

export default connect(mapStateToProps, { gotoDevice, gotoMeeting, gotoRoom, gotoUser })(Nav);
  