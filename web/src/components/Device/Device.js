import React from 'react'
import './Device.sass'
import { userLoginVerification } from '../../api/apiUser'
import DeviceTable from '../DeviceTable/DeviceTable'
import { connect } from 'react-redux';

  
class Device extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
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
    render() {    
        let { isLogin } = this.props
        return (
            <div className="device__container">
                <div className="device__table">
                    <DeviceTable></DeviceTable>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.isLogin
    };
};

export default connect(mapStateToProps)(Device);
  