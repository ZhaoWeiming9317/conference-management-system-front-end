import React from 'react'
import { connect } from 'react-redux';
import { Form, Input, Button, message, Steps, DatePicker, Icon } from 'antd';
import {meetingAdd, meetingDelete} from '../../api/apiMeeting';
const { Step } = Steps;
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')


class DeviceApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      meeting_name : '',
      room_id:'',
      user_id:'',// host_id
      start_time:'',
      end_time:'',
      host:'',
      recoder:'',
      members:[],
      topic:'',
      meetingAbstract:'',
      remark: '',
      currentStep: 0,
    }
    this.id = 0
  }
  componentWillMount() {
    let data = this.props.data
    if (this.props.type === 'modify') {
        this.setState({...data,
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
    let meetingInfo = this.props.form.getFieldsValue();

    let execMeetingInfo = {}
    execMeetingInfo['meeting_name'] = meetingInfo['meeting_name']
    execMeetingInfo['room'] = {room_id : meetingInfo['room_id']}
    execMeetingInfo['start_time'] = meetingInfo['start_time'].format("YYYY-MM-DD HH:mm:ss")
    execMeetingInfo['end_time'] = meetingInfo['end_time'].format("YYYY-MM-DD HH:mm:ss")
    execMeetingInfo['host'] = {user_id :meetingInfo['user_id'],name : meetingInfo['host']}
    execMeetingInfo['recorder'] = {name : meetingInfo['recorder']}
    execMeetingInfo['members'] = []
    meetingInfo['keys'].map((key) => {
      execMeetingInfo['members'].push({name: meetingInfo['names'][key]})}
        )
    execMeetingInfo['topic'] = meetingInfo['topic']
    execMeetingInfo['meetingAbstract'] = meetingInfo['meetingAbstract']
    execMeetingInfo['remark'] = meetingInfo['remark']

    console.log(execMeetingInfo)
    this.props.form.validateFields((err, values) => {
        if (!err) {
          if(this.props.type === 'add') {
            meetingAdd(JSON.stringify(execMeetingInfo)).then((res)=>{
              if (res.state == 2) {
                message.success("添加成功")
              } else if (res.state == 1){
                message.error("成员中存在姓名不合法的情况")
              } else if (res.state == 0) {
                message.error("记录者不存在")
              } else {
                message.error("未知错误")
              }
            }).catch((error)=>{
              message.error("系统错误")
            })
          } else {
            meetingModify(JSON.stringify({...execMeetingInfo,
            meetingId: this.props.data.meeting_id})).then((res)=>{
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

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { currentStep } = this.state;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItemLayout = {
        labelCol: { span: 8 , offset: 2},
        wrapperCol: { span: 12 },
        labelAlign: 'left'
      };
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...formItemLayout}
        label={index === 0 ? '参会人员' : '参会人员'}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "请输入参会人员名字",
            },
          ],
          preserve: true,
        })(<Input placeholder="参会人员名字" style={{ width: '60%', marginRight: 8 }} />)}
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
 
    return (
      <div>
        <Steps current={currentStep} onChange={current => this.setState({ currentStep: current })}>
          <Step title="会议信息" />
          <Step title="人员信息" />
          <Step title="其他信息" />
        </Steps>
        <Form style={{paddingTop: 20}} labelCol={{ span: 8 , offset: 2}} wrapperCol={{ span: 12 }} labelAlign='left' onSubmit={this.handleSubmit}>
        {currentStep === 0 && <Form.Item label="会议名称">
          {getFieldDecorator('meeting_name', {
            initialValue: this.state.meeting_name, 
            rules: [{ required: true, message: '请输入会议名称' }],
            preserve: true,
          })(<Input placeholder="请输入会议名称" autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 0 && <Form.Item label="会议室ID">
          {getFieldDecorator('room_id', {
            initialValue: this.state.room_id, 
            rules: [{ required: true, message: '请输入会议室ID' }],
            preserve: true,
          })(<Input placeholder="请输入会议室ID" autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 0 && <Form.Item label="开始时间">
            {getFieldDecorator('start_time', {
              rules: [
                { required: true, message: '请填写开始时间' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<DatePicker locale={locale}
               placeholder="请填写开始时间" style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" showTime={true}/>)}
          </Form.Item>}
          {currentStep === 0 && <Form.Item label="结束时间">
            {getFieldDecorator('end_time', {
              rules: [
                { required: true, message: '请填写结束时间' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<DatePicker locale={locale}
               placeholder="请填写结束时间" style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" showTime={true}/>)}
          </Form.Item>}
          {currentStep === 1 && <Form.Item label="发起人Id">
            {getFieldDecorator('user_id', {
                initialValue: this.state.user_id,
                rules: [{ required: true, message: '请输入发起人Id' }],
                preserve: true,
            })(<Input autoComplete="new-password"/>)}
          </Form.Item>}
        {currentStep === 1 && <Form.Item label="发起人">
          {getFieldDecorator('host', {
            initialValue: this.state.host,
            rules: [{ required: true, message: '请输入发起人名称' }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 1 && <Form.Item label="记录人员">
          {getFieldDecorator('recorder', {
            initialValue: this.state.recorder,
            rules: [{ required: true }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 1 && formItems}
        {currentStep === 1 && <Form.Item label="增加参会人员">
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> 增加参会人员
          </Button>
        </Form.Item>}
        {currentStep === 2 && <Form.Item label="会议类型">
          {getFieldDecorator('topic', {
            initialValue: this.state.topic,
            rules: [{ required: true }],
            preserve: true,
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 2 && <Form.Item label="会议摘要">
          {getFieldDecorator('meetingAbstract', {
            initialValue: this.state.meetingAbstract,
            rules: [{ required: true }],
            preserve: true,
          })(<Input.TextArea rows={3} autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 2 && <Form.Item label="备注">
          {getFieldDecorator('remark', {
            initialValue: this.state.remark,
            rules: [{ required: false }],
            preserve: true,
          })(<Input.TextArea rows={3} autoComplete="new-password"/>)}
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