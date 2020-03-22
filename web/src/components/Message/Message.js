import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { messageSearch } from '../../api/apiMessage'
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
        userLoginVerification().then((res) => {
            if (res.state == 0) {
                this.props.logout()
            } else {
                this.init()
            }
        })
    }
    init() {
        let data = {
            username: this.props.username,
            page: 1,
            volume: 10
        }
        messageSearch(JSON.stringify(data)).then((res)=>{

        })
    }
    render() {    
        let { isLogin } = this.props
        let { data } = this.state
        return (
            <div>    
                <h3 style={{ marginBottom: 16 }}>你的信息</h3>
                <List
                    header={<div>信息通知</div>}
                    footer={<div>...</div>}
                    bordered
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                        {item}
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin,
      username: state.userState.username,
    };
};

export default connect(mapStateToProps, { logout })(Message);
