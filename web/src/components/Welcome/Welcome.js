import React from 'react'
import './Welcome.sass'
import Login from './../Login/Login';
import Regist from './../Regist/Regist';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { gotoRegist } from '../../actions/index'
 

function Change(props) {
    let loginView = props.loginView;
    if (loginView) {
      return (
          <Redirect to={{ pathname: '/login'}}/>
      );
    }
    return (
        <Redirect to={{ pathname: '/regist'}}/>
    );
}
  
class Welcome extends React.Component {
    componentDidMount() {
    };
    render() {    
        let { loginView } = this.props
        return (
            <div className="begin-container">
                <div className="begin-box">
                    <div id="change">
                        <BrowserRouter>
                            <Switch>
                                <Route path="/login" component={Login}></Route>
                                <Route path="/regist" component={Regist}></Route>
                            </Switch>
                            <Change loginView={loginView}></Change>
                        </BrowserRouter>
                    </div> 
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      loginView: state.loginView
    };
};

export default connect(mapStateToProps, { gotoRegist })(Welcome);
  