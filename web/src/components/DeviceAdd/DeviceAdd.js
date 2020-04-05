import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Select, message, Divider } from 'antd'
import { deviceAdd, deviceModify } from '../../api/apiDevice'
import { roomSearchPage } from '../../api/apiRoom'
const { Option } = Select;

class DeviceApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      device_name : '',
      brand:'',
      type:'',
      mttr:'',
      mtbf:'',
      room_id:'',
      repair_time:'',
      device_id: '',
      searchDown: [],
      tempValue: '',
      scrollPage: 1,
      typeList: ['AirCon','TV', 'Light','TouchPad', 'SoundBox'],
      selfTypeValue: ''
    }
    this.index = 0
    this.searchScroll = this.searchScroll.bind(this)
  }
  componentWillMount() {
    let data = this.props.data
    if (this.props.type === 'modify') {
        console.log(data)
        this.setState({...data,
        device_name: data.deviceName,
        device_id: data.deviceId,
        room_id: data.roomId,
        room_name: data.roomName,
        type:data.deviceType})
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    let deviceInfo = this.props.form.getFieldsValue();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(deviceInfo)
        if(this.props.type === 'add') {
          deviceAdd(JSON.stringify({...deviceInfo,device_type: deviceInfo.type,room: [], room_id: (deviceInfo.room && deviceInfo.room.key)})).then((res)=>{
            if (res.state == 1) {
              message.success("添加成功")
              this.props.closeModal()
            } else {
              message.error(res.message)
            }
          }).catch((error)=>{
            message.error("系统错误")
          })
        } else {
          deviceModify(JSON.stringify({...deviceInfo,device_type: deviceInfo.type})).then((res)=>{
            if (res.state == 1) {
              message.success("修改成功")
              this.props.closeModal()
            } else {
              message.error(res.message)
            }
          }).catch((error)=>{
            message.error("系统错误")
          })
        }
      }
    })
  }

  searchName = (page,e) => {
    let { tempValue,searchDown } = this.state
    let scrollPage = page
    this.setState({tempValue, scrollPage})
    const { getFieldsValue } = this.props.form;
    let data = {
      page: page,
      volume: 10
    }
    roomSearchPage(JSON.stringify(data)).then((res)=>{
      if (page == 1) {searchDown = []}
      res.list.map(r => {
        searchDown.push({
          name: r['roomName'],
          id: r['roomId']
        })
      })
      this.setState({
        searchDown
      })
    })  
  }

  searchScroll = e => {
    e.persist();
    const { target } = e;
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 1) {
      const { scrollPage } = this.state
      const nextScrollPage = scrollPage + 1
      this.setState({ scrollPage: nextScrollPage })
      this.searchName(nextScrollPage) 
   }
  }
  onSelfType = e => {
    this.setState({
      selfTypeValue: event.target.value,
    })
  }
  addItem = () => {
    console.log('addItem');
    const { typeList, selfTypeValue } = this.state;
    this.setState({
      typeList: [...typeList, selfTypeValue || `default ${this.index++}`],
      selfTypeValue: '',
    })
  }

  render() {
    const { getFieldDecorator} = this.props.form
    const { searchDown , typeList } = this.state
    const options = searchDown.map(d => <Option value={d.id}><span>{d.name}</span><span style={{color: '#d9d9d9'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{d.id}</span></Option>)

    return (
      <Form labelCol={{ span: 8 , offset: 2}} wrapperCol={{ span: 12 }} labelAlign='left' onSubmit={this.handleSubmit}>
        {this.props.type == 'modify'&& <Form.Item label="设备Id">
          {getFieldDecorator('device_id', {
            initialValue: this.state.device_id, 
            rules: [{ required: true, message: '请输入设备Id' }],
          })(<Input autoComplete="new-password"/>)}
        </Form.Item>
        }
        <Form.Item label="设备名称">
          {getFieldDecorator('device_name', {
            initialValue: this.state.device_name, 
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
          {getFieldDecorator('type', {
            initialValue: this.state.type,
            rules: [{ required: true, message: '请输入设备型号' }],
          })
          (<Select>
            {typeList.map(item => (
              <Option key={item}>{item}</Option>
            ))}
          </Select>)}
        </Form.Item>
        <Form.Item label="设备所在会议室">
          {getFieldDecorator('room', {
            initialValue: { key: this.state.room_id , label:  this.state.room_name},
            rules: [{ required: true, message: '请选择设备所在会议室'  }],
            preserve: true,
          })(
          <Select placeholder="设备所在会议室" 
          labelInValue
          onSearch={this.searchWhenSelectChange}
          onFocus={(e)=>this.searchName(1,e)}
          onPopupScroll={this.searchScroll}
          notFoundContent={null}
          defaultActiveFirstOption={false}
          filterOption={false}  
          showSearch
          >
            {options}
          </Select>)}
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