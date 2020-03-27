import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import { Row, Col, Typography, Cascader, Button, message, Modal, Dropdown, Menu, Popconfirm, Card, Icon} from 'antd';
import moment from 'moment'
import { roomBuildingSearch, roomFloorSearch } from '../../api/apiRoom'
import { deviceFloorSearch, deviceStateChange } from '../../api/apiDevice'


const { Title } = Typography;
class DeviceControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            building: '',
            floor: '',
            cascaderChosen: [],
            roomList: [],
            deviceId: -1,
            deviceState: 1
        }
        this.cascaderLoadData = this.cascaderLoadData.bind(this)
        this.cascaderOnChange = this.cascaderOnChange.bind(this)
    }  
    componentDidMount() {
        userLoginVerification().then((res) => {
            if (res.state == 0) {
                this.props.logout()
            }
        })
        this.initExec()
    }
    componentDidUpdate (prevProps) {
        if( prevProps.deviceId !==  this.props.deviceId || prevProps.deviceState !==  this.props.deviceState ) {
            this.buildFloorSubmit()    
        }
    }
    initExec() {
        let cascaderChosen = []
        roomBuildingSearch().then((res)=>{
            res.map((item)=>{
                cascaderChosen.push(
                    {
                        value: item,
                        label: `${item}`,
                        isLeaf: false
                    }
                )
            })
            this.setState({
                cascaderChosen : cascaderChosen,
                building : cascaderChosen[0].value
            },()=>{
                let { cascaderChosen } = this.state
                const data = {building : cascaderChosen[0].value}
                roomFloorSearch(JSON.stringify(data)).then((res)=>{
                    cascaderChosen[0].children = []
                    res.map((item)=>{
                        cascaderChosen[0].children.push(
                            {
                                value: item,
                                label: item
                            }
                        )    
                    })
                    this.setState({
                        cascaderChosen : this.state.cascaderChosen,
                        floor : cascaderChosen[0].children[0].value
                    },()=>{
                        this.buildFloorSubmit()
                    })
                })        
            })
        })
    }
    cascaderOnChange(value) {
        if (value.length == 2) {
            this.setState({
                building: value[0],
                floor: value[1]
            },()=>{
                this.buildFloorSubmit()
            })
        }
    }
    buildFloorSubmit() {
        let {building, floor} = this.state
        let data = {
            building: building,
            floor: floor
        }
        if (data['building'] == '' || data['floor'] == '') {
            message.error('大楼或楼层没有选择哦')
        } else {
            deviceFloorSearch(JSON.stringify(data)).then((res)=>{
                this.setState({roomList: res})
            })
        } 
    }
    cascaderLoadData(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        // load options lazily
        const data = {building : targetOption.value}
        roomFloorSearch(JSON.stringify(data)).then((res)=>{
            targetOption.loading = false
            targetOption.children = []
            res.map((item)=>{
                targetOption.children.push(
                    {
                        value: item,
                        label: `${item}楼`
                    }
                )    
            })
            this.setState({
                cascaderChosen : this.state.cascaderChosen
            })
        })
    }
    stateControl(e,device_id,room_id,state) {
        let data = {device_id,room_id,state}        
        deviceStateChange(JSON.stringify(data)).then((res)=>{
            
        })
    }
    render() {    
        let { isLogin } = this.props
        let { cascaderChosen , dayList, roomList} = this.state
        return (
            <div>
                <div>
                    <Row style={{ padding: 20}}>
                        <Col span={5}>
                            <Cascader 
                            options={cascaderChosen} 
                            onChange={this.cascaderOnChange} 
                            loadData={this.cascaderLoadData}
                            value={[this.state.building, this.state.floor]}
                            changeOnSelect
                            placeholder="选择大楼/楼层" />
                        </Col>
                        <Col span={1}>
                        </Col>
                        <Col span={16}>
                        </Col>
                    </Row>
                </div>
                <div>
                    {roomList.map((room)=>{
                        return (
                            <Row style={{ padding: 20}}>
                                <Col span={24}>
                                    <div style={{border: '1px solid #d9d9d9', padding: 20}}>
                                        <Title level={4} style={{padding: 10,paddingLeft: 0}}>{room.roomName}</Title>
                                        <Row style={{ padding: 20, color: '#bfbfbf'}}>
                                            {`${room.country} ${room.province} ${room.city} ${room.building} ${room.floor}楼`}
                                        </Row>
                                        <div style={{ display: 'flex',flexDirection: 'row',flexWrap: 'wrap'}}>
                                            {room.devices && room.devices.map((device)=>{
                                                let actions = []
                                                if (device.state == 0) { actions.push(<div onClick={(e)=> this.stateControl(e,device.deviceId,room.roomId,'on')}><Icon type="check" />打开</div>)} 
                                                if (device.state == 1 || device.state == 2) {actions.push(<div onClick={(e)=> this.stateControl(e,device.deviceId,room.roomId,'off')}><Icon type="close" />关闭</div>)}
                                                if (device.deviceType == 'TV') {actions.push(<div onClick={(e)=> this.stateControl(e,device.deviceId,room.roomId,'tv_notify')}><Icon type="message"/>发送提醒</div>)}
                                                return(
                                                        <Card
                                                        hoverable
                                                        style={{ width: 240 }}
                                                        actions={actions}   
                                                        cover={
                                                            <img
                                                              alt="example"
                                                              src={(()=>{
                                                                    let pic = 'light_off'
                                                                    switch(device.deviceType) {
                                                                        case 'Light':
                                                                            if(device.state == 1) {
                                                                                pic = 'light_on'
                                                                            } else {
                                                                                pic = 'light_off'
                                                                            }
                                                                            break
                                                                        case 'AirCon':
                                                                            if(device.state == 1) {
                                                                                pic = 'aircon_on'
                                                                            } else {
                                                                                pic = 'aircon_off'
                                                                            }
                                                                            break
                                                                        default:
                                                                            if(device.state == 1) {
                                                                                pic = 'touchpad'
                                                                            } else {
                                                                                pic = 'touchpad'
                                                                            }
                                                                    }
                                                                    return require(`../../asset/device_pic/${pic}.png`)
                                                                })()}
                                                            />
                                                          }                                                   
                                                        >
                                                            <Card.Meta title={device.deviceName} description={device.deviceType} />
                                                            {(()=>{
                                                                let txt = '已关闭'
                                                                let color = '#ff4d4f'
                                                                switch(device.state) {
                                                                    case 0:
                                                                    txt = '已关闭'
                                                                    color = '#ff4d4f'
                                                                    break
                                                                    case 1:
                                                                    txt = '已开启'
                                                                    color = '#bae637'
                                                                    break
                                                                    case 2:
                                                                    txt = '提醒状态'
                                                                    color = '#faad14'
                                                                    break
                                                                    case 3:
                                                                    txt = '维修中'
                                                                    color = '#eb2f96'
                                                                    break
                                                                }
                                                                return <div style={{ paddingTop: 20, color: color }}>{txt}</div>
                                                            })()}
                                                        </Card>    
                                                )
                                                })
                                            }
                                            {room.devices.length == 0 && <div style={{ padding: 20 }}>暂时没有设备</div>}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin,
      deviceId: state.deviceControl.deviceId,
      deviceState: state.deviceControl.deviceState,
    };
};

export default connect(mapStateToProps, {logout})(DeviceControl);
  