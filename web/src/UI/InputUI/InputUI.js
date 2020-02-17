import React from 'react'
import './InputUI.sass'

/** 
 * 
 *  输入框UI，下面为props的值
 *  getValue:function   父组件用来获得InputUI的value的值的回调函数
 *  type:string    输入的类型      text => 文本   password => 密码  
 *  label:string   Input的label
 *  status:string  success => 成功  fail => 失败  warning => 警告 normal => 普通  默认普通
 *  message:string  提示符
 *  size: small middle large
 *  name:string   输入的值的state名称，减少代码量
 *  下面为使用ref调用的方法
 *  clear: 将子组件的value清空
 *  updateValue: 父组件强制刷新子组件的value
 */
class InputUI extends React.Component {
    constructor(props) {
        super(props)
        // this.clearValue = this.clearValue.bind(this);
        this.state = {
            value: '',
            isFocus: false
        };
    }
    componentDidMount() {
    }
    handleChange = event => {
        this.setState({value: event.target.value})
        this.props.getValue({value: event.target.value,name: this.props.name || ''})
    }
    handleFocus = event => {
        this.setState({isFocus: true})
    }
    handleBlur = event => {
        this.setState({isFocus: false})
    }
    clear = event => {
        this.setState({value: ''})
    }
    updateValue = (value) => {
        this.setState({value: value})
    }
    render() {
        const { status = 'normal', label, type, message, size = 'middle'} = this.props
        const { isFocus, value } = this.state
        return (
            <div className={`input__box input__box--${size}`}>
                <div className={isFocus?"input__label":"input__label"}>{label}</div>
                    <input className={`input input__${status} input--${size}`} type={type} value={value} onChange={this.handleChange.bind(this)} onFocus={this.handleFocus} onBlur={this.handleBlur} autoComplete="new-password"/>
                <div className={`input__message input__message--${status}`}>{message || ''}</div>
            </div>
        )
    }  
}


export default InputUI