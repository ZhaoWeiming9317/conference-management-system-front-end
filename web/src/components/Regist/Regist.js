import React from 'react'
import './Regist.sass'
import {userRegist} from '../../api/api';
import InputUI from '../../UI/InputUI/InputUI'
import DropDownUI from '../../UI/DropDownUI/DropDownUI'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import { connect } from 'react-redux';
import { gotoLogin } from '../../actions/index'
import { loginDropDownList } from '../../constants/dropDownListConstants'

class Regist extends React.Component {
    constructor(props) {
      super(props);
      this.handleChangeUser = this.handleChangeUser.bind(this);
      this.handleChangePass = this.handleChangePass.bind(this);
      this.handleChangeRole = this.handleChangeRole.bind(this);
      this.submitRegist = this.submitRegist.bind(this);
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
    };

    handleChangePass = event => {
        this.setState({
            password: event.target.value,
        });
    };

    handleChangeRole = value => {
      this.setState({
        role: value,
      });
    };

    submitRegist = event => {
      const data = {username: this.state.username,password: this.state.password, role: this.state.role}
      userRegist(JSON.stringify(data))
    }

    render() {    
      return (
        <div>
            <div className="Regist__swiper--cover">
            </div>
            <div className="Regist__swiper--left">
            </div>
            <div className="Regist__swiper--right">
            </div>
            <div className="Regist__mention">
                <div className="Regist__mention--title">
                    <div className="Regist__mention--title">
                    你好朋友
                    </div>
                    <div className="Regist__mention--subtitle">
                    会议室管理系统，登录请点击下方按钮
                    </div>
                    <ButtonUI label="登录" buttonStyle="hollow" onClick={this.props.gotoLogin}></ButtonUI>
                </div>
            </div>
            <div className="Regist__box">
                <div className="Regist__label">注 &nbsp;册</div>
                <form className="Regist__form" noValidate autoComplete="off">
                <div className = "Regist__item">
                    <InputUI getValue={this.handleChangeUser} type='text' label='用户名'></InputUI>
                </div>
                <div className = "Regist__item">
                    <InputUI getValue={this.handleChangePass} type='password' label='密码'></InputUI>
                </div>
                <div className = "Regist__item">
                    <DropDownUI getValue={this.handleChangeRole} list={loginDropDownList} label='权限'></DropDownUI>
                </div>
                <div className = "Regist__item">
                    <ButtonUI label="注册" buttonStyle="fill"></ButtonUI>
                </div>
                </form>
            </div>  
        </div>
      );
    }
}
const mapStateToProps = (state) => {
    return{
        
    }
};

export default connect(mapStateToProps, { gotoLogin })(Regist);
