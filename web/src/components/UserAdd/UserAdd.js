import React from 'react'
import './UserAdd.sass'
import { connect } from 'react-redux'
import { Form, Input, Button, message, Select, Steps, Typography } from 'antd'
import {userRegist, userModifyInfo} from '../../api/apiUser'
import { gotoLogin } from '../../actions/index'

const { Step } = Steps
const { Title, Text  } = Typography
class UserApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        username: '', 
        password: '',
        passwordAgain: '',
        role: 2,
        name: '',
        gender: '',
        email: '',
        organization: '',
        department: '',
        position: '',
        phone: '',
        currentStep: 0,
    }
  }
  componentWillMount() {
    let data = this.props.data
    if (this.props.type === 'modify') {
        console.log(data)
        this.setState({...data})
    }
  }
  next() {
    const currentStep = this.state.currentStep + 1;
    this.setState({ currentStep });
  }

  prev() {
    const currentStep = this.state.currentStep - 1;
    this.setState({ currentStep });
  }
  handleSubmit = e => {
    e.preventDefault();
    let userInfo = this.props.form.getFieldsValue();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.props.type === 'add' || this.props.type === 'regist') {
          userRegist(JSON.stringify(userInfo)).then((res)=>{
            if (res.state == 1) {
              if (this.props.type === 'regist') {
                this.gotoLogin()
                message.success("注册成功")
              } else {
                message.success("添加成功")
              }
            } else {
              if (this.props.type === 'regist') {
                message.error("注册失败")
              } else {
                message.error("添加失败")
              }
            }
          }).catch((error)=>{
            message.error("系统错误")
          })
        } else {
          userModifyInfo(JSON.stringify({...userInfo, user_id: this.props.data.userId})).then((res)=>{
            if (res.state == 1) {
              message.success("修改成功")
            } else {
              message.error("修改失败")
            }
          }).catch((error)=>{
            message.error("系统错误")
          })
        }
      }
    });
  };
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一样');
    } else {
      callback();
    }
  };
  gotoLogin = () => {
    this.props.gotoLogin()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { currentStep } = this.state;
    const { type } = this.props
    return (
      <div> 
        {type == 'regist' && <Title level={2}>注&nbsp;册</Title>}
        <Steps size={type != 'regist' ? 'default' : 'small'} current={currentStep} onChange={current => this.setState({ currentStep: current })}>
          <Step title="用户基础" />
          <Step title="用户信息" />
          <Step title="职位信息" />
        </Steps>
        <Form style={{paddingTop: 20}} labelCol={{ span: 8}} wrapperCol={{ span: 14 }} labelAlign='left' onSubmit={this.handleSubmit}>
          {currentStep === 0 && <Form.Item label="用户名">
            {getFieldDecorator('username', {
              initialValue: this.state.username, 
              rules: [{ required: true, message: '请输入用户名' }],
              preserve: true,
            })(<Input autoComplete="new-password"/>)}
          </Form.Item>}
          {currentStep === 0 && <Form.Item label="密码">
            {getFieldDecorator('password', {
              initialValue: this.state.password, 
              rules: [{ required: true, message: '请输入密码' }],
              preserve: true,
            })(<Input.Password autoComplete="new-password"/>)}
          </Form.Item>}
          {currentStep === 0 && <Form.Item label="再次密码">
            {getFieldDecorator('passwordAgain', {
              initialValue: this.state.passwordAgain,
              rules: [
                { 
                required: true, message: '请再次输入密码' 
              },
              {
                validator: this.compareToFirstPassword,
              },],
              preserve: true,
            })(<Input.Password autoComplete="new-password"/>)}
          </Form.Item>}
          {currentStep === 1 && <Form.Item label="姓名">
            {getFieldDecorator('name', {
              initialValue: this.state.name,
              rules: [{ required: true, message: '请输入姓名' }],
              preserve: true,
            })(<Input autoComplete="new-password"/>)}
          </Form.Item>}
          {currentStep === 1 && <Form.Item label="性别">
            {getFieldDecorator('gender', {
              initialValue: this.state.gender,
              rules: [{ required: true, message: '请选择性别' }],
              preserve: true,
            })(<Select>
              <Select.Option value="男">男</Select.Option>
              <Select.Option value="女">女</Select.Option>
            </Select>)}
          </Form.Item>}
          {currentStep === 1 && <Form.Item label="电话">
            {getFieldDecorator('phone', {
              initialValue: this.state.phone,
              rules: [{ required: true, message: '请输入电话' }],
              preserve: true,
            })(<Input autoComplete="new-password"/>)}
          </Form.Item>}
          {currentStep === 1 && <Form.Item label="邮箱">
            {getFieldDecorator('email', {
              initialValue: this.state.email,
              rules: [{ required: true, message: '请输入邮箱'},
              {
                type: 'email',
                message: '请输入正确的邮箱格式',
              }],
              preserve: true,
            })(<Input autoComplete="new-password"/>)}
          </Form.Item>}
          {currentStep === 2 && <Form.Item label="组织">
            {getFieldDecorator('organization', {
              initialValue: this.state.organization,
              rules: [{ required: true, message: '请输入组织' }],
              preserve: true,
            })(<Input autoComplete="new-password"/>)}
          </Form.Item>}
          {currentStep === 2 && <Form.Item label="部门">
            {getFieldDecorator('department', {
              initialValue: this.state.department,
              rules: [{ required: true, message: '请输入部门' }],
              preserve: true,
            })(<Input autoComplete="new-password"/>)}
          </Form.Item>}
          {currentStep === 2 && <Form.Item label="职位">
            {getFieldDecorator('position', {
              initialValue: this.state.position,
              rules: [{ required: true, message: '请输入职位' }],
              preserve: true,
            })(<Input autoComplete="new-password"/>)}
          </Form.Item>}
          {currentStep === 2 && <Form.Item label="权限">
            {getFieldDecorator('role', {
              initialValue: this.state.role,
              rules: [{ required: true, message: '请选择权限' }],
              preserve: true,
            })(<Select>
                <Select.Option value={0}>部门经理</Select.Option>
                <Select.Option value={1}>系统管理员</Select.Option>
                <Select.Option value={2}>普通员工</Select.Option>
              </Select>)}
          </Form.Item>}
        </Form>
        <div className="steps-action">
          {currentStep < 2 && (
            <Button type="primary" onClick={() => this.next()}>
              下一步
            </Button>
          )}
          {currentStep === 2 && (
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          )}
          {currentStep > 0 && (
            <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
              上一步
            </Button>
          )}
        </div>
        {type == 'regist' && <div className="login_txt" type="secondary" onClick={this.gotoLogin}>点击这里登录</div>}
      </div>
    );
  }
}

const UserAdd = Form.create({})(UserApp);

const mapStateToProps = (state) => {
    return {
      
    };
};

export default connect(mapStateToProps, { gotoLogin })(UserAdd)