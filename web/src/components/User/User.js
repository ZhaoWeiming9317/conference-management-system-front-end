import React from 'react'
import './User.sass'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux';
import UserTable from '../UserTable/UserTable'
import { logout } from '../../actions/index'

class User extends React.Component {
    constructor(props) {
        super(props);
    }  
    componentDidMount() {
        userLoginVerification().then((res) => {
            if (res.state == 0) {
                this.props.logout()
            }
        })
    };
    render() {    
        let { isLogin } = this.props
        return (
            <div className="user__container">
                <div className="user__table">
                    <UserTable> </UserTable>
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

export default connect(mapStateToProps, {logout})(User);
  