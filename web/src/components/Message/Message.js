import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import { List, Typography } from 'antd';

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [
                '快来参加会议',
                '快来参加会议2',
                '快来参加会议3'
              ]
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
    };
    render() {    
        let { isLogin } = this.props
        let { data } = this.state
        return (
            <div>    
                <h3 style={{ marginBottom: 16 }}>Default Size</h3>
                <List
                    header={<div>信息通知</div>}
                    footer={<div>...</div>}
                    bordered
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                        <Typography.Text mark>[ITEM]</Typography.Text> {item}
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps, {logout})(Message);
