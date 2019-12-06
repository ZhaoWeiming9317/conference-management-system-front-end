import React from 'react'
import './DropDownUI.sass'
/** 
 *  下拉菜单UI，下面为props的值
 *  getValue:function   父组件用来获得DropDownUI的value的值的回调函数
 *  list:array    下拉菜单列表 [{value: 0, label:admin}...]
 *  label:string   
 */
class DropDownUI extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            value: this.props.list[0].value,
            label: this.props.list[0].label
        };
    }
    componentDidMount() {
    }
    handleChange = event => {
        let list = this.props.list
        for (let item of list){
            if(item.label === event.target.innerHTML){
                this.props.getValue({value: item.value})
                this.setState(
                    {label: event.target.innerHTML}
                )        
            }
        }
    }
    render() {    
        const list = this.props.list;
        const listItems = list.map((listItem) =>
            <li className="drop_content_item" key={listItem.label} value={listItem.value}>{listItem.label}</li>
        );
        return (
            <div className="drop_box">
                <div className="drop_label">{this.props.label}</div>
                <div className="drop">
                    {this.state.label}
                </div>
                <ul className="drop_content" onClick={this.handleChange}>{listItems}</ul>
            </div>
        )
    }  
}

export default DropDownUI