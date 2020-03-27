import React from 'react'
import './RoomAdd.sass'
import { connect } from 'react-redux';
import { Form, Input, Button, message, Steps, InputNumber } from 'antd';
import {roomAdd, roomModify} from '../../api/apiRoom';
const { Step } = Steps;

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
      floor:'1',
      city:'',
      building:'',
      block:'',
      currentStep: 0,
      stepStatus: ['process','wait','wait']
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
                this.props.closeModal()
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
                this.props.closeModal()
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
  onChangeStep = (next) => {
    let { stepStatus } = this.state
    this.props.form.validateFields((err, values) => {
      if(!err) {
        if (next == this.state.currentStep + 2) {
          stepStatus[this.state.currentStep] = 'finish'
          stepStatus[this.state.currentStep + 1] = 'process'
          this.setState({ currentStep: this.state.currentStep + 1 }) 
        } else {
          stepStatus[this.state.currentStep] = 'finish'
          stepStatus[next] = 'process'
          this.setState({ currentStep: next })  
        }
      } else {
        stepStatus[this.state.currentStep] = 'error'
      }
    })
  }
  next() {
    let { stepStatus } = this.state
    this.props.form.validateFields((err, values) => {
      if(!err) {
          stepStatus[this.state.currentStep] = 'finish'
          stepStatus[this.state.currentStep + 1] = 'process'
          this.setState({ currentStep: this.state.currentStep + 1 })  
      } else {
        stepStatus[this.state.currentStep] = 'error'
      }
    })
  }

  prev() {
    let { stepStatus } = this.state
    this.props.form.validateFields((err, values) => {
      if(!err) {
          stepStatus[this.state.currentStep] = 'finish'
          stepStatus[this.state.currentStep - 1] = 'process'
          this.setState({ currentStep: this.state.currentStep - 1 })  
      } else {
        stepStatus[this.state.currentStep] = 'error'
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { currentStep , stepStatus} = this.state;

    return (
      <div>
        <Steps current={currentStep} onChange={(current) => this.onChangeStep(current)}>
          <Step title="会议室基础" status= {stepStatus[0]}/>
          <Step title="位置信息" status= {stepStatus[1]}/>
          <Step title="其他信息" status= {stepStatus[2]}/>
        </Steps>
        <Form style={{paddingTop: 20}} labelCol={{ span: 8 , offset: 2}} wrapperCol={{ span: 12 }} labelAlign='left' onSubmit={this.handleSubmit}>
        {currentStep === 0 && <Form.Item label="会议室容量">
          {getFieldDecorator('roomVolume', {
            initialValue: this.state.roomVolume, 
            rules: [{ required: true, message: '请输入会议室容量' }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 0 && <Form.Item label="会议室编号">
          {getFieldDecorator('roomNumber', {
            initialValue: this.state.roomNumber, 
            rules: [{ required: true, message: '请输入会议室编号' }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 0 && <Form.Item label="会议室名称">
          {getFieldDecorator('roomName', {
            initialValue: this.state.roomName,
            rules: [{ required: true, message: '请输入会议室名称' }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 1 && <Form.Item label="国家">
          {getFieldDecorator('country', {
            initialValue: this.state.country,
            rules: [{ required: true, message: '请输入国家名称' }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 1 && <Form.Item label="省份/自治区">
          {getFieldDecorator('province', {
            initialValue: this.state.province,
            rules: [{ required: true, message: '请输入省份/自治区名称' }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 1 && <Form.Item label="城市">
          {getFieldDecorator('city', {
            initialValue: this.state.city,
            rules: [{ required: true, message: '请输入城市名称' }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 1 && <Form.Item label="街区">
          {getFieldDecorator('block', {
            initialValue: this.state.block,
            rules: [{ required: true, message: '请输入街区名称' }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 1 && <Form.Item label="大楼">
          {getFieldDecorator('building', {
            initialValue: this.state.building,
            rules: [{ required: true, message: '请输入大楼名称' }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 1 && <Form.Item label="楼层">
          {getFieldDecorator('floor', {
            initialValue: this.state.floor,
            rules: [{ required: true, message: '请输入楼层数' }],
            preserve: true,
          })(<InputNumber
            defaultValue={1}
            min={-5}
            max={100}
            formatter={value => `${value}楼`}
            parser={value => value.replace('楼', '')}
          />)}
        </Form.Item>}
        {currentStep === 2 && <Form.Item label="备注">
          {getFieldDecorator('mark', {
            initialValue: this.state.mark,
            rules: [{ required: false }],
            preserve: true,
          })(<Input.TextArea rows={4} autoComplete="new-password"/>)}
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

const DeviceAdd = Form.create({})(DeviceApp);

const mapStateToProps = (state) => {
    return {
      
    };
};

export default connect(mapStateToProps)(DeviceAdd)