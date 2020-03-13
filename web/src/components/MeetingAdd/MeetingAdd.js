import React from 'react'
import './MeetingAdd.css'

import { connect } from 'react-redux';
import { Form, Input, Button, message, Steps, DatePicker, Icon , Select } from 'antd';
const { Option } = Select;
const { Step } = Steps;

import {meetingAdd, meetingModify,  meetingMembersAdd, meetingMembersDelete} from '../../api/apiMeeting';
import {userNameSearch} from '../../api/apiUser';

import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')


class MeetingApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      meetingName : '',
      meetingId: '',
      room:{
        roomId: '',
        roomName: ''
      },
      startTime:'',
      endTime:'',
      host:{
        name: '',
        userId: '',
        username: ''
      },
      recorder:{
        name: '',
        userId: '',
        username: ''
      },
      members:[],
      topic:'',
      meetingAbstract:'',
      remark: '',
      currentStep: 0,
      searchDown: [],
      tempValue: '',
      scrollPage: 1,
      modalLoading: false,
    }
    this.id = 0
    this.timeout = null
  }
  componentWillMount() {
    let {userMeetingData} = this.props
    this.setState({...userMeetingData,
    },()=>{
      console.log(userMeetingData)
    })
  }
  componentDidMount() {
    let {userMeetingData , type} = this.props
    if ( type != 'add') {
      let members = userMeetingData.members || []
      members.map((item)=>{
        this.add()
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

  compareMembers(oldMembers, newMembers) {
    console.log('old',oldMembers)
    console.log('new',newMembers)
    let addList = []
    let deleteList = []
    oldMembers.map((oldItem)=>{
      // 新的数组没有旧的值，说明是删掉的
      if (newMembers.indexOf(oldItem) == -1) {
        deleteList.push(oldItem)
      }
    })

    newMembers.map((newItem)=>{
      if (oldMembers.indexOf(newItem) == -1) {
        addList.push(newItem)
      }
    })
    return {addList,deleteList}
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({modalLoading:true})
    let meetingInfo = this.props.form.getFieldsValue();
    
    let execMeetingInfo = {}
    execMeetingInfo['meeting_name'] = meetingInfo['meeting_name']
    execMeetingInfo['room'] = {room_id : meetingInfo['room_id']}
    execMeetingInfo['start_time'] = meetingInfo['start_time'].format("YYYY-MM-DD HH:mm:ss")
    execMeetingInfo['end_time'] = meetingInfo['end_time'].format("YYYY-MM-DD HH:mm:ss")
    execMeetingInfo['host'] = {user_id :meetingInfo['user_id']}
    execMeetingInfo['recorder'] = {user_id : meetingInfo['recorder']}
    execMeetingInfo['members'] = []
    meetingInfo['keys'].map((key) => {
      execMeetingInfo['members'].push({user_id: meetingInfo['names'][key]['key']})}
    )
    execMeetingInfo['topic'] = meetingInfo['topic']
    execMeetingInfo['meetingAbstract'] = meetingInfo['meetingAbstract']
    execMeetingInfo['remark'] = meetingInfo['remark']
    execMeetingInfo['meeting'] = meetingInfo['remark']
    console.log(execMeetingInfo)
    this.props.form.validateFields((err, values) => {
        if (!err) {
          if(this.props.type === 'add' || this.props.type === 'userAdd') {
            meetingAdd(JSON.stringify(execMeetingInfo)).then((res)=>{
              this.setState({modalLoading:false})
              if (res.state == 3) {
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
            let modifyData = {
              meeting_name: execMeetingInfo['meeting_name'],
              start_time: execMeetingInfo['start_time'],
              end_time: execMeetingInfo['end_time'],
              room: execMeetingInfo['room'],
              recorder: execMeetingInfo['recorder'],
              topic: execMeetingInfo['topic'],
              meetingAbstract: execMeetingInfo['meetingAbstract'],
              remark: execMeetingInfo['remark']
            }
            let oldMembers = this.state.members.map((item) =>{
              return item.userId
            })
            let newMembers = execMeetingInfo['members'].map((item)=>{
              return item.user_id
            })
            let { addList,deleteList } = (this.compareMembers(oldMembers,newMembers))
            let addData = {
              meeting_id: this.props.userMeetingData.meetingId,
              meeting_name: execMeetingInfo['meeting_name'],
              start_time: execMeetingInfo['start_time'],
              end_time: execMeetingInfo['end_time'],
              members: addList.map((id)=> {return{user_id: id}})
            }
            let deleteData = {
              meeting_id: this.props.userMeetingData.meetingId,
              meeting_name: execMeetingInfo['meeting_name'],
              start_time: execMeetingInfo['start_time'],
              end_time: execMeetingInfo['end_time'],
              members: deleteList.map((id)=> {return{user_id: id}})
            }
            let modifyConference = new Promise((resolve, reject) => {
              meetingModify(JSON.stringify({...execMeetingInfo})).then((res)=>{
                  if (res.state == 1) {
                    resolve(res)
                  } else {
                    reject(res)
                  }
                }).catch((error)=>{
                  this.setState({modalLoading:false})
                  message.error("系统错误")
              })
            })

            let addMembers = modifyConference.then((res)=>{
              return new Promise((resolve,reject)=>{
                if (addData['members'].length == 0) {
                  resolve(res)
                } else {
                  meetingMembersAdd(JSON.stringify({...addData})).then((res)=>{
                      if(res.state == 1){
                        resolve(res)
                      } else {
                        reject(res)
                      }
                    }).catch((error)=>{
                      this.setState({modalLoading:false})
                      message.error("系统错误")
                    })
                }
              }) 
            },(error)=>{
              this.setState({modalLoading:false})
              message.error("会议修改失败")
            })

            addMembers.then((res)=>{
              if (deleteData['members'].length == 0) {
                message.success("会议修改成功") 
              } else {
                meetingMembersDelete(JSON.stringify({...deleteData})).then((res)=>{
                    this.setState({modalLoading:false})
                    if(res.state == 1){
                      message.success("会议修改成功") 
                    } else {
                      message.error("会议修改失败")
                    }
                  }).catch((error)=>{
                    this.setState({modalLoading:false})
                    message.error("系统错误")
                  })  
              }
            },(error)=>{
              this.setState({modalLoading:false})
              message.error("会议修改失败")
            })
          }
        }
      });
  };

  handleSelectChange = value => {
    this.props.form.setFieldsValue({
      note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    });
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current < moment().add(-1, 'days');
  }

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  
  disabledDateTime = () => {
    console.log(this)
    return {
      disabledHours: () => this.range(0, 9).concat(this.range(19, 24)),
      disabledMinutes: () => this.range(1, 60),
      disabledSeconds: () => this.range(1, 60),
    };
  }
  
  
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

  searchName = (page,e) => {
    let { tempValue,searchDown } = this.state
    let scrollPage = page
    this.setState({tempValue, scrollPage})
    setTimeout(() => {
      const { getFieldsValue } = this.props.form;
      let meetingInfo = getFieldsValue()
      console.log(meetingInfo)
      let data = {
        name: tempValue || '',
        start_time:this.state.start_time,
        end_time:this.state.end_times,
        page: page,
        volume: 10
      }
      userNameSearch(JSON.stringify(data)).then((res)=>{
        console.log(res)
        if (page == 1) {searchDown = []}
        res.list.map(r => {
          searchDown.push({
            value: r['userId'],
            text: r['name'],
          });
        });
        console.log(searchDown)
        this.setState({
          searchDown
        })
      })  
    }, 0);
  }

  searchScroll = e => {
      e.persist();
      const { target } = e;
      if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
        const { scrollPage } = this.state;
        const nextScrollPage = scrollPage + 1;
        this.setState({ scrollPage: nextScrollPage });
        this.searchName(nextScrollPage); // 调用api方法
     }
 };
    
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { type } = this.props;
    const { currentStep } = this.state;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItemLayout = {
        labelCol: { span: 8 , offset: 2},
        wrapperCol: { span: 14 },
        labelAlign: 'left'
      };
    const options = this.state.searchDown.map(d => <Option value={d.value}>{d.text}</Option>);
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...formItemLayout}
        label={index === 0 ? '参会人员' : '参会人员'}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          initialValue: { key: this.state.members[k] ? this.state.members[k].userId : '', label:  this.state.members[k] ? this.state.members[k].name : ''},
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              type:'object',
              required: true,
              whitespace: true,
              message: "请输入参会人员名字",
            },
          ],
          preserve: true,
        })(<Select style={{height:"50px"}} placeholder="参会人员名字" 
        labelInValue
        style={{ width: '80%', marginRight: 8 }} 
        onChange={(e)=>this.searchName(1,e)} 
        onFocus={(e)=>this.searchName(1,e)}
        notFoundContent={null}
        onPopupScroll={this.searchScroll}
        showSearch
        allowClear>
          {options}
        </Select>
        )}
        {keys.length >= 1 ? (
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
            initialValue: this.state.meetingName, 
            rules: [{ required: true, message: '请输入会议名称' }],
            preserve: true,
          })(<Input placeholder="请输入会议名称" autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 0  && type === 'add' && <Form.Item label="会议室ID">
          {getFieldDecorator('room_id', {
            initialValue: this.state.room.roomId, 
            rules: [{ required: true, message: '请输入会议室ID' }],
            preserve: true,
          })(<Input placeholder="请输入会议室ID" autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 0 && type === 'add' && <Form.Item label="开始时间">
            {getFieldDecorator('start_time', {
              rules: [
                { required: true, message: '请填写开始时间' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<DatePicker locale={locale}
            placeholder="请填写开始时间" style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss"
            showTime={{
              defaultValue: moment('09:00:00', 'HH:mm:ss'),
            }}             
            disabledDate={this.disabledDate}
            disabledTime={this.disabledDateTime}
            showToday={false}
         />)}
          </Form.Item>}
          {currentStep === 0 && type === 'add' && <Form.Item label="结束时间">
            {getFieldDecorator('end_time', {
              rules: [
                { required: true, message: '请填写结束时间' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<DatePicker locale={locale}
               placeholder="请填写结束时间" style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" 
               showTime={{
                  defaultValue: moment('09:00:00', 'HH:mm:ss'),
                }}             
               disabledDate={this.disabledDate}
               disabledTime={this.disabledDateTime}
               showToday={false}
         />)}
          </Form.Item>}
          {currentStep === 0 && (type !== 'add') && <Form.Item label="会议室ID">
          {getFieldDecorator('room_id', {
            initialValue: this.state.room.roomId, 
            rules: [{ required: true, message: '请输入会议室ID' }],
            preserve: true,
          })(<Input placeholder="请输入会议室ID" disabled autoComplete="new-password"/>)}
        </Form.Item>}
          {currentStep === 0 && (type !== 'add') && <Form.Item label="开始时间">
            {getFieldDecorator('start_time', {
              initialValue: moment(this.state.startTime || this.state.start_time), 
              rules: [
                {  required: true, message: '请填写开始时间' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<DatePicker locale={locale}
              disabled
            placeholder="请填写开始时间" style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" showTime={true}/>)}
          </Form.Item>}
          {currentStep === 0 && (type !== 'add') && <Form.Item label="结束时间">
            {getFieldDecorator('end_time', {
              initialValue: moment(this.state.endTime || this.state.end_time), 
              rules: [
                { required: true, message: '请填写结束时间' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<DatePicker locale={locale}
               disabled
               placeholder="请填写结束时间" style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" showTime={true}/>)}
          </Form.Item>}
          {currentStep === 1 && <Form.Item label="发起人Id">
            {getFieldDecorator('user_id', {
                initialValue: (this.state.host.user_id || this.state.host.userId),
                rules: [{ required: true, message: '请输入发起人Id' }],
                preserve: true,
            })(<Input disabled={ (type !== 'add') && true} autoComplete="new-password"/>)}
          </Form.Item>}
        {currentStep === 1 && <Form.Item label="发起人">
          {getFieldDecorator('hostName', {
            initialValue: this.state.host.name,
            rules: [{ required: true, message: '请输入发起人名称' }],
            preserve: true,
          })(<Input disabled={ (type !== 'add') && true} autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 1 && <Form.Item label="记录人员">
          {getFieldDecorator('recorder', {
            initialValue: { key: this.state.recorder ? this.state.recorder.userId : '', label:  this.state.recorder ? this.state.recorder.name : ''},
            rules: [{ required: true }],
            preserve: true,
          })(<Select placeholder="记录人员名字" 
          labelInValue
          style={{ width: '80%', marginRight: 8 }} 
          onChange={(e)=>this.searchName(1,e)} 
          onFocus={(e)=>this.searchName(1,e)}
          notFoundContent={null}
          showSearch
          allowClear>
            {options}
          </Select>)}
        </Form.Item>}
          {currentStep === 1 && formItems}
        {currentStep === 1 && <Form.Item label="增加参会人员">
          <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
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
            <Button type="primary" onClick={this.handleSubmit} loading={this.state.modalLoading}>
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

const MeetingAdd = Form.create({})(MeetingApp);

const mapStateToProps = (state) => {
    return {
      
    };
};

export default connect(mapStateToProps)(MeetingAdd)