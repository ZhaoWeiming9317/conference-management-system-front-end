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

import { deBounce } from '../../constants/tool'
class MeetingApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStep: 0,
      searchDown: [],
      tempValue: '',
      scrollPage: 1,
      modalLoading: false,
      stepStatus: ['process','wait','wait']
    }
    this.id = 0
    this.timeout = null
    this.searchScroll = this.searchScroll.bind(this)
    this.searchWhenSelectChange = deBounce(this.searchWhenSelectChange, 500)
  }
  componentDidMount() {
    let {userMeetingData , type} = this.props
    if ( type != 'add' && type != 'userAdd') {
      let members = userMeetingData.members || []
      members.map((item)=>{
        this.add()
      })  
    }
  }

  compareMembers(oldMembers, newMembers) {
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
    let {userMeetingData} = this.props
    e.preventDefault();
    this.setState({modalLoading:true})
    let meetingInfo = this.props.form.getFieldsValue();
    
    let execMeetingInfo = {}
    execMeetingInfo['meeting_name'] = meetingInfo['meeting_name']
    execMeetingInfo['room'] = {room_id : meetingInfo['room_id'].toString()}
    execMeetingInfo['start_time'] = meetingInfo['start_time'].format("YYYY-MM-DD HH:mm:ss")
    execMeetingInfo['end_time'] = meetingInfo['end_time'].format("YYYY-MM-DD HH:mm:ss")
    execMeetingInfo['host'] = {user_id : meetingInfo['user_id'] || userMeetingData.host.userId}
    execMeetingInfo['recorder'] = {user_id : (meetingInfo['recorder'] && meetingInfo['recorder']['key']) || userMeetingData.recorder.userId}
    execMeetingInfo['members'] = []
    meetingInfo['keys'].map((key) => {
      execMeetingInfo['members'].push({user_id: meetingInfo['names'][key]['key']})}
    )
    execMeetingInfo['topic'] = meetingInfo['topic']
    execMeetingInfo['meetingAbstract'] = meetingInfo['meetingAbstract']
    execMeetingInfo['remark'] = meetingInfo['remark']
    execMeetingInfo['meeting'] = meetingInfo['remark']
    this.props.form.validateFields((err, values) => {
        if (!err) {
          if(this.props.type === 'add' || this.props.type === 'userAdd') {
            meetingAdd(JSON.stringify(execMeetingInfo)).then((res)=>{
              this.setState({modalLoading:false})
              if (res.state == 3) {
                message.success("添加成功")
                this.closeThisModal()
              } else if (res.state == 1){
                message.error("成员中存在姓名不合法的情况")
              } else if (res.state == 0) {
                message.error("记录者不存在")
              } else {
                message.error(res.message)
              }
            }).catch((error)=>{
              message.error("系统错误")
            })
          } else {
            let oldMembers = userMeetingData.members.map((item) =>{
              return item.userId
            })
            let newMembers = execMeetingInfo['members'].map((item)=>{
              return item.user_id
            })

            let modifyData = {
              meeting_name: execMeetingInfo['meeting_name'],
              members: execMeetingInfo['members'],
              start_time: execMeetingInfo['start_time'],
              end_time: execMeetingInfo['end_time'],
              room: execMeetingInfo['room'],
              meeting_id: this.props.userMeetingData.meetingId,
              host: execMeetingInfo['host'],
              recorder: execMeetingInfo['recorder'],
              topic: execMeetingInfo['topic'],
              meetingAbstract: execMeetingInfo['meetingAbstract'],
              remark: execMeetingInfo['remark']
            }
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
              meetingModify(JSON.stringify({...modifyData})).then((res)=>{
                  if (res.state == 1) {
                    resolve(res)
                  } else {
                    reject(res)
                    message.error(res.message)
                  }
                }).catch((error)=>{
                  this.setState({modalLoading:false})
                  reject(error)
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
                        message.error(res.message)
                      }
                    }).catch((error)=>{
                      this.setState({modalLoading:false})
                    })
                }
              }) 
            },(error)=>{
              return new Promise((resolve,reject)=>{
                this.setState({modalLoading:false})
                reject(error)
            })
          })

            addMembers.then((res)=>{
              if (deleteData['members'].length == 0) {
                message.success("会议修改成功") 
                this.setState({modalLoading:false})
                this.closeThisModal()
              } else {
                meetingMembersDelete(JSON.stringify({...deleteData})).then((res)=>{
                    this.setState({modalLoading:false})
                    if(res.state == 1){
                      message.success("会议修改成功") 
                      this.closeThisModal()
                    } else {
                      message.error("会议修改失败")
                    }
                    this.setState({modalLoading:false})
                  }).catch((error)=>{
                    this.setState({modalLoading:false})
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
    return {
      disabledHours: () => this.range(0, 9).concat(this.range(19, 24)),
      disabledSeconds: () => this.range(1, 30).concat(this.range(31, 60)),
    };
  }
        // disabledMinutes: () => this.range(1, 30).concat(this.range(31, 60)),

  
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 0) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    })
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(this.id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  closeThisModal = () => {
    this.props.closeModal()
  }

  searchName = (page,e) => {
    let { tempValue,searchDown } = this.state
    let scrollPage = page
    this.setState({tempValue, scrollPage})
    setTimeout(() => {
      const { getFieldsValue } = this.props.form;
      let meetingInfo = getFieldsValue()
      let data = {
        name: tempValue || '',
        start_time:this.state.start_time,
        end_time:this.state.end_times,
        page: page,
        volume: 10
      }
      userNameSearch(JSON.stringify(data)).then((res)=>{
        if (page == 1) {searchDown = []}
        res.list.map(r => {
          searchDown.push({
            value: r['userId'],
            text: r['name'],
            username: r['username']
          });
        });
        this.setState({
          searchDown
        })
      })  
    }, 0);
  }

  searchScroll = e => {
      e.persist();
      const { target } = e;
      if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 1) {
        const { scrollPage } = this.state;
        const nextScrollPage = scrollPage + 1;
        this.setState({ scrollPage: nextScrollPage });
        this.searchName(nextScrollPage); // 调用api方法
     }
 }
 searchWhenSelectChange = (e)=>{
    console.log(e)
 }

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
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { type , userMeetingData } = this.props;
    const { currentStep , stepStatus} = this.state;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItemLayout = {
        labelCol: { span: 8 , offset: 2},
        wrapperCol: { span: 14 },
        labelAlign: 'left'
      };
    const options = this.state.searchDown.map(d => <Option value={d.value}><span>{d.text}</span><span style={{color: '#d9d9d9'}}>&nbsp;{d.username}</span></Option>);
    const formItems = keys.map((k, index) => (
      <Form.Item
        {...formItemLayout}
        label={index === 0 ? '参会人员' : '参会人员'}
        required={false}
        key={k}
      >
        {getFieldDecorator(`names[${k}]`, {
          initialValue: { key: userMeetingData.members[k] && userMeetingData.members[k].userId,  label:  userMeetingData.members[k] && userMeetingData.members[k].name},
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
        value={this.state.tempValue}
        style={{ width: '80%', marginRight: 8 }} 
        onSearch={this.searchWhenSelectChange}
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
        <Steps current={currentStep} onChange={(current) => this.onChangeStep(current)}>
          <Step title="会议信息" status= {stepStatus[0]}/>
          <Step title="人员信息" status= {stepStatus[1]}/>
          <Step title="其他信息" status= {stepStatus[2]}/>
        </Steps>
        <Form style={{paddingTop: 20}} labelCol={{ span: 8 , offset: 2}} wrapperCol={{ span: 12 }} labelAlign='left' onSubmit={this.handleSubmit}>
        {currentStep === 0   && ( type == 'add' || type == 'userAdd' ) && <Form.Item label="会议名称">
          {getFieldDecorator('meeting_name', {
            initialValue: userMeetingData.meetingName, 
            rules: [{ required: true, message: '请输入会议名称' }],
            preserve: true,
          })(<Input placeholder="请输入会议名称" autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 0   &&  ( type !== 'add' && type !== 'userAdd' ) && <Form.Item label="会议名称">
          {getFieldDecorator('meeting_name', {
            initialValue: userMeetingData.meetingName, 
            rules: [{ required: true, message: '请输入会议名称' }],
            preserve: true,
          })(<Input disabled placeholder="请输入会议名称" autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 0  && type === 'add' && <Form.Item label="会议室ID">
          {getFieldDecorator('room_id', {
            initialValue: userMeetingData.room && userMeetingData.room.roomId, 
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
            initialValue: userMeetingData.room && userMeetingData.room.roomId, 
            rules: [{ required: true, message: '请输入会议室ID' }],
            preserve: true,
          })(<Input placeholder="请输入会议室ID" disabled autoComplete="new-password"/>)}
        </Form.Item>}
          {currentStep === 0 && (type !== 'add') && <Form.Item label="开始时间">
            {getFieldDecorator('start_time', {
              initialValue: moment(userMeetingData.startTime || userMeetingData.start_time), 
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
              initialValue: moment(userMeetingData.endTime || userMeetingData.end_time), 
              rules: [
                { required: true, message: '请填写结束时间' },
              ],
              preserve: true, // 即便字段不再使用，也保留该字段的值（做分布表单的关键）
            })(<DatePicker locale={locale}
               disabled
               placeholder="请填写结束时间" style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" showTime={true}/>)}
          </Form.Item>}
          {currentStep === 1 && <Form.Item label="发起人ID">
            {getFieldDecorator('user_id', {
                initialValue: (userMeetingData.host.user_id || userMeetingData.host.userId),
                rules: [{ required: true, message: '请输入发起人ID' }],
                preserve: true,
            })(<Input placeholder="请输入发起人ID" disabled={ (type !== 'add') && true} autoComplete="new-password"/>)}
          </Form.Item>}
        {currentStep === 1 && <Form.Item label="发起人">
          {getFieldDecorator('hostName', {
            initialValue: userMeetingData.host.name,
            rules: [{ required: true, message: '请输入发起人名称' }],
            preserve: true,
          })(<Input placeholder="请输入发起人名称" disabled={ (type !== 'add') && true} autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 1 && <Form.Item label="记录人员">
          {getFieldDecorator('recorder', {
            initialValue: { key: userMeetingData.recorder ? userMeetingData.recorder.userId : '', label:  userMeetingData.recorder ? userMeetingData.recorder.name : ''},
            rules: [{ required: true, message: '请选择记录人员名称'  }],
            preserve: true,
          })(<Select placeholder="记录人员名字" 
          labelInValue
          style={{ width: '80%', marginRight: 8 }} 
          onSearch={this.searchWhenSelectChange}
          onFocus={(e)=>this.searchName(1,e)}
          onPopupScroll={this.searchScroll}
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
        {currentStep === 2 && <Form.Item label="会议主题">
          {getFieldDecorator('topic', {
            initialValue: userMeetingData.topic,
            rules: [{ required: true, message: '请输入会议主题' }],
            preserve: true,
          })(<Input placeholder="请输入会议主题" autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 2 && <Form.Item label="会议摘要">
          {getFieldDecorator('meetingAbstract', {
            initialValue: userMeetingData.meetingAbstract,
            rules: [{ required: true , message: '请输入会议摘要'}],
            preserve: true,
          })(<Input.TextArea placeholder="请输入会议摘要" rows={3} autoComplete="new-password"/>)}
        </Form.Item>}
        {currentStep === 2 && <Form.Item label="备注">
          {getFieldDecorator('remark', {
            initialValue: userMeetingData.remark,
            rules: [{ required: false}],
            preserve: true,
          })(<Input.TextArea rows={3} placeholder="请备注" autoComplete="new-password"/>)}
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

const MeetingAdd = Form.create({})(MeetingApp);

const mapStateToProps = (state) => {
    return {
      
    };
};

export default connect(mapStateToProps)(MeetingAdd)