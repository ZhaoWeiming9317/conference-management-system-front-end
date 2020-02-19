import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux';
import UserTable from '../UserTable/UserTable'
import { logout } from '../../actions/index'
import { Calendar, Badge } from 'antd';

class Main extends React.Component {
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
            <div className="user__container">
               <Calendar onPanelChange={this.onPanelChange} />
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
  