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
      this.handleChangePassAgain = this.handleChangePassAgain.bind(this);
      this.handleChangeRole = this.handleChangeRole.bind(this);
      this.passwordAgainMention = this.passwordAgainMention.bind(this);
      this.submitRegist = this.submitRegist.bind(this);
      this.getLvl = this.getLvl.bind(this);
      this.state = {
            username: '', 
            password: '',
            passwordAgain: '',
            role: 2,
            usernameState: 'normal',
            passwordState: 'normal',
            passwordAgainState: 'normal',
            usernameMessage: '',
            passwordMessage: '',
            passwordAgainMessage: ''
        };
    };
    componentDidMount() {
    }
    //给密码，判断相应级别
    getLvl(pwd) {
        var lvl = 0;//默认为0级
        //判断密码中有没有数字
        if (/[0-9]/.test(pwd)) {
            lvl++;
        }
        //判断密码中有没有小写字母
        if (/[a-z]/.test(pwd)) {
            lvl++;
        }
         //判断密码中有没有大写字母
        if (/[A-Z]/.test(pwd)) {
            lvl++
        }
        //判断密码中有没有特殊符号
        if (/\W/.test(pwd)) {
            lvl++;
        }
        return lvl;
    }
    usernameMention(username) {
        this.setState(
            {
                usernameMessage: '',
                usernameState: 'normal'
            }
        )
    }
    passwordMention(password) {
        if (password.length < 6) {
            this.setState({
                passwordMessage: '密码太短了',
                passwordState: 'fail'
            })
        } else if (password.length > 30) {
            this.setState({
                passwordMessage: '密码太长了',
                passwordState: 'fail'
            })
        } else {
            let lvl = this.getLvl(this.state.password)
            if ( lvl <= 1 && password.length < 10) {
                this.setState({
                    passwordMessage: '密码强度弱',
                    passwordState: 'fail'
                })
            } else if (lvl <= 1 && (password.length >= 10 && password.length < 18)) {
                this.setState({
                    passwordMessage: '密码强度中',
                    passwordState: 'warning'
                })
            } else if (lvl === 2 && password.length < 12) {
                this.setState({
                    passwordMessage: '密码强度中',
                    passwordState: 'warning'
                })
            } else {
                this.setState({
                    passwordMessage: '密码强度强',
                    passwordState: 'success'
                })
            }
        }
    }
    passwordAgainMention(passwordAgain) {
        console.log(this.state)
        if(passwordAgain === this.state.password) {
            this.setState({
                passwordAgainMessage: '两次密码相同',
                passwordAgainState: 'success'
            })
        } else {
            this.setState({
                passwordAgainMessage: '两次密码不同',
                passwordAgainState: 'fail'
            })
        }
    };

    handleChangeUser = res => {
        this.setState({
            username: res.value,
        });
        this.usernameMention(res.value)
    };

    handleChangePass = res => {
        this.setState({
            password: res.value || '',
        });
        this.passwordMention(res.value)
    };

    handleChangePassAgain = res => {
        console.log(res)
        this.setState({
            passwordAgain: res.value || '',
        });
        this.passwordAgainMention(res.value)
    };

    handleChangeRole = res => {
        this.setState({
            role: res.value,
        });
    };

    submitRegist = event => {
        const data = {username: this.state.username,password: this.state.password, role: this.state.role}
        if (this.state.password === this.state.passwordAgain) {
            userRegist(JSON.stringify(data)).then((res)=>{
                console.log(res)
            })    
        }
        userRegist(JSON.stringify(data)).then((res)=>{
            console.log(res)
        })
    }
    render() {         
      return (
        <div>
            <div className="regist__box">
                <div className="regist__label">注 &nbsp;册</div>
                <form className="regist__form" noValidate autoComplete="off">
                <div className = "regist__item regist__item--input">
                    <InputUI getValue={this.handleChangeUser} type='text' label='用户名' status={this.state.usernameState} ref="clearUsername"></InputUI>
                </div>
                <div className = "regist__item regist__item--input">
                    <InputUI getValue={this.handleChangePass} type='password' label='密码' status={this.state.passwordState} message={this.state.passwordMessage} ref="clearPassword"></InputUI>
                </div>
                <div className = "regist__item regist__item--input">
                    <InputUI getValue={this.handleChangePassAgain} type='password' label='再次密码' status={this.state.passwordAgainState} message={this.state.passwordAgainMessage} ref="clearPasswordAgain"></InputUI>
                </div>
                <div className = "regist__item regist__item--input">
                    <DropDownUI getValue={this.handleChangeRole} list={loginDropDownList} label='权限'></DropDownUI>
                </div>
                <div className = "regist__item regist__item--button">
                    <ButtonUI label="注册" buttonStyle="fill" onClick={this.submitRegist}></ButtonUI>
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
