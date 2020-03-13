import React from 'react'
import { userLoginVerification, userShowInfo } from '../../api/apiUser'
import UserAdd from './../UserAdd/UserAdd';
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import { List, Typography, Card, Button, Modal } from 'antd';
const { Title, Paragraph, Text } = Typography;

class SelfInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [
                '快来参加会议',
                '快来参加会议2',
                '快来参加会议3'
              ],
            modalModifyVisible: false,
            info: {}
        }
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
        this.setState({info: this.props.info})
    };
    handleModify = () => {
        this.setState({ modalModifyVisible: true })
    }
    handleCancelModify = () => {
        this.setState({ modalModifyVisible: false })
        const data = { user_id: this.props.info.userId}
        userShowInfo(JSON.stringify(data)).then((res)=>{
            this.setState({
                info: res
            })
        })
    };
  
    render() {    
        let { info, modalModifyVisible } = this.state
        let role = "普通用户"
        if (info.role == 0) {
            role = "部门经理"
        } else if (info.role == 1) {
            role = "系统管理员"
        } else {
            role = "普通用户"
        }
        return (
            <div style={{ background: '#ECECEC', padding: '30px' }}>  
                <Card title={role} bordered={false} style={{ width: "auto" }}>
                  <Typography>
                    <Title>{info.name}</Title>
                    <Paragraph>
                        <Text strong>用户名</Text><Text>  {info.username}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>用户ID</Text><Text>  {info.userId}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>邮箱</Text><Text>  {info.email}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>电话</Text><Text>  {info.phone}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>性别</Text><Text>  {info.gender}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>组织</Text><Text>  {info.organization}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>部门</Text><Text>  {info.department}</Text>
                    </Paragraph>
                    <Paragraph>
                        <Text strong>职位</Text><Text>  {info.position}</Text>
                    </Paragraph>
                  </Typography>
                  <Button type="primary" onClick={this.handleModify} ghost>
                    修改
                   </Button>
                </Card>
                <Modal
                visible={modalModifyVisible}
                title="修改个人信息"
                onCancel={this.handleCancelModify}
                footer={null}
                destroyOnClose
                >
                    <UserAdd type="modify" data={info}></UserAdd>
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps, {logout})(SelfInfo);