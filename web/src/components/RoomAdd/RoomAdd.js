import React from 'react'
import './RoomAdd.sass'
import { connect } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import {roomAdd, roomModify} from '../../api/apiRoom';

class DeviceApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roomVolume : '',
      roomNumber:'',
      roomName:'',
      province:'',
      country:'',
      mark:'',
      floor:'',
      city:'',
      building:'',
      block:''
    }
  }
  componentWillMount() {
    let data = this.props.data
    if (this.props.type === 'modify') {
        this.setState({...data,
        })
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    let deviceInfo = this.props.form.getFieldsValue();
    this.props.form.validateFields((err, values) => {
        if (!err) {
          if(this.props.type === 'add') {
            roomAdd(JSON.stringify(deviceInfo)).then((res)=>{
              if (res.state == 1) {
                message.success("添加成功")
              } else {
                message.error("添加失败")
              }
            }).catch((error)=>{
              message.error("系统错误")
            })
          } else {
            roomModify(JSON.stringify({...deviceInfo,
            roomId: this.props.data.roomId})).then((res)=>{
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

  handleSelectChange = value => {
    console.log(value);
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form labelCol={{ span: 8 , offset: 2}} wrapperCol={{ span: 12 }} labelAlign='left' onSubmit={this.handleSubmit}>
        <Form.Item label="会议室容量">
          {getFieldDecorator('roomVolume', {
            initialValue: this.state.roomVolume, 
            rules: [{ required: true, message: '请输入会议室容量' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="会议室编号">
          {getFieldDecorator('roomNumber', {
            initialValue: this.state.roomNumber, 
            rules: [{ required: true, message: '请输入会议室编号' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="会议室名称">
          {getFieldDecorator('roomName', {
            initialValue: this.state.roomName,
            rules: [{ required: true, message: '请输入会议室名称' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="国家">
          {getFieldDecorator('country', {
            initialValue: this.state.country,
            rules: [{ required: true, message: '请输入国家名称' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="城市">
          {getFieldDecorator('city', {
            initialValue: this.state.city,
            rules: [{ required: true, message: '请输入城市名称' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="街区">
          {getFieldDecorator('block', {
            initialValue: this.state.block,
            rules: [{ required: true, message: '请输入街区名称' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="大楼">
          {getFieldDecorator('building', {
            initialValue: this.state.building,
            rules: [{ required: true, message: '请输入大楼名称' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="楼层">
          {getFieldDecorator('floor', {
            initialValue: this.state.floor,
            rules: [{ required: true, message: '请输入楼层数' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="备注">
          {getFieldDecorator('mark', {
            initialValue: this.state.mark,
            rules: [{ required: false }],
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