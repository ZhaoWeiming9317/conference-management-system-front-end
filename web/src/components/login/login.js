import React from 'react'
import './login.sass'
import TextField from '@material-ui/core/TextField';
import {userLogin} from './../../api/api';
import ChooseRole from './../chooseRole/chooseRole';

class Login extends React.Component {
    constructor(props) {
      super(props);
      console.log(props)
      this.handleChangeUser = this.handleChangeUser.bind(this);
      this.handleChangePass = this.handleChangePass.bind(this);
      this.handleChangeRole = this.handleChangeRole.bind(this);
      this.submitLogin = this.submitLogin.bind(this);
      this.state = {
          username: '', 
          password: '',
          role: 2
        };
    };
    componentDidMount() {
    }

    handleChangeUser = event => {
        this.setState({
            username: event.target.value,
        });
        console.log(this.state)
    };

    handleChangePass = event => {
        this.setState({
            password: event.target.value,
        });
        console.log(this.state)
    };

    handleChangeRole = value => {
      this.setState({
        role: value,
      });
      console.log(this.state)
    };

    submitLogin = event => {
      const data = {username: this.state.username,password: this.state.password, role: this.state.role}
      userLogin(JSON.stringify(data))
    }

    render() {    
      return (
      <div>
        <div class="swiper-cover">
        </div>
        <div class="swiper-left">
        </div>
        <div class="swiper-right">
        </div>
        <div class="mention left-mention">
            <div class="mention-title">
            </div>
        </div>
        <div class="mention right-mention">
            <div class="mention-title">
            欢迎回来
            </div>
            <div class="mention-subtitle">
            会议室管理系统，如需注册请点击下方按钮
            </div>
            <div class="button button-hollow" onClick={this.gotoRegist}>
            注册
            </div>
        </div>
        <div class="login-box">
          <div class="login-label">登 &nbsp;录</div>
          <form class="login-form" noValidate autoComplete="off">
            <div class = "login-item">
              <TextField id="standard-basic" label="用户名" onChange={this.handleChangeUser} value={this.state.username}/>
            </div>
            <div class = "login-item">
              <TextField id="standard-basic" label="密  码" onChange={this.handleChangePass} value={this.state.password}/>
            </div>
            <div class = "login-item">
              <ChooseRole handleChangeRole={this.handleChangeRole}>
              </ChooseRole>
            </div>
            <div class = "login-item">
              <div class="button button-fill" onClick={this.submitLogin}>
                  登录
              </div>
            </div>
          </form>
        </div> 
      </div>
         
      );
    }
}
export default Login