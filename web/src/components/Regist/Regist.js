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
      this.handleChangeName = this.handleChangeName.bind(this);
      this.handleChangeSex = this.handleChangeSex.bind(this);
      this.handleChangeEmail = this.handleChangeEmail.bind(this);
      this.handleChangeOrganization = this.handleChangeOrganization.bind(this);
      this.handleChangedepart = this.handleChangedepart.bind(this);
      this.handleChangePhone = this.handleChangePhone.bind(this);
      this.handleChangeRole = this.handleChangeRole.bind(this);
      this.emailMention = this.emailMention.bind(this);
      this.phoneMention = this.phoneMention.bind(this);
      this.passwordAgainMention = this.passwordAgainMention.bind(this);
      this.submitRegist = this.submitRegist.bind(this);
      this.getLvl = this.getLvl.bind(this);
      this.pageChange = this.pageChange.bind(this);
      this.state = {
            username: '', 
            password: '',
            passwordAgain: '',
            role: 2,
            name: '',
            sex: '',
            email: '',
            organization: '',
            department: '',
            phone: '',
            usernameState: 'normal',
            passwordState: 'normal',
            passwordAgainState: 'normal',
            emailState: 'normal',
            phoneState: 'normal',
            usernameMessage: '',
            passwordMessage: '',
            passwordAgainMessage: '',
            emailMessage: '',
            phoneMessage: '',
            page: true // 1 第一页， 2 第二页
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
    phoneMention(phone) {
        var pattern = /^1[3456789]\d{9}$/  //手机号码
        var pattern2 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/  //固定电话
        if (!pattern.test(phone)) {
            this.setState({
                phoneMessage: '电话不符合格式',
                phoneState: 'fail'
            })
            return true
        } else {
            this.setState({
                phoneMessage: '电话符合格式',
                phoneState: 'success'
            })
            return false
        }
    }
    emailMention(email) {
        var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!pattern.test(email)) {
            this.setState({
                emailMessage: '邮箱不符合格式',
                emailState: 'fail'
            })
        } else {
            this.setState({
                emailMessage: '邮箱符合格式',
                emailState: 'success'
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
        this.setState({
            passwordAgain: res.value || '',
        });
        this.passwordAgainMention(res.value)
    };

    handleChangeName = res => {
        this.setState({
             name: res.name || '',
        })
    }

    handleChangeSex = res => {
        console.log(res)
        this.setState({
             sex: res.sex || '',
        })
    }

    handleChangeEmail = res => {
        console.log(res)
        this.setState({
             email: res.email || '',
        })
        this.emailMention(res.email);
    }

    handleChangeOrganization = res => {
        this.setState({
             organization: res.organization || '',
        })
    }

    handleChangedepart = res => {
        this.setState({
             depart: res.department || '',
        })
    }

    handleChangePhone = res => {
        console.log(res)
        this.setState({
             phone: res.phone || '',
        })
        this.phoneMention(res.phone);
    }

    handleChangeRole = res => {
        console.log(res)
        this.setState({
            role: res.value,
        });
    };

    pageChange = event => {
        this.setState({
            page: !this.state.page,
        });
    }

    submitRegist = event => {
        const data = {username: this.state.username,password: this.state.password, role: this.state.role}
        if (this.state.password === this.state.passwordAgain) {
            userRegist(JSON.stringify(data)).then((res)=>{
                console.log(res)
            })    
        };
    };

    render() {      
      return (
        <div>
            <div className="regist__box">
                <div className="regist__label">注 &nbsp;册</div>
                <form className="regist__form" noValidate autoComplete="off">
                {this.state.page ? 
                    (<div>
                        <div key='name' className = "regist__item regist__item--input">
                            <InputUI getValue={this.handleChangeName} type='text' label='姓名' status={this.state.nameState} ></InputUI>
                        </div>
                        <div key='gender' className = "regist__item regist__item--input">
                            <DropDownUI getValue={this.handleChangeSex} list={[{value: '女',label: '女'},{value: '男',label: '男'}]} label='性别'></DropDownUI>
                        </div>
                        <div key='mail' className = "regist__item regist__item--input">
                            <InputUI getValue={this.handleChangeEmail} type='text' label='邮箱' status={this.state.emailState} status={this.state.emailState} message={this.state.emailMessage}></InputUI>
                        </div>
                        <div key='organization' className = "regist__item regist__item--input">
                            <InputUI getValue={this.handleChangeOrganization} type='text' label='组织' status={this.state.organizationState} ></InputUI>
                        </div>
                        <div key='depart' className = "regist__item regist__item--input">
                            <InputUI getValue={this.handleChangedepart} type='text' label='部门' status={this.state.departState} ></InputUI>
                        </div>
                        <div key='phone' className = "regist__item regist__item--input">
                            <InputUI getValue={this.handleChangePhone} type='text' label='电话' status={this.state.phoneState} message={this.state.phoneMessage}></InputUI>
                        </div>
                        <div key='next' className = "regist__item regist__item--button">
                            <ButtonUI label="下一步" buttonStyle="fill" onClick={this.pageChange}></ButtonUI>
                        </div>
                    </div>) 
                        :
                    (<div>
                        <div key='username' className = "regist__item regist__item--input">
                            <InputUI getValue={this.handleChangeUser} type='text' label='用户名' status={this.state.usernameState}></InputUI>
                        </div>
                        <div key='password' className = "regist__item regist__item--input">
                            <InputUI getValue={this.handleChangePass} type='password' label='密码' status={this.state.passwordState} message={this.state.passwordMessage}></InputUI>
                        </div>
                        <div key='passwordAgain' className = "regist__item regist__item--input">
                            <InputUI getValue={this.handleChangePassAgain} type='password' label='再次密码' status={this.state.passwordAgainState} message={this.state.passwordAgainMessage}></InputUI>
                        </div>
                        <div key='role' className = "regist__item regist__item--input">
                            <DropDownUI getValue={this.handleChangeRole} list={loginDropDownList} label='权限'></DropDownUI>
                        </div>
                        <div key='forward' className = "regist__item regist__item--button">
                            <ButtonUI label="上一步" buttonStyle="fill" onClick={this.pageChange}></ButtonUI>
                        </div>
                        <div key='regist' className = "regist__item regist__item--button">
                            <ButtonUI label="注册" buttonStyle="fill" onClick={this.submitRegist}></ButtonUI>
                        </div>
                    </div>)}
                </form>
            </div>  
        </div>
      );
    }
}
const mapStateToProps = (state) => {
    return{
        
    }
}
export default connect(mapStateToProps, { gotoLogin })(Regist);
