import React from 'react'
import './Room.sass'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group'

  
class Room extends React.Component {
    constructor(props) {
        super(props);
    }  
    componentDidMount() {
    };
    render() {    
        let { isLogin } = this.props
        return (
            <div className="room__Container">
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
  