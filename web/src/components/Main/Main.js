import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { meeting7Search } from '../../api/apiMeeting'
import Conference from '../Conference/Conference'
import ConferenceList from '../ConferenceList/ConferenceList'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import {  Row, Col, Typography, Divider } from 'antd';
import moment from 'moment'
const { Title } = Typography;
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            day :  {start_time: '', end_time: ''} ,
            sortByDayConferenceList: [],
            myConferenceList: [] 
        }
    }  
    componentDidMount() {
        let cookie = localStorage.getItem('cookie') || 0
        console.log(cookie)
        const data = {cookie : cookie}    
        userLoginVerification(JSON.stringify(data)).then((res) => {
            if (res.state == 0) {
                this.props.logout()
            } else {

            }
        })
    };
    onPanelChange(value, mode) {
        console.log(value, mode);
    }      
    render() {    
        let { isLogin } = this.props
        return (
            <div>
                <Switch>
                    <Route path="/main/conferencelist" component={ConferenceList}></Route>
                    <Route path="/main/conference" component={Conference}></Route>
                </Switch>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps, {logout})(Main);
  