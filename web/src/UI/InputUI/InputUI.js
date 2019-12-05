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
 *  下面为使用ref调用的方法
 *  clear: 将子组件的value清空
 */
class InputUI extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
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
        this.props.getValue({value: event.target.value})
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
    render() {
        const { status, label, type, message } = this.props
        const { isFocus, value } = this.state
        return (
            <div className="input__box">
                <div className={isFocus?"input__label--focus":"input__label"}>{label}</div>
                <input className={`input input__${status}`} type={type} value={value} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur}/>
                <div className={`input__message input__message--${status}`}>{message || ''}</div>
            </div>
        )
    }  
}


export default InputUI