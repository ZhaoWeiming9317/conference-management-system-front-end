import React from 'react'
import './StatusUI.sass'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

class StatusUI extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
    }  
    componentDidMount() {
    };
    render() {    
        return (
            <div className="status--ui__container">
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.isLogin
    };
};

export default connect(mapStateToProps)(StatusUI);
  