import React from 'react'
import './regist.sass'
import TextField from '@material-ui/core/TextField';
import {userRegist} from './../../api/api';
import ChooseRole from './../chooseRole/chooseRole';
import { connect } from 'react-redux';
import { gotoLogin } from './../../actions/index'

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
                你好朋友
                </div>
                <div class="mention-subtitle">
                会议室管理系统，登录请点击下方按钮
                </div>
                <div class="button button-hollow" onClick={this.props.gotoLogin}>
                登录
                </div>
            </div>
            <div class="regist-box">
                <div class="regist-label">注 &nbsp;册</div>
                <form class="regist-form" noValidate autoComplete="off">
                <div class = "regist-item">
                    <TextField id="standard-basic" label="用户名" onChange={this.handleChangeUser} value={this.state.username}/>
                </div>
                <div class = "regist-item">
                    <TextField id="standard-basic" label="密  码" onChange={this.handleChangePass} value={this.state.password}/>
                </div>
                <div class = "regist-item">
                    <ChooseRole handleChangeRole={this.handleChangeRole}>
                    </ChooseRole>
                </div>
                <div class = "regist-item">
                    <div class="button button-fill" onClick={this.submitLogin}>
                        注册
                    </div>
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
