import React from 'react'
import './Status.sass'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group'
import StatusUI from '../../UI/StatusUI/StatusUI'
  
class Status extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
    }  
    componentDidMount() {
    };
    render() {    
        let { isLogin } = this.props
        return (
            <div className="status__container">
                <StatusUI></StatusUI>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.isLogin
    };
};

export default connect(mapStateToProps)(Status);
  