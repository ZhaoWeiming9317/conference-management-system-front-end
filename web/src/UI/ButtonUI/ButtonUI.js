import React from 'react'
import './ButtonUI.sass'
/** 
 *  下拉菜单UI，下面为props的值
 *  buttonStyle:string   按钮样式    hollow => 中空且透明   fill => 填充   hollow-fill => 中空不透明
 *  label:string   
 *  size:string small middle large
 */
class ButtonUI extends React.Component {
    componentDidMount() {
    }
    render() {
        const {label , buttonStyle, onClick, size = 'middle'} = this.props
        return (
            <div className={`button button-${buttonStyle} button-${size}`} onClick={onClick}>
                {label}
            </div>
        )
    }  
}

export default ButtonUI