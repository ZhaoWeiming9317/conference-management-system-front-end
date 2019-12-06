import React from 'react'
import './NavUI.sass'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group'

/**
 * 导航栏ui
 *  list [{'label': '会议室管理', 'avater':'1'},{'label': '用户管理', 'avater':'2'},....]
 */
class NavUI extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
    }  
    componentDidMount() {
    };
    render() {    
        let { isLogin } = this.props
        const list = [{'label': '会议室管理', 'avater':'1'},{'label': '用户管理', 'avater':'2'},
        {'label': '会议管理', 'avater':'3'},{'label': '设备管理', 'avater':'4'}]
        const NavList = list.map((listItem) =>
            <li className="nav--ui__item">{listItem.label}</li>
        );
        return (
            <div className="nav--ui__container">
                <div className="nav--ui__icon"></div>
                <ul className='nav--ui__items'>{NavList}</ul>
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
  