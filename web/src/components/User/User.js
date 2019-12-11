import React from 'react'
import './User.sass'
import { connect } from 'react-redux';
import UserTable from '../UserTable/UserTable'

class User extends React.Component {
    constructor(props) {
        super(props);
    }  
    componentDidMount() {
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

export default connect(mapStateToProps)(User);
  