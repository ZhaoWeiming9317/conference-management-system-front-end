import React from 'react'
import './Room.sass'
import { connect } from 'react-redux';
import RoomTable from '../RoomTable/RoomTable'
  
class Room extends React.Component {
    constructor(props) {
        super(props);
    }  
    componentDidMount() {
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

export default connect(mapStateToProps)(Room);
  