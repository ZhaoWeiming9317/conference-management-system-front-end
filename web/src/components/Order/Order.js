import React from 'react'
import './Order.sass'
import { userLoginVerification } from '../../api/apiUser'
import { connect } from 'react-redux';
import { logout } from '../../actions/index'
import {  Row, Col, Typography  } from 'antd';
const { Title } = Typography;

import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'


class Order extends React.Component {
    constructor(props) {
        super(props);
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
    onPanelChange(value, mode) {
        console.log(value, mode);
    };
    //合并单元格
    execArrWithColSpan(arr) {
        let beforeTime = arr[0].time
        let result = []
        arr.forEach((item,index,array)=>{
            if (index === 0) {
                result.push({
                    beforeTime: beforeTime,
                    afterTime: parseInt(item.time) + 1,
                    people: item.people,
                    chosen: item.chosen,
                    col: 1
                })
            } else if (index > 0) {
                if (item.people === result[result.length - 1].people && item.people !== '') {
                    result[result.length - 1].col++
                    result[result.length - 1].afterTime = parseInt(item.time) + 1
                } else {
                    result.push({
                        beforeTime: parseInt(item.time),
                        afterTime: parseInt(item.time) + 1,
                        people: item.people,
                        chosen: item.chosen,
                        col: 1
                    })
                }
            }
        })
        return result
    }      
    render() {    
        let { isLogin } = this.props
        let baseArr = [{time: '9', people: '赵韦铭', chosen: true},
                    {time: '10', people: '', chosen: false},
                    {time: '11', people: '', chosen: false},
                    {time: '12', people: '', chosen: false},
                    {time: '13', people: '', chosen: false},
                    {time: '14', people: '', chosen: false},
                    {time: '15', people: '', chosen: false},
                    {time: '16', people: '唐德轩', chosen: true},
                    {time: '17', people: '唐德轩', chosen: true},
                    {time: '18', people: '', chosen: false}];
        let execArr = this.execArrWithColSpan(baseArr)
        console.log(execArr)
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <div style={{border: '1px solid #d9d9d9', padding: 20}}>
                            <Title level={4} style={{padding: 10,paddingLeft: 0}}>会议室302</Title>
                            <div style={{padding: 10,paddingLeft: 0}}>地点: 南方科技大学 图书馆 302</div>
                            <table style={{ width: '100%',tableLayout:'fixed'}}>
                                <tbody >
                                    <tr style={{height:100}}>
                                        {execArr.map((item)=>{
                                            return(
                                                <td className={`item__chosen--${item.chosen}`} colspan={item.col} style={{border: '2px solid white',verticalAlign: 'top'}}>
                                                  <div style={{color: 'white',fontSize: 14}}>{`${item.beforeTime}:00 - ${item.afterTime}:00`}</div>  
                                                  <div style={{color: 'white'}}>{item.people}</div>  
                                                </td>
                                            )
                                        })}
                                    </tr>
                                    <tr style={{height:20}}>
                                        {baseArr.map((item)=>{
                                            return(
                                                <td>
                                                  <div style={{color: '#d9d9d9'}}>{`${item.time}:00`}</div>  
                                                </td>
                                            )
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Col>
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

export default connect(mapStateToProps, {logout})(Order);
  