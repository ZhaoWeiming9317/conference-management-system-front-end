import React from 'react'
import { connect } from 'react-redux';
import { Form, Input, Button } from 'antd';

class DeviceApp extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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
        <Form.Item label="设备名称">
          {getFieldDecorator('deviceName', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="商标">
          {getFieldDecorator('brand', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="类型">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="设备平均维修时间">
          {getFieldDecorator('mttr', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="设备平均故障间隔时间">
          {getFieldDecorator('mtbf', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="设备所在会议室名称">
          {getFieldDecorator('roomName', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="设备所在会议室id">
          {getFieldDecorator('roomId', {
            rules: [{ required: true, message: 'Please input your note!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 10 }}>
          <Button type="primary" htmlType="submit">
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