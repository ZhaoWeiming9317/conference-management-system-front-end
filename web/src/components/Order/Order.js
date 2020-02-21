import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux';
import UserTable from '../UserTable/UserTable'
import { logout } from '../../actions/index'
import {  Card, Calendar, Row, Col } from 'antd';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'


class Order extends React.Component {
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
                <Row>
                    <Col span={16}>
                        <Card>
                            <FullCalendar defaultView="dayGridMonth" plugins={[ dayGridPlugin ]} />
                        </Card>
                    </Col>
                    <Col span={8}>
                    </Col>
                </Row>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps, {logout})(Order);
  