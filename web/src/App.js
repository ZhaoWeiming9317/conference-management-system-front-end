import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route, Redirect,withRouter } from "react-router-dom";
import './App.sass'
import loadable from './util/loadable'
const Home = loadable(()=>import('./components/Home/Home'))
const Welcome = loadable(()=>import('./components/Welcome/Welcome'))
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';

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
        this.state = {
            locale: zhCN,
        };
    }  
    render () {
        const { isLogin } = this.props
        return (
            <ConfigProvider locale={this.state.locale}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/home" component={Home}></Route>
                        <Route path="/welcome" component={Welcome}></Route>
                    </Switch>
                    <Change isLogin={isLogin}></Change>
                </BrowserRouter>
            </ConfigProvider>
        )  
    }
}


const mapStateToProps = (state) => {
    return {
        isLogin: state.userState.isLogin
    };
};
  
  
export default connect(mapStateToProps)(App);

