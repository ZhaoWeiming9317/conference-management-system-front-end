import React from 'react'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux'
import { logout } from '../../actions/index'
import {  Row, Col, Typography, Divider, Button} from 'antd';
const { Title } = Typography;
import { Link } from "react-router-dom";

class Conference extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            d: 0,
            h: 0,
            m: 0,
            s: 0
        }
    }  
    componentDidMount() {
        let cookie = localStorage.getItem('cookie') || 0
        console.log(cookie)
        const data = {cookie : cookie}    
        userLoginVerification(JSON.stringify(data)).then((res) => {
            if (res.state == 0) {
                this.props.logout()
            } else {
                this.countTime()
            }
        })
    };
    countTime = () => {  
        //获取当前时间  
        let date = new Date();  
        let now = date.getTime();  
        //设置截止时间  
        let str="2020/5/17 00:00:00";
        let endDate = new Date(str); 
        let end = endDate.getTime();  
        
        //时间差  
        let leftTime = end-now; 
        //定义变量 d,h,m,s保存倒计时的时间  
        let d,h,m,s;  
        if (leftTime>=0) {  
            d = this.PrefixInteger(Math.floor(leftTime/1000/60/60/24),2)  
            h = this.PrefixInteger(Math.floor(leftTime/1000/60/60%24),2)
            m = this.PrefixInteger(Math.floor(leftTime/1000/60%60),2)
            s = this.PrefixInteger(Math.floor(leftTime/1000%60),2)            
        }  
        this.setState(
            {d,h,m,s}
        )        
        //递归每秒调用countTime方法，显示动态时间效果  
        setTimeout(this.countTime,1000);  
    }  
    //num传入的数字，n需要的字符长度
    //js 数字前面自动补零
    PrefixInteger = (num, n) => {
        return (Array(n).join(0) + num).slice(-n);
    }   
       
    render() {    
        let { isLogin } = this.props
        let { d, h, m, s } = this.state
        return (
            <div>
                <Row style={{ padding: 20, paddingBottom: 0}}>
                    <Col span={5}>
                        <Title level={3} style={{padding: 10,paddingLeft: 0}}>会议面板</Title>
                    </Col>
                    <Col span={5} style={{height: 50, lineHeight: '50px'}}>
                        <Link to={`/main/conferencelist`}> 
                            <Button type="primary" ghost>
                                会议列表
                            </Button>
                        </Link>
                    </Col>
                    <Col span={11} style={{height: 50, lineHeight: '50px'}}>
                        <div style={{height: 50, lineHeight: '50px'}}>{ `距离会议结束${d}天${h}时${m}分${s}秒`}</div>
                    </Col>                    
                </Row>
                <Row style={{ padding: 20, paddingBottom: 0}}>
                </Row>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.userState.isLogin
    };
};

export default connect(mapStateToProps, {logout})(Conference);