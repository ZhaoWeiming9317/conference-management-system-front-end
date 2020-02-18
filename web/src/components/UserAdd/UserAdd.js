import React from 'react'
import { connect } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import {deviceAdd, deviceModify} from '../../api/apiDevice';

class DeviceApp extends React.Component {
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
    }
  }
  componentWillMount() {
    let data = this.props.data
    if (this.props.type === 'modify') {
        console.log(data)
        this.setState({...data})
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    let deviceInfo = this.props.form.getFieldsValue();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.props.type === 'add') {
          deviceAdd(JSON.stringify(deviceInfo)).then((res)=>{
            if (res.state == 1) {
              message.success("添加成功")
            } else {
              message.error("添加失败")
            }
          }).catch((error)=>{
            message.error("系统错误")
          })
        } else {
          deviceModify(JSON.stringify(deviceInfo)).then((res)=>{
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

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form labelCol={{ span: 8 , offset: 2}} wrapperCol={{ span: 12 }} labelAlign='left' onSubmit={this.handleSubmit}>
        <Form.Item label="用户名">
          {getFieldDecorator('username', {
            initialValue: this.state.username, 
            rules: [{ required: true, message: '请输入用户名' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator('password', {
            initialValue: this.state.password, 
            rules: [{ required: true, message: '请输入密码' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="再次密码">
          {getFieldDecorator('passwordAgain', {
            initialValue: this.state.passwordAgain,
            rules: [{ required: true, message: '请再次输入密码' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="权限">
          {getFieldDecorator('role', {
            initialValue: this.state.role,
            rules: [{ required: true, message: '请选择权限' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="姓名">
          {getFieldDecorator('name', {
            initialValue: this.state.name,
            rules: [{ required: true, message: '请输入姓名' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="性别">
          {getFieldDecorator('gender', {
            initialValue: this.state.gender,
            rules: [{ required: true, message: '请选择性别' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="组织">
          {getFieldDecorator('organization', {
            initialValue: this.state.gender,
            rules: [{ required: true, message: '请输入组织' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="部门">
          {getFieldDecorator('department', {
            initialValue: this.state.department,
            rules: [{ required: true, message: '请输入部门' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="职位">
          {getFieldDecorator('position', {
            initialValue: this.state.position,
            rules: [{ required: true, message: '请输入职位' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="电话">
          {getFieldDecorator('phone', {
            initialValue: this.state.phone,
            rules: [{ required: true, message: '请输入电话' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="邮箱">
          {getFieldDecorator('email', {
            initialValue: this.state.position,
            rules: [{ required: true, message: '请输入邮箱' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
          <Button type="primary" htmlType="submit" onClick={this.handleSubmit}>
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const DeviceAdd = Form.create({})(DeviceApp);

const mapStateToProps = (state) => {
    return {
      
    };
};

export default connect(mapStateToProps)(DeviceAdd)