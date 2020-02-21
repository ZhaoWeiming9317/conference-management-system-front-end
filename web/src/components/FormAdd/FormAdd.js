import React from 'react'
import { connect } from 'react-redux';
import { Form, Input, Button, message, Steps, DatePicker} from 'antd';
const { Step } = Steps;

import {formAdd, formModify} from '../../api/apiForm';
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

class FormApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        form_name: '',
        device_name: '',
        room_name: '',
        repair_man: '',
        service_man: '',
        verify_man: '',
        reason: '',
        repair_time: null,
        service_time: null,
        finish_time: null,
        measure: '',
        currentStep: 0,
    }
  }
  componentWillMount() {
    let data = this.props.data
    if (this.props.type === 'modify') {
        console.log(data)
        this.setState({...data,
        form_name: data.formName,
        device_name: data.device.deviceName,
        room_name:data.room.roomName,
        repair_man:data.repairMan,
        service_man:data.serviceMan,
        verify_man:data.verifyMan,
        repair_time:data.repairTime,
        service_time:data.serviceTime,
        finish_time:data.finishTime
    })
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
    let formInfo = this.props.form.getFieldsValue();
    formInfo['service_time'] = formInfo['service_time'].format("YYYY-MM-DD HH:mm:ss")
    formInfo['repair_time'] = formInfo['repair_time'].format("YYYY-MM-DD HH:mm:ss")
    formInfo['finish_time'] = formInfo['finish_time'].format("YYYY-MM-DD HH:mm:ss")

    this.props.form.validateFields((err, values) => {
      console.log(formInfo)
      if (!err) {
        if(this.props.type === 'add') {
          formAdd(JSON.stringify(formInfo)).then((res)=>{
            if (res.state == 1) {
              message.success("添加成功")
            } else {
              message.error("添加失败")
            }
          }).catch((error)=>{
            message.error("系统错误")
          })
        } else {
          formModify(JSON.stringify(formInfo)).then((res)=>{
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
    const { currentStep } = this.state;
    return (
    <div>
        <Steps current={currentStep} onChange={current => this.setState({ currentStep: current })}>
          <Step title="表单基础" />
          <Step title="人员相关" />
          <Step title="时间相关" />
        </Steps>
        <Form style={{paddingTop: 20}} labelCol={{ span: 8 , offset: 2}} wrapperCol={{ span: 12 }} labelAlign='left' onSubmit={this.handleSubmit}>
          {currentStep === 0 && <Form.Item label="表单名称">
            {getFieldDecorator('form_name', {
              initialValue: this.state.form_name, 
              rules: [
                { required: true, message: '请填写表单名称' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<Input placeholder="请填写表单名称" />)}
          </Form.Item>}
          {currentStep === 0 && <Form.Item label="设备名称">
            {getFieldDecorator('device_name', {
              initialValue: this.state.device_name,
              rules: [
                { required: true, message: '请填写设备名称' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<Input placeholder="请填写设备名称" />)}
          </Form.Item>}
          {currentStep === 0 && <Form.Item label="会议室名称">
            {getFieldDecorator('room_name', {
              initialValue: this.state.room_name,
              rules: [
                { required: true, message: '请填写会议室名称' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<Input placeholder="请填写会议室名称" />)}
          </Form.Item>}
          {currentStep === 0 && <Form.Item label="故障原因">
            {getFieldDecorator('reason', {
              initialValue: this.state.reason,
              rules: [
                { required: true, message: '请填写故障原因' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<Input placeholder="请填写故障原因" />)}
          </Form.Item>}
          {currentStep === 0 && <Form.Item label="检修措施">
            {getFieldDecorator('measure', {
              initialValue: this.state.measure,
              rules: [
                { required: true, message: '请填写检修措施' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<Input placeholder="请填写检修措施" />)}
          </Form.Item>}
          {currentStep === 1 && <Form.Item label="维修人员姓名">
            {getFieldDecorator('repair_man', {
              initialValue: this.state.repair_man,
              rules: [
                { required: true, message: '请填写维修人员姓名' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<Input placeholder="请填写维修人员姓名" />)}
          </Form.Item>}
          {currentStep === 1 && <Form.Item label="服务人员姓名">
            {getFieldDecorator('service_man', {
              initialValue: this.state.service_man,
              rules: [
                { required: true, message: '请填写服务人员姓名' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<Input placeholder="请填写服务人员姓名" />)}
          </Form.Item>}
          {currentStep === 1 && <Form.Item label="审查人员姓名">
            {getFieldDecorator('verify_man', {
              initialValue: this.state.verify_man,
              rules: [
                { required: true, message: '请填写审查人员姓名' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<Input placeholder="请填写审查人员姓名" />)}
          </Form.Item>}
          {currentStep === 2 && <Form.Item label="维修时间">
            {getFieldDecorator('repair_time', {
              initialValue: moment(this.state.repair_time),
              rules: [
                { required: true, message: '请填写维修时间' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<DatePicker locale={locale}
               placeholder="请填写维修时间" style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" showTime={true}/>)}
          </Form.Item>}
          {currentStep === 2 && <Form.Item label="服务时间">
            {getFieldDecorator('service_time', {
              initialValue: moment(this.state.service_time),
              rules: [
                { required: true, message: '请填写服务时间' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<DatePicker locale={locale}
               placeholder="请填写服务时间" style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" showTime={true}/>)}
          </Form.Item>}
          {currentStep === 2 && <Form.Item label="完成时间">
            {getFieldDecorator('finish_time', {
              initialValue: moment(this.state.finish_time),
              rules: [
                { required: true, message: '请填写完成时间' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<DatePicker locale={locale}
               placeholder="请填写完成时间" format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} showTime={true}/>)}
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
      </div>
    );
  }
}

const FormAdd = Form.create({})(FormApp);

const mapStateToProps = (state) => {
    return {
      
    };
};

export default connect(mapStateToProps)(FormAdd)