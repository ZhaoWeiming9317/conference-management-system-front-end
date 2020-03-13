import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import { Row, Col, Typography, Cascader, Button, message, Modal, Dropdown, Menu, Popconfirm, Card, Icon} from 'antd';
import moment from 'moment'
import { roomBuildingSearch, roomFloorSearch } from '../../api/apiRoom'

const { Title } = Typography;
class FormControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            building: '',
            floor: '',
            cascaderChosen: [],
            roomList: [{roomName: '会议室01',
                        roomId: 1,
                        deviceList: [
                            {
                                deviceId: 1,
                                deviceName: '空调',
                                deviceType: 'GSDF4',
                                brand: '海尔'
                            },
                            {
                                deviceId: 2,
                                deviceName: '触摸板',
                                deviceType: 'GSDF4',
                                brand: '华为'
                            },
                            {
                                deviceId: 3,
                                deviceName: '灯',
                                deviceType: 'GSDI4',
                                brand: '飞利浦'
                            },
                            {
                                deviceId: 4,
                                deviceName: '灯',
                                deviceType: 'GSDI4',
                                brand: '飞利浦'
                            },
                        ]},{
                            roomName: '会议室02',
                            roomId: 2,
                            deviceList: [
                                {
                                    deviceId: 5,
                                    deviceName: '空调',
                                    deviceType: 'GSDF4',
                                    brand: '海尔'
                                },
                                {
                                    deviceId: 6,
                                    deviceName: '触摸板',
                                    deviceType: 'GSDF4',
                                    brand: '华为'
                                },
                                {
                                    deviceId: 7,
                                    deviceName: '灯',
                                    deviceType: 'GSDI4',
                                    brand: '飞利浦'
                                },
                                {
                                    deviceId: 8,
                                    deviceName: '灯',
                                    deviceType: 'GSDI4',
                                    brand: '飞利浦'
                                },
                            ]
                        },]
        }
        this.cascaderLoadData = this.cascaderLoadData.bind(this)
        this.cascaderOnChange = this.cascaderOnChange.bind(this)
    }  
    componentDidMount() {
        let cookie = localStorage.getItem('cookie') || 0
        console.log(cookie)
        const data = {cookie : cookie}    
        userLoginVerification(JSON.stringify(data)).then((res) => {
            if (res.state == 0) {
                this.props.logout()
            }
        })
        this.initExec()
    };
    initExec() {
        let cascaderChosen = []
        roomBuildingSearch().then((res)=>{
            res.map((item)=>{
                cascaderChosen.push(
                    {
                        value: item,
                        label: item,
                        isLeaf: false
                    }
                )
            })
            this.setState({
                cascaderChosen : cascaderChosen
            })
        })
    }
    cascaderOnChange(value) {
        if (value.length == 2) {
            this.setState({
                building: value[0],
                floor: value[1]
            })
        }
    }
    buildFloorDaySubmit() {
        let {building, floor} = this.state
        let data = {
            building: building,
            floor: floor
        }
        if (data['building'] == '' || data['floor'] == '') {
            message.error('大楼或楼层没有选择哦')
        } else {
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
                        label: item
                    }
                )    
            })
            this.setState({
                cascaderChosen : this.state.cascaderChosen
            })
        })
    }

    render() {    
        let { isLogin } = this.props
        let { cascaderChosen , dayList, roomList} = this.state
        return (
            <div className="user__container">
                <div className="user__table">
                    <Row style={{ padding: 20}}>
                        <Col span={5}>
                            <Cascader 
                            options={cascaderChosen} 
                            onChange={this.cascaderOnChange} 
                            loadData={this.cascaderLoadData}
                            changeOnSelect
                            placeholder="选择大楼/楼层" />,
                        </Col>
                        <Col span={1}>
                        </Col>
                        <Col span={2}>
                            <Button onClick={(e)=>this.buildFloorDaySubmit(e)}>确定</Button>,
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
                                        <div style={{ display: 'flex',flexDirection: 'row',flexWrap: 'wrap'}}>
                                            {room.deviceList.map((device)=>{
                                                return(
                                                        <Card
                                                        hoverable
                                                        style={{ width: 240 }}
                                                        actions={[
                                                            <div><Icon type="check" />打开</div>,
                                                            <div><Icon type="close" />关闭</div>,
                                                            <div><Icon type="ellipsis"/></div>,
                                                          ]}                                                      
                                                        >
                                                            <Card.Meta title={device.deviceName} description={device.deviceType} />
                                                        </Card>    
                                                )
                                                })
                                            }
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
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps, {logout})(FormControl);
  