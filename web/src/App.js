import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route, Redirect,withRouter } from "react-router-dom";
import './App.sass'
import loadable from './util/loadable'
const Home = loadable(()=>import('./components/Home/Home'))
const Welcome = loadable(()=>import('./components/Welcome/Welcome'))

function Change(props) {
    let isLogin = props.isLogin;
    if (isLogin) {
      return (
          <Redirect to={{ pathname: '/home'}}/>
      );
    }
    return (
        <Redirect to={{ pathname: '/welcome'}}/>
    );
}
  
class App extends React.Component {
    constructor(props) {
        super(props);
    }  
    render () {
        const { isLogin } = this.props
        return (
            <BrowserRouter>
            <Switch>
                <Route path="/home" component={Home}></Route>
                <Route path="/welcome" component={Welcome}></Route>
            </Switch>
            <Change isLogin={isLogin}></Change>
            </BrowserRouter>
        )  
    }
}


const mapStateToProps = (state) => {
    return {
        isLogin: state.userState.isLogin
    };
};
  
  
export default connect(mapStateToProps)(App);

