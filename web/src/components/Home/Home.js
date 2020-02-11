import React from 'react'
import './Home.sass'
import { userLoginVerification } from '../../api/apiUser'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group'
import Nav from '../Nav/Nav'
import Status from '../Status/Status'
import User from '../User/User'
import Meeting from '../Meeting/Meeting'
import Room from '../Room/Room'
import Device from '../Device/Device'
import { logout } from '../../actions/index'

class Home extends React.Component {
    constructor(props) {
        super(props);
    }  
    componentDidMount() {
        let cookie = localStorage.getItem('cookie') || 0
        console.log(cookie)
        const data = {cookie : cookie}    
        userLoginVerification(JSON.stringify(data)).then((res) => {
            if (res.state == 0) {
                this.props.logout()
                console.log(this.props.isLogin)
            }
        })    
    };
    render() {    
        let { nav } = this.props
        return (
            <div className="home__container">
                <Nav></Nav>
                <div className="home__main__container">
                    <Status></Status>
                    <BrowserRouter>
                        <Switch>
                            <Route path="/user" component={User}></Route>
                            <Route path="/meeting" component={Meeting}></Route>
                            <Route path="/room" component={Room}></Route>
                            <Route path="/device" component={Device}></Route>
                        </Switch>
                    <Change nav={nav}></Change>
                    </BrowserRouter>
                </div>
            </div>
        );
    }
}
function Change(props) {
    let nav = props.nav
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

const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin,
      nav: state.nav.nav
    };
};

export default connect(mapStateToProps , { logout })(Home);
  