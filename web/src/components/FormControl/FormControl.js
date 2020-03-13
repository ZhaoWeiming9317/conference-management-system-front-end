import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import { Row, Col, Typography, Cascader, Button, message, Modal, Dropdown, Menu, Popconfirm,} from 'antd';
import moment from 'moment'
import { roomBuildingSearch, roomFloorSearch } from '../../api/apiRoom'

class FormControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            building: '',
            floor: '',
            cascaderChosen: [],
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
        let { cascaderChosen , dayList} = this.state
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
                        <Col span={15}>
                        </Col>
                        <Col span={1}>
                        </Col>
                    </Row>
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
  