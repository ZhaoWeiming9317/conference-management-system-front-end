import React from 'react'
import './Login.sass'
import { userLogin } from '../../api/apiUser'
import { connect } from 'react-redux'
import { gotoRegist, login } from '../../actions/index'
import { Form, Input, Button, message, Select, Typography } from 'antd'
const { Title, Text  } = Typography

class LoginApp extends React.Component {
    constructor(props) {
      super(props);
      this.gotoRegist = this.gotoRegist.bind(this);
      this.submitLogin = this.submitLogin.bind(this);
      console.log(props)
    };
    componentDidMount() {

    }
    submitLogin = event => {
      let userInfo = this.props.form.getFieldsValue();
      this.props.form.validateFields((err, values) => {
          if (!err) {
            userLogin(JSON.stringify(userInfo)).then((res)=>{
              // 成功
              if (res.state == 1) {
                localStorage.setItem("token", res.token)
                localStorage.setItem("user_id", res.user_id)
                localStorage.setItem('username',res.username)
                localStorage.setItem("role", userInfo.role)
                message.success('登录成功')
                this.props.login()
              } else {
                message.error(res.message)
              }
            }
            )          
          }
        })  
    }

    gotoRegist = event => {
      this.props.gotoRegist()
    }

    render() {    
      const { getFieldDecorator } = this.props.form;

      return (
      <div>
        <div className="login__box">
          <Title level={2}>登 &nbsp;录</Title>
          <Form style={{paddingTop: 20}} labelCol={{ span: 8}} wrapperCol={{ span: 14 }} labelAlign='left' onSubmit={this.handleSubmit}>
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入用户名' }],
              })(<Input autoComplete="new-password"/>)}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(<Input.Password autoComplete="new-password"/>)}
            </Form.Item>
            <Form.Item label="权限">
              {getFieldDecorator('role', {
                rules: [{ required: true, message: '请选择权限' }],
              })(<Select>
                  <Select.Option value={0}>部门经理</Select.Option>
                  <Select.Option value={1}>系统管理员</Select.Option>
                  <Select.Option value={2}>普通员工</Select.Option>
                </Select>)}
            </Form.Item>
            <Button type="primary" onClick={this.submitLogin}>
              提交
            </Button>
          </Form>
          <div className="login_txt" type="secondary" onClick={this.gotoRegist}>点击这里注册</div>
        </div> 
      </div>
      );
    }
}

const Login = Form.create({})(LoginApp);

const mapStateToProps = (state) => {
  return {
    loginView: state.nav.loginView,
    isLogin: state.userState.isLogin
  };
};

export default connect(mapStateToProps, { gotoRegist , login })(Login);
