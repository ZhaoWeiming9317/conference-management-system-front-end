import React from 'react'
import './ButtonUI.sass'
/** 
 *  下拉菜单UI，下面为props的值
 *  buttonStyle:string   按钮样式    hollow => 中空   fill => 填充
 *  label:string   
 */
class ButtonUI extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
    }
    render() {
        if (this.props.buttonStyle === 'hollow') {
            return (
                <div className="button button-hollow" onClick={this.props.onClick}>
                    {this.props.label}
                </div>
            )
        }else if(this.props.buttonStyle === 'fill'){
            return (
                <div className="button button-fill" onClick={this.props.onClick}>
                    {this.props.label}
                </div>
            )
        }    
    }  
}

export default ButtonUI