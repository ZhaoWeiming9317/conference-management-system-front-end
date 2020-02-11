import React from 'react'
import './Room.sass'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux';
import RoomTable from '../RoomTable/RoomTable'
import { logout } from '../../actions/index'

class Room extends React.Component {
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
    render() {    
        let { isLogin } = this.props
        return (
            <div className="room__container">
                <div className="room__table">
                    <RoomTable></RoomTable>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

    export default connect(mapStateToProps, {logout})(Room);
  