import React from 'react'
import { connect } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import {deviceAdd, deviceModify} from '../../api/apiDevice';

class DeviceApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      device_name : '',
      brand:'',
      device_type:'',
      mttr:'',
      mtbf:'',
      room_name:''
    }
  }
  componentWillMount() {
    let data = this.props.data
    if (this.props.type === 'modify') {
        console.log(data)
        this.setState({...data,
        device_name: data.deviceName,
        room_name:data.room.roomName,
        room_id: data.room.roomId,
        device_type:data.deviceType})
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
        <Form.Item label="设备名称">
          {getFieldDecorator('deviceName', {
            initialValue: this.state.deviceName, 
            rules: [{ required: true, message: '请输入设备名称' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="商标">
          {getFieldDecorator('brand', {
            initialValue: this.state.brand, 
            rules: [{ required: true, message: '请输入设备商标' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="设备型号">
          {getFieldDecorator('device_type', {
            initialValue: this.state.device_type,
            rules: [{ required: true, message: '请输入设备型号' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="设备平均维修时间">
          {getFieldDecorator('mttr', {
            initialValue: this.state.mttr,
            rules: [{ required: true, message: '请输入平均维修时间' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="设备平均故障间隔时间">
          {getFieldDecorator('mtbf', {
            initialValue: this.state.mtbf,
            rules: [{ required: true, message: '请输入设备平均故障间隔时间' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        <Form.Item label="设备所在会议室名称">
          {getFieldDecorator('room_name', {
            initialValue: this.state.room_name,
            rules: [{ required: true, message: '请输入设备所在会议室名称' }],
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