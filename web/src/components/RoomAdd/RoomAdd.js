import React from 'react'
import './Regist.sass'
import {roomAdd, roomDetail} from '../../api/apiRoom';
import InputUI from '../../UI/InputUI/InputUI'
import DropDownUI from '../../UI/DropDownUI/DropDownUI'
import ButtonUI from '../../UI/ButtonUI/ButtonUI'
import { connect } from 'react-redux';
import { gotoLogin } from '../../actions/index'
import { loginDropDownList } from '../../constants/dropDownListConstants'
/**
 * 
 *  会议室界面
 *  type:  add ===> 添加 modify ===> 修改  默认 add
 *  roomId:string
 *  
 */
class RoomAdd extends React.Component {
    constructor(props) {
      super(props);
      this.submitRegist = this.submitRegist.bind(this);
      this.getLvl = this.getLvl.bind(this);
      this.pageChange = this.pageChange.bind(this);
      this.canRegist = this.canRegist.bind(this);
      this.submitLabel = '注册'
      this.init = {
        room_name: '',
        country: '',
        province: '',
        city: '',
        block: '',
        building: '',
        floor: '',
        room_number: '',
        room_volume: '',
        mark: '',
      }
      if (props.type === 'add') {
        this.submitLabel = '添加会议室'
      } else {
        this.submitLabel = '更改会议室'
      }
    this.state = {
        ...this.init,
        page: 1, // 1 第一页， 2 第二页 ...
        };    
    };
    componentDidMount(){
        console.log(this.props.username)
        if (this.props.type === 'modify') {
            userShowInfo({username:this.props.username}).then((res)=> this.setState(res))    
        }
    }

    handleChange = res => {
        this.setState({
            username: res.value,
        });
        this.usernameMention(res.value)
    };

    pageChange = flag => {
        return (e)=>{
            const {room_name,country,province,city, block,building,floor,room_number,room_volume,mark} = this.state
            let nowPage = flag === 'forward' ? page + 1 :  page - 1
            // 由于react的内在机制，input的值会被清空，因此需要强制刷新
            this.setState({
                page: nowPage,
            },()=>{
                if (this.state.page === 1){
                    this.refs.updateCountry.updateValue(country)
                    this.refs.updateProvince.updateValue(province)
                    this.refs.updateCity.updateValue(city)        
                    this.refs.updateBlock.updateValue(block)
                    this.refs.updateBuilding.updateValue(city)    
                    this.refs.updateFloor.updateValue(city)    
                } else if (this.state.page === 2){
                    this.refs.updateOrganization.updateValue(organization)
                    this.refs.updateDepartment.updateValue(department)
                    this.refs.updatePosition.updateValue(position)        
                }
            });
    
        }
    }

    canRegist = event => {
        return true
    }

    submitRegist = event => {
        const {room_name,country,province,city, block,building,floor,room_number,room_volume,mark} = this.state
        const data = {room_name,country,province,city, block,building,floor,room_number,room_volume,mark}
        if (this.canRegist()) {
            userRegist(JSON.stringify(data)).then((res)=>{
                this.props.gotoLogin()
            })    
        };
    };

    render() {
        let postionInfor = (
            <div>
                <div key='country' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="country" label='国家' ref='updateCountry'></InputUI>
                </div>
                <div key='province' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="province" type='text' label='省份' ref='updateProvince' ></InputUI>
                </div>
                <div key='city' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="city" type='text' label='城市' ref='updateCity' ></InputUI>
                </div>
                <div key='block' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="block" type='text'  label='街区' ref='updateBlock'></InputUI>
                </div>
                <div key='building' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="building" type='text' label='大厦' ref='updateBuilding' ></InputUI>
                </div>
                <div key='floor' className = "roomadd__item roomadd__item--input">
                    <InputUI getValue={this.handleChange} name="floor" type='text' label='楼层' ref='updateFloor' ></InputUI>
                </div>
                <div key='backward' className = "roomadd__item roomadd__item--button">
                    <ButtonUI label="下一步" buttonStyle="fill" onClick={this.pageChange('forward')}></ButtonUI>
                </div>
            </div>
        )
      let fundamentalInfor = (
        <div>
            <div key='roomname' className = "roomadd__item roomadd__item--input">
                <InputUI getValue={this.handleChange} name="room_name" type='text' label='房间名称' ref='updateRoomName' ></InputUI>
            </div>
            <div key='roomnumber' className = "roomadd__item roomadd__item--input">
                <InputUI getValue={this.handleChange} name="room_number" type='text' label='房间编号' ref='updateRoomNumber' ></InputUI>
            </div>
            <div key='roomvolume' className = "roomadd__item roomadd__item--input">
                <InputUI getValue={this.handleChange} name="room_volume" type='text' label='房间容量' ref='updateRoomVolume'></InputUI>
            </div>
            <div key='mark' className = "roomadd__item roomadd__item--input">
                <InputUI getValue={this.handleChange} type='text' label='备注' ref='updateMark'></InputUI>
            </div>
            <div key='forward' className = "roomadd__item roomadd__item--button">
                <ButtonUI label="上一步" buttonStyle="fill" onClick={this.pageChange('backward')}></ButtonUI>
            </div>
            <div key='regist' className = "roomadd__item roomadd__item--button">
                <ButtonUI label={this.submitLabel} buttonStyle="hollow-fill" onClick={this.submitRegist}></ButtonUI>
            </div>
        </div>
      )

      let addDisplay, labelDisplay;      
      const {type = 'regist'} = this.props
      if (this.state.page === 1) {
        addDisplay = postionInfor
      } else if (this.state.page === 2) {
        addDisplay = fundamentalInfor
      } 
      // type: regist  ===> 注册  add ===> 添加 modify ===> 修改
      if (type === 'add') {
        labelDisplay = ( <div className="roomadd__label">添加会议室</div>)
      } else if (type === 'modify') {
        labelDisplay = ( <div className="roomadd__label">修改会议室</div>)
      }
      return (
        <div className={`roomadd__box roomadd__box--${type}`}>
            {labelDisplay}
            <form className="roomadd__form" noValidate autoComplete="off">
                {addDisplay}
            </form>
        </div>  
      );
    }
}
const mapStateToProps = (state) => {
    return{
        
    }
}
export default connect(mapStateToProps, { gotoLogin })(RoomAdd);