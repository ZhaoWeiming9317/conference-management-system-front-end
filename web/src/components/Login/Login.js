import React from 'react'
import './Login.sass'
import { userLogin } from '../../api/apiUser'
import InputUI from '../../UI/InputUI/InputUI'
import DropDownUI from '../../UI/DropDownUI/DropDownUI'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import { connect } from 'react-redux'
import { gotoRegist, login } from '../../actions/index'
import { loginDropDownList } from '../../constants/dropDownListConstants'

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.gotoRegist = this.gotoRegist.bind(this);
      this.submitLogin = this.submitLogin.bind(this);
      this.state = {
          username: '', 
          password: '',
          role: 2
      };
      console.log(props)
    };
    componentDidMount() {
    }
    handleChangeUser = res => {
      this.setState({
          username: res.value,
      });
    };

    handleChangePass = res => {
      this.setState({
          password: res.value,
      });
    };

    handleChangeRole = res => {
      this.setState({
        role: res.value,
      });
    };

    submitLogin = event => {
      const data = {username: this.state.username,password: this.state.password, role: this.state.role}
      userLogin(JSON.stringify(data)).then((res)=>{  
          // 成功
          if (res.state == 1) {
            this.props.login();
          } else {
            alert(res.message)
          }
        }
      )      
    }

    gotoRegist = event => {
      this.props.gotoRegist()
    }

    render() {    
      return (
      <div>
        <div className="login__box">
          <div className="login__label">登 &nbsp;录</div>
          <form className="login__form" noValidate autoComplete="off">
            <div className = "login__item login__item--input">
              <InputUI getValue={this.handleChangeUser} type='text' label='用户名'></InputUI>
            </div>
            <div className = "login__item login__item--input">
              <InputUI getValue={this.handleChangePass} type='password' label='密码'></InputUI>
            </div>
            <div className = "login__item login__item--input">
              <DropDownUI getValue={this.handleChangeRole} list={loginDropDownList} label='权限'></DropDownUI>
            </div>
            <div className = "login__item login__item--forget">
              <div className = "login__forget" onClick={this.gotoForget}> 忘记密码？请点击这里</div>
            </div>
            <div className = "login__item login__item--button">
              <ButtonUI label="登录" buttonStyle="fill" onClick={this.submitLogin}></ButtonUI>
            </div>
            <div className = "login__item login__item--forget">
              <div className = "login__forget" onClick={this.gotoRegist}> 点击这里注册</div>
            </div>
          </form>
        </div> 
      </div>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    loginView: state.nav.loginView,
    isLogin: state.userState.isLogin
  };
};

export default connect(mapStateToProps, {gotoRegist , login})(Login);
