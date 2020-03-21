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
        userLoginVerification().then((res) => {
            
        }).catch((error)=>{
            this.props.logout()
        })
    };
    onPanelChange(value, mode) {
        console.log(value, mode);
    }      
    render() {    
        let { isLogin } = this.props
        return (
            <div>
                <BrowserRouter>
                    <Switch>
                        <Route path="/conferencelist" component={ConferenceList}></Route>
                        <Route path="/conference" component={Conference}></Route>
                    </Switch>
                </BrowserRouter>
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
  