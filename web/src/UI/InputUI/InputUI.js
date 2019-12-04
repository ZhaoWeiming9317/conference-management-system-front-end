import React from 'react'
import './InputUI.sass'
/** 
 *  输入框UI，下面为props的值
 *  getValue:function   父组件用来获得InputUI的value的值的回调函数
 *  type:string    输入的类型      text => 文本   password => 密码  
 *  label:string   Input的label
 */
class InputUI extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
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
    render() {    
        return (
            <div className={this.state.isFocus?"input_box_focus":"input_box"}>
                <div className={this.state.isFocus?"input_label_focus":"input_label"}>{this.props.label}</div>
                <input className={this.state.isFocus?"input_focus":"input"} type={this.props.type} label="用户名" value={this.state.value} onChange={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur}/>
            </div>
        )
    }  
}

export default InputUI