import React from 'react'
import './Nav.sass'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import NavUI from '../../UI/NavUI/NavUI'
import { gotoDevice, gotoMeeting, gotoRoom, gotoUser } from '../../actions/index'
import { navList } from '../../constants/navListConstants'

class Nav extends React.Component {
    constructor(props) {
        super(props);
        this.handleIndex = this.handleIndex.bind(this)
    }  
    componentDidMount() {
    };
    handleIndex = res => {
        console.log(res)
        switch(res.value) {
            case 1:
                this.props.gotoMeeting()
                break;
            case 2:
                this.props.gotoUser()
                break;
            case 3:
                this.props.gotoRoom()
                break;
            case 4:
                this.props.gotoDevice()
                break;
            default:
       }        
    }   
    render() {    
        let { nav } = this.props
        return (
            <div className="nav__container">
                <NavUI list={navList} init={2} getIndex={this.handleIndex}></NavUI>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      nav: state.nav.nav
    };
};

export default connect(mapStateToProps, { gotoDevice, gotoMeeting, gotoRoom, gotoUser })(Nav);
  