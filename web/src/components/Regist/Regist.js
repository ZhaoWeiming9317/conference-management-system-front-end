import React from 'react'
import './Regist.sass'
import {userRegist, userShowInfo} from '../../api/apiUser';
import InputUI from '../../UI/InputUI/InputUI'
import DropDownUI from '../../UI/DropDownUI/DropDownUI'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import { connect } from 'react-redux';
import { gotoLogin } from '../../actions/index'
import { loginDropDownList } from '../../constants/dropDownListConstants'
/**
 * 
 *  注册界面， 由于和管理员添加或修改用户的功能很相似，因此增加Props来区分
 *  type: regist  ===> 注册  add ===> 添加 modify ===> 修改  默认 regist
 *  username:string
 *
 */
class Regist extends React.Component {
    constructor(props) {
      super(props);
      this.submitRegist = this.submitRegist.bind(this);
      this.getLvl = this.getLvl.bind(this);
      this.pageChange = this.pageChange.bind(this);
      this.canRegist = this.canRegist.bind(this);
      this.submitLabel = '注册'
      this.init = {
        username: '', 
        password: '',
        passwordAgain: '',
        role: 2,
        name: '',
        gender: '',
        email: '',
        position: '',
        organization: '',
        department: '',
        position: '',
        phone: '',
      }
    this.state = {
        ...this.init,
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
        page: 1, // 1 第一页， 2 第二页 ...
        display: ''
    };    
    };
    componentDidMount(){
        console.log(this.props.username)
        if (this.props.type === 'modify') {
            userShowInfo({username:this.props.username}).then((res)=>{ 
                this.setState(res)
                this.refs.updateName.updateValue(this.name)
                this.refs.updateEmail.updateValue(this.email)
                this.refs.updatePhone.updateValue(this.phone)        
            })    
        }
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
                passwordState: 'fail',
            })
        } else if (password.length > 30) {
            this.setState({
                passwordMessage: '密码太长了',
                passwordState: 'fail',
            })
        } else {
            let lvl = this.getLvl(this.state.password)
            if ( lvl <= 1 && password.length < 10) {
                this.setState({
                    passwordMessage: '密码强度弱',
                    passwordState: 'fail',
                })
            } else if (lvl <= 1 && (password.length >= 10 && password.length < 18)) {
                this.setState({
                    passwordMessage: '密码强度中',
                    passwordState: 'warning',
                })
            } else if (lvl === 2 && password.length < 12) {
                this.setState({
                    passwordMessage: '密码强度中',
                    passwordState: 'warning',
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
             name: res.value || '',
        })
    }

    handleChangeGender = res => {
        this.setState({
             gender: res.value || '',
        })
    }

    handleChangeEmail = res => {
        this.setState({
            email: res.value || '',
        })
        this.emailMention(res.value);
    }

    handleChangeOrganization = res => {
        this.setState({
            organization: res.value || '',
        })
    }

    handleChangeDepartment = res => {
        this.setState({
            department: res.value || '',
        })
    }

    handleChangePosition = res => {
        this.setState({
            position: res.value || ''
        })
    }


    handleChangePhone = res => {
        this.setState({
             phone: res.value || '',
        })
        this.phoneMention(res.value);
    }

    handleChangeRole = res => {
        this.setState({
            role: res.value,
        });
    };

    pageChange = flag => {
        return (e)=>{
            const {username, password, passwordAgain, name, email, phone, organization, department, position, page, gender} = this.state
            let nowPage = flag === 'forward' ? page + 1 :  page - 1
            // 由于react的内在机制，input的值会被清空，因此需要强制刷新
            this.setState({
                page: nowPage,
            },()=>{
                if (this.state.page === 1){
                    this.refs.updateName.updateValue(name)
                    this.refs.updateEmail.updateValue(email)
                    this.refs.updateGender.updateValue(gender)
                    this.refs.updatePhone.updateValue(phone)        
                } else if (this.state.page === 2) {
                    this.refs.updateOrganization.updateValue(organization)
                    this.refs.updateDepartment.updateValue(department)
                    this.refs.updatePosition.updateValue(position)        
                } else if (this.state.page === 3) {
                    this.refs.updateUserName.updateValue(username)
                    this.refs.updatePassword.updateValue(password)
                    this.refs.updatePasswordAgain.updateValue(passwordAgain)        
                }
            });
        }
    }

    canRegist = event => {
        const {username, password, passwordAgain, name} = this.state
        if (username.length === 0) {
            this.setState({
                usernameMessage: '用户名不能为空',
                usernameState: 'fail'
            })
            alert('用户名不能为空')
            return false
        }else if(password.length === 0) {
            this.setState({
                passwordMessage: '密码不能为空',
                passwordState: 'fail'
            })
            alert('密码能为空')
            return false
        }else if(password !== passwordAgain){
            alert('两次密码不一样')
            return false
        }else if(name.length === 0){
            alert('姓名不能为空')
            return false
        } else {
            alert('注册成功')
            return true
        }
    }

    gotoLogin = () => {
        this.props.gotoLogin()
    }

    submitRegist = event => {
        const {username, password, passwordAgain, role, name, gender, email, organization, department, phone} = this.state
        const data = {
            username: username, 
            password: password,
            passwordAgain: passwordAgain,
            role: role,
            name: name,
            gender: gender,
            email: email,
            organization: organization,
            department: department,
            phone: phone,
        }
        if (this.canRegist()) {
            userRegist(JSON.stringify(data)).then((res)=>{
                this.props.gotoLogin()
            })    
        };
    };

    render() {
        let fundamentalInfor = (
            <div>
                <div key='name' className = "regist__item regist__item--input">
                    <InputUI getValue={this.handleChangeName} type='text' label='姓名' ref='updateName' ></InputUI>
                </div>
                <div key='gender' className = "regist__item regist__item--input">
                    <DropDownUI getValue={this.handleChangeGender} list={[{value: '女',label: '女'},{value: '男',label: '男'}]} label='性别' ref='updateGender'></DropDownUI>
                </div>
                <div key='mail' className = "regist__item regist__item--input">
                    <InputUI getValue={this.handleChangeEmail} type='text' label='邮箱' ref='updateEmail' status={this.state.emailState} message={this.state.emailMessage}></InputUI>
                </div>
                <div key='phone' className = "regist__item regist__item--input">
                    <InputUI getValue={this.handleChangePhone} type='text' label='电话' ref='updatePhone' status={this.state.phoneState} message={this.state.phoneMessage}></InputUI>
                </div>
                <div key='backward' className = "regist__item regist__item--button">
                    <ButtonUI label="下一步" buttonStyle="fill" onClick={this.pageChange('forward')}></ButtonUI>
                </div>
            </div>
        )
      let postionInfor = (
            <div>
                <div key='organization' className = "regist__item regist__item--input">
                    <InputUI getValue={this.handleChangeOrganization} type='text' label='组织' ref='updateOrganization' status={this.state.organizationState} ></InputUI>
                </div>
                <div key='department' className = "regist__item regist__item--input">
                    <InputUI getValue={this.handleChangeDepartment} type='text' label='部门' ref='updateDepartment' status={this.state.departState} ></InputUI>
                </div> 
                <div key='position' className = "regist__item regist__item--input">
                    <InputUI getValue={this.handleChangePosition} type='text' label='职位' ref='updatePosition' status={this.state.position} ></InputUI>
                </div>
                <div key='forward' className = "regist__item regist__item--button">
                    <ButtonUI label="上一步" buttonStyle="fill" onClick={this.pageChange('backward')}></ButtonUI>
                </div>
                <div key='backward' className = "regist__item regist__item--button">
                    <ButtonUI label="下一步" buttonStyle="fill" onClick={this.pageChange('forward')}></ButtonUI>
                </div>
            </div> 
      )
      let statusInfor = (
        <div>
            <div key='username' className = "regist__item regist__item--input">
                <InputUI getValue={this.handleChangeUser} type='text' label='用户名' ref='updateUserName' status={this.state.usernameState}></InputUI>
            </div>
            <div key='password' className = "regist__item regist__item--input">
                <InputUI getValue={this.handleChangePass} type='password' label='密码' ref='updatePassword' status={this.state.passwordState} message={this.state.passwordMessage}></InputUI>
            </div>
            <div key='passwordAgain' className = "regist__item regist__item--input">
                <InputUI getValue={this.handleChangePassAgain} type='password' label='再次密码' ref='updatePasswordAgain' status={this.state.passwordAgainState} message={this.state.passwordAgainMessage}></InputUI>
            </div>
            <div key='role' className = "regist__item regist__item--input">
                <DropDownUI getValue={this.handleChangeRole} list={loginDropDownList} label='权限' ref='updateRole'></DropDownUI>
            </div>
            <div key='forward' className = "regist__item regist__item--button">
                <ButtonUI label="上一步" buttonStyle="fill" onClick={this.pageChange('backward')}></ButtonUI>
            </div>
            <div key='regist' className = "regist__item regist__item--button">
                <ButtonUI label={this.submitLabel} buttonStyle="hollow-fill" onClick={this.submitRegist}></ButtonUI>
            </div>
        </div>
        )
        const {type = 'regist'} = this.props
        let loginLabel, addDisplay, labelDisplay;
        
        if (type === 'regist') {
            loginLabel = (
                <div className = "regist__item regist__item--forget">
                    <div className = "regist__forget" onClick={this.gotoLogin}> 点击这里登录</div>
                </div>
            )
        }

        if (this.state.page === 1) {
            addDisplay = fundamentalInfor
        } else if (this.state.page === 2) {
            addDisplay = postionInfor
        } else {
            addDisplay = statusInfor
        }
        // type: regist  ===> 注册  add ===> 添加 modify ===> 修改
        if (type === 'regist') {
            labelDisplay = ( <div className="regist__label">注 &nbsp;册</div>)
        } else if (type === 'add') {
            labelDisplay = ( <div className="regist__label">添加用户</div>)
        } else if (type === 'modify') {
            labelDisplay = ( <div className="regist__label">更改用户</div>)
        }
        if (type === 'add') {
            this.submitLabel = '添加'
        } else if(type === 'regist'){
            this.submitLabel = '注册'
        } else {
            this.submitLabel = '更改'
        }
        return (
            <div className={`regist__box regist__box--${type}`}>
                {labelDisplay}
                <form className="regist__form" noValidate autoComplete="off">
                    {addDisplay}
                    {loginLabel}
                </form>
            </div>  
        );
    }
}
const mapStateToProps = (state) => {
    return{
        
    }
}
export default connect(mapStateToProps, { gotoLogin })(Regist);
