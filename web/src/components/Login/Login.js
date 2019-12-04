import React from 'react'
import './Login.sass'
import { userLogin } from '../../api/api'
import InputUI from '../../UI/InputUI/InputUI'
import DropDownUI from '../../UI/DropDownUI/DropDownUI'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import { connect } from 'react-redux'
import { gotoRegist } from '../../actions/index'
import { loginDropDownList } from '../../constants/dropDownListConstants'

class Login extends React.Component {
    constructor(props) {
      super(props);
      this.handleChangeUser = this.handleChangeUser.bind(this);
      this.handleChangePass = this.handleChangePass.bind(this);
      this.handleChangeRole = this.handleChangeRole.bind(this);
      this.gotoRegist = this.gotoRegist.bind(this);
      this.submitLogin = this.submitLogin.bind(this);
      this.state = {
          username: '', 
          password: '',
          role: 2
        };
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
      console.log(this.state)
      const data = {username: this.state.username,password: this.state.password, role: this.state.role}
      userLogin(JSON.stringify(data))
    }

    gotoRegist = event => {
      this.props.gotoRegist()
    }

    render() {    
      return (
      <div>
        <div className="login__swiper--cover">
        </div>
        <div className="login__swiper--left">
        </div>
        <div className="login__swiper--right">
        </div>
        <div className="login__mention">
            <div className="login__mention--title">
              欢迎回来
            </div>
            <div className="login__mention--subtitle">
              会议室管理系统，如需注册请点击下方按钮
            </div>
            <ButtonUI label="注册" buttonStyle="hollow" onClick={this.gotoRegist}></ButtonUI>
        </div>
        <div className="login__box">
          <div className="login__label">登 &nbsp;录</div>
          <form className="login__form" noValidate autoComplete="off">
            <div className = "login__item">
              <InputUI getValue={this.handleChangeUser} type='text' label='用户名'></InputUI>
            </div>
            <div className = "login__item">
              <InputUI getValue={this.handleChangePass} type='password' label='密码'></InputUI>
            </div>
            <div className = "login__item">
              <DropDownUI getValue={this.handleChangeRole} list={loginDropDownList} label='权限'></DropDownUI>
            </div>
            <div className = "login__item">
              <ButtonUI label="登录" buttonStyle="fill" onClick={this.submitLogin}></ButtonUI>
            </div>
          </form>
        </div> 
      </div>
      );
    }
}

const mapStateToProps = (state) => {
  return {}
};

export default connect(mapStateToProps, { gotoRegist })(Login);
