import React from 'react'
import './NavUI.sass'
import { connect } from 'react-redux';

/**
 * 
 * 导航栏ui
 *  list:array 必填 [{'label': '会议室管理', 'index':'1'},{'label': '用户管理', 'index':'2'},....]
 *  init:int 非必填 默认为1
 *  getIndex:function 必填 父组件通过这个回调函数获得index
 * 
 */
class NavUI extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            index: props.init || 1
        };
    }  
    componentDidMount() {
    };
    handleChange = event => {
        this.setState({
            index: event.target.value
        })
        this.props.getIndex({value: event.target.value})
    }
    render() {    
        const { list } = this.props
        const NavList = list.map((listItem) =>
            <li className={`nav--ui__item ${ listItem.index === this.state.index ? 'nav--ui__item--choose' : 'nav--ui__item--not'}`} onClick={this.handleChange} value={listItem.index}>{listItem.label}</li>
        );
        return (
            <div className="nav--ui__container">
                <div className="nav--ui__icon"></div>
                <ul className="nav--ui__items">{NavList}</ul>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      isLogin: state.isLogin
    };
};

export default connect(mapStateToProps)(NavUI);
  